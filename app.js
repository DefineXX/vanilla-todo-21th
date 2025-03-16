document.addEventListener('DOMContentLoaded', () => {
  // Date-Picker trigger
  const calendarButton = document.querySelector('.calendar-button');
  const datePicker = document.getElementById('date-picker');

  // 캘린더 열기
  calendarButton.addEventListener('click', () => {
    datePicker.showPicker();
  });

  // 렌더링할 날짜 형식 변환
  const formatSelectedDate = (selectedDate) => {
    const year = selectedDate.getFullYear();
    const month = String(selectedDate.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
    const day = String(selectedDate.getDate()).padStart(2, '0');

    const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
    const weekday = weekdays[selectedDate.getDay()];

    return `${year}.${month}.${day} (${weekday})`;
  };

  let selectedDateStr =
    localStorage.getItem('selectedDate') ||
    new Date().toISOString().split('T')[0];
  let selectedDateObj = new Date(selectedDateStr);

  // 초기 날짜 설정 (현재 날짜)
  document.querySelector('.today-date').textContent =
    formatSelectedDate(selectedDateObj);

  // 날짜 선택 이벤트 처리
  datePicker.addEventListener('change', (e) => {
    selectedDateStr = e.target.value;

    // 선택한 날짜 저장
    localStorage.setItem('selectedDate', selectedDateStr);

    const dateParts = selectedDateStr.split('-');
    const selectedDateObj = new Date(
      Number(dateParts[0]), // 연도
      Number(dateParts[1]) - 1, // 월 (0부터 시작)
      Number(dateParts[2]) // 일
    );

    document.querySelector('.today-date').textContent =
      formatSelectedDate(selectedDateObj);

    renderTasksForSelectedDate();
    updateTaskCount();
  });

  // Task 추가 관련 요소들
  const addTaskForm = document.getElementById('add-task-form');
  const addTaskInput = document.querySelector('.add-task-input');
  const toDoList = document.getElementById('to-do-list');
  const doneList = document.getElementById('done-list');
  const noTasksToDo = document.getElementById('no-tasks-to-do');
  const noTasksDone = document.getElementById('no-tasks-done');

  // Task 개수 업데이트
  const updateTaskCount = () => {
    const todoListCount = toDoList.childElementCount;
    const doneListCount = doneList.childElementCount;

    if (todoListCount === 0) {
      noTasksToDo.style.display = 'block';
      noTasksToDo.textContent = 'Add Your Task!';
    } else {
      noTasksToDo.style.display = 'none';
    }

    if (doneListCount === 0) {
      noTasksDone.style.display = 'block';
      noTasksDone.textContent = 'No Tasks Done Yet!';
    } else {
      noTasksDone.style.display = 'none';
    }

    document.getElementById(
      'to-do-list-title'
    ).textContent = `To Do (${todoListCount})`;
    document.getElementById(
      'done-list-title'
    ).textContent = `Done (${doneListCount})`;
  };

  // Task 목록
  let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

  // Task 추가
  const addTask = () => {
    const taskValue = addTaskInput.value.trim();
    if (taskValue === '') return;

    // Task 객체 생성
    const task = {
      id: Date.now(),
      text: taskValue,
      completed: false,
      date: selectedDateStr,
    };

    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    // Task 렌더링
    if (task.date === selectedDateStr) {
      renderTask(task);
    }

    addTaskInput.value = '';
    updateTaskCount();
  };

  // Task 렌더링
  const renderTask = (taskObj) => {
    const { id, text, completed } = taskObj;

    // 성능 최적화를 위해 DocumentFragment 사용
    const fragment = document.createDocumentFragment();

    // Task Box + Delete Button
    const taskDeleteContainer = document.createElement('li');
    taskDeleteContainer.classList.add('task-delete-container');
    taskDeleteContainer.dataset.id = id; // Task ID 저장

    // Task Box
    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item', 'to-do-item');

    // Checkbox
    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');
    checkbox.checked = completed;

    // Task 내용
    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = text;

    if (completed) {
      taskItem.classList.add('done-item');
      taskText.classList.add('done-text');

      // 완료된 Task에 체크 아이콘 추가
      const checkIcon = document.createElement('img');
      checkIcon.src = 'icons/check.svg';
      checkIcon.alt = 'Check Icon';
      checkIcon.classList.add('check-icon');
      checkboxContainer.appendChild(checkIcon);
    }

    // 삭제 버튼
    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.classList.add('task-delete-button');
    taskDeleteButton.innerHTML =
      '<img src="icons/trash.svg" alt="Delete Icon">';

    // Task 삭제 Event Listener
    taskDeleteButton.addEventListener('click', () => {
      removeTask(id);
    });

    // Task 완료 상태 변경 Event Listener
    checkbox.addEventListener('change', () => {
      toggleTask(
        id,
        taskDeleteContainer,
        taskItem,
        taskText,
        checkboxContainer
      );
    });

    checkboxContainer.appendChild(checkbox);
    taskItem.appendChild(checkboxContainer);
    taskItem.appendChild(taskText);
    taskDeleteContainer.appendChild(taskItem);
    taskDeleteContainer.appendChild(taskDeleteButton);

    fragment.appendChild(taskDeleteContainer);

    if (completed) {
      doneList.appendChild(fragment);
    } else {
      toDoList.appendChild(fragment);
    }

    updateTaskCount();
  };

  // Task 삭제
  const removeTask = (id) => {
    tasks = tasks.filter((task) => task.id !== id);
    localStorage.setItem('tasks', JSON.stringify(tasks));

    document.querySelector(`[data-id="${id}"]`).remove();
    updateTaskCount();
  };

  // Task 완료 상태 변경
  const toggleTask = (
    id,
    taskDeleteContainer,
    taskItem,
    taskText,
    checkboxContainer
  ) => {
    const task = tasks.find((task) => task.id === id);
    task.completed = !task.completed;
    localStorage.setItem('tasks', JSON.stringify(tasks));

    taskItem.classList.toggle('done-item');
    taskText.classList.toggle('done-text');

    if (task.completed) {
      const checkIcon = document.createElement('img');
      checkIcon.src = 'icons/check.svg';
      checkIcon.alt = 'Check Icon';
      checkIcon.classList.add('check-icon');
      checkboxContainer.appendChild(checkIcon);

      doneList.appendChild(taskDeleteContainer);
    } else {
      const checkIcon = document.querySelector('.check-icon');
      if (checkIcon) checkIcon.remove();

      toDoList.appendChild(taskDeleteContainer);
    }

    updateTaskCount();
  };

  // 선택된 날짜에 대한 Task 렌더링
  const renderTasksForSelectedDate = () => {
    toDoList.innerHTML = '';
    doneList.innerHTML = '';

    const filteredTasks = tasks.filter((task) => task.date === selectedDateStr);
    filteredTasks.forEach((task) => renderTask(task));
  };

  renderTasksForSelectedDate();

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (addTaskInput.value.trim() === '') {
      alert('Please Enter Your Task!');
      return;
    } else {
      addTask();
    }
  });

  addTaskForm.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  // 초기 화면 로딩 시 Task 개수 업데이트
  updateTaskCount();
});
