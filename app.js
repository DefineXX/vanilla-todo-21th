const formattedTodayDate = () => {
  const today = new Date();

  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0'); // 월은 0부터 시작하므로 +1
  const day = String(today.getDate()).padStart(2, '0');

  const weekdays = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const weekday = weekdays[today.getDay()];

  return `${year}.${month}.${day} (${weekday})`;
};

document.querySelector('.today-date').textContent = formattedTodayDate();

const taskInput = document.querySelector('.add-task-input');
const addTaskButton = document.querySelector('.add-task-button');
const toDoList = document.getElementById('to-do-list');
const doneList = document.getElementById('done-list');

// Task 개수 업데이트
const updateTaskCount = () => {
  const todoListCount = toDoList.childElementCount;
  const doneListCount = doneList.childElementCount;

  document.getElementById(
    'to-do-list-title'
  ).textContent = `To Do (${todoListCount})`;
  document.getElementById(
    'done-list-title'
  ).textContent = `Done (${doneListCount})`;
};

document.addEventListener('DOMContentLoaded', () => {
  const addTask = () => {
    const taskValue = taskInput.value.trim();
    if (taskValue === '') {
      alert('Please Enter Your Task!');
      return;
    }

    const taskDeleteContainer = document.createElement('li');
    taskDeleteContainer.classList.add('task-delete-container');

    const taskItem = document.createElement('div');
    taskItem.classList.add('task-item', 'to-do-item');

    const checkboxContainer = document.createElement('div');
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
        taskText.classList.add('done-task');

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

    taskInput.value = '';

    updateTaskCount();
  };

  addTaskButton.addEventListener('click', (e) => {
    e.preventDefault();
    addTask();
  });

  taskInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTask();
    }
  });
});

// 초기 화면 로딩 시 Task 개수 업데이트
updateTaskCount();
