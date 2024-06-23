document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskInput = document.getElementById('task-input');
    const taskList = document.getElementById('task-list');

    taskForm.addEventListener('submit', addTask);
    taskList.addEventListener('click', removeOrUpdateTask);
    loadTasks();

    function addTask(e) {
        e.preventDefault();
        const taskText = taskInput.value.trim();
        if (taskText === '') return;
        const task = { id: Date.now(), text: taskText };
        addTaskToDOM(task);
        saveTask(task);
        taskInput.value = '';
    }

    function removeOrUpdateTask(e) {
        if (e.target.tagName === 'BUTTON') {
            const taskId = e.target.parentElement.dataset.id;
            if (e.target.textContent === 'מחק') {
                removeTask(taskId);
                e.target.parentElement.remove();
            } else {
                const newText = prompt('עדכן את המשימה:', e.target.parentElement.firstChild.textContent);
                if (newText) {
                    updateTask(taskId, newText);
                    e.target.parentElement.firstChild.textContent = newText;
                }
            }
        }
    }

    function addTaskToDOM(task) {
        const li = document.createElement('li');
        li.dataset.id = task.id;
        li.innerHTML = `${task.text} <button>עדכן</button> <button>מחק</button>`;
        taskList.appendChild(li);
    }

    function saveTask(task) {
        const tasks = getTasksFromLocalStorage();
        tasks.push(task);
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function removeTask(id) {
        let tasks = getTasksFromLocalStorage();
        tasks = tasks.filter(task => task.id !== Number(id));
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function updateTask(id, newText) {
        const tasks = getTasksFromLocalStorage();
        const taskIndex = tasks.findIndex(task => task.id === Number(id));
        tasks[taskIndex].text = newText;
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = getTasksFromLocalStorage();
        tasks.forEach(task => addTaskToDOM(task));
    }

    function getTasksFromLocalStorage() {
        return JSON.parse(localStorage.getItem('tasks')) || [];
    }
});
