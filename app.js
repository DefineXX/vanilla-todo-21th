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

  // 초기 날짜 설정 (현재 날짜)
  const today = new Date();

  document.querySelector('.today-date').textContent = formatSelectedDate(today);

  // 날짜 선택 이벤트 처리
  const handleDateSelect = () => {
    const selectedDate = datePicker.value;

    let dateParts = selectedDate.split('-');
    let dateObject = new Date(
      Number(dateParts[0]), // 연도
      Number(dateParts[1]) - 1, // 월 (0부터 시작)
      Number(dateParts[2]) // 일
    );

    document.querySelector('.today-date').textContent =
      formatSelectedDate(dateObject);
  };

  // 날짜 선택 이벤트 처리
  datePicker.addEventListener('change', () => {
    handleDateSelect();
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

  const addTask = () => {
    const taskValue = addTaskInput.value.trim();

    const taskDeleteContainer = document.createElement('li');
    taskDeleteContainer.classList.add('task-delete-container');

    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item', 'to-do-item');

    const checkboxContainer = document.createElement('label');
    checkboxContainer.classList.add('checkbox-container');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');

    checkboxContainer.appendChild(checkbox);

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = taskValue;

    const taskDeleteButton = document.createElement('button');
    taskDeleteButton.classList.add('task-delete-button');
    taskDeleteButton.innerHTML =
      '<img src="icons/trash.svg" alt="Delete Icon">';

    // Task 삭제 Event Listener
    taskDeleteButton.addEventListener('click', () => {
      taskDeleteContainer.remove();
      updateTaskCount();
    });

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        taskItem.classList.remove('to-do-item');
        taskItem.classList.add('done-item');
        taskText.classList.add('done-text');

        const checkIcon = document.createElement('img');
        checkIcon.src = 'icons/check.svg';
        checkIcon.alt = 'Check Icon';
        checkIcon.classList.add('check-icon');
        checkboxContainer.appendChild(checkIcon);

        doneList.appendChild(taskDeleteContainer);
      } else {
        taskItem.classList.remove('done-item');
        taskItem.classList.add('to-do-item');
        taskText.classList.remove('done-text');

        const checkIcon = document.querySelector('.check-icon');
        if (checkIcon) {
          checkIcon.remove();
        }

        toDoList.appendChild(taskDeleteContainer);
      }

      updateTaskCount();
    });

    taskItem.appendChild(checkboxContainer);
    taskItem.appendChild(taskText);

    taskDeleteContainer.appendChild(taskItem);
    taskDeleteContainer.appendChild(taskDeleteButton);

    toDoList.appendChild(taskDeleteContainer);

    addTaskInput.value = '';

    updateTaskCount();
  };

  addTaskForm.addEventListener('submit', (e) => {
    e.preventDefault();

    if (addTaskInput.value.trim() === '') {
      alert('Please Enter Your Task!');
      return;
    } else {
      addTask();
    }
  });

  addTaskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });

  // 초기 화면 로딩 시 Task 개수 업데이트
  updateTaskCount();
});
