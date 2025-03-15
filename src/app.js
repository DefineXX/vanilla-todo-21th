document.addEventListener('DOMContentLoaded', () => {
  const taskInput = document.querySelector('.add-task-input');
  const addTaskButton = document.querySelector('.add-task-button');
  const taskList = document.querySelector('.task-list');

  const addTask = () => {
    const taskValue = taskInput.value.trim();
    if (taskValue === '') alert('Please Enter Your Task!');

    const taskItem = document.createElement('li');
    taskItem.classList.add('task-item', 'to-do');

    const checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.classList.add('task-checkbox');

    const taskText = document.createElement('span');
    taskText.classList.add('task-text');
    taskText.textContent = taskValue;

    taskItem.appendChild(checkbox);
    taskItem.appendChild(taskText);

    taskList.appendChild(taskItem);

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
