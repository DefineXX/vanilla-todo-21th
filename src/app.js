document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.querySelector('.add-task-input');
  const addTaskButton = document.querySelector('.add-task-button');
  const toDoList = document.getElementById('to-do-list');
  const doneList = document.getElementById('done-list');

  const addTask = () => {
    const taskValue = taskInput.value.trim();
    if (taskValue === '') {
      alert('Please Enter Your Task!');
      return;
    }

    const taskItem = document.createElement('li');
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

    checkbox.addEventListener('change', () => {
      if (checkbox.checked) {
        taskItem.classList.remove('to-do-item');
        taskItem.classList.add('done-item');
        taskText.classList.add('done-task');

        const checkIcon = document.createElement('img');
        checkIcon.src = 'public/check.svg';
        checkIcon.alt = 'Check Icon';
        checkIcon.classList.add('check-icon');
        checkboxContainer.appendChild(checkIcon);

        doneList.appendChild(taskItem);
      } else {
        taskItem.classList.remove('done-item');
        taskItem.classList.add('to-do-item');
        taskText.classList.remove('done-text');

        const checkIcon = document.querySelector('.check-icon');
        if (checkIcon) {
          checkIcon.remove();
        }

        toDoList.appendChild(taskItem);
      }
    });

    taskItem.appendChild(checkboxContainer);
    taskItem.appendChild(taskText);

    toDoList.appendChild(taskItem);

    taskInput.value = '';
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
