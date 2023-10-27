document.addEventListener('DOMContentLoaded', function () {
    const todoForm = document.getElementById('todo-form');
    const todoInput = document.getElementById('todo-input');
    const todoList = document.getElementById('todo-list');
    const filterSelect = document.getElementById('filter');
    const taskCount = document.getElementById('task-count');
    const clearCompletedButton = document.getElementById('clear-completed');

    let tasks = [];

    todoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const taskText = todoInput.value.trim();

        if (taskText === '') {
            alert('Tehtävä ei voi olla tyhjä.');
            return;
        }

        const newTask = {
            text: taskText,
            completed: false
        };

        tasks.push(newTask);
        updateLocalStorage();
        renderTasks();
        todoInput.value = '';
    });

    function renderTasks() {
        todoList.innerHTML = '';

        const filter = filterSelect.value;
        let filteredTasks = tasks;

        if (filter === 'active') {
            filteredTasks = tasks.filter(task => !task.completed);
        } else if (filter === 'completed') {
            filteredTasks = tasks.filter(task => task.completed);
        }

        filteredTasks.forEach((task, index) => {
            const listItem = document.createElement('li');
            listItem.style.display = 'none'; 
            listItem.innerHTML = `
                <input type="checkbox" class="complete-checkbox" ${task.completed ? 'checked' : ''}>
                <span class="${task.completed ? 'completed' : ''}">${task.text}</span>
                <button class="delete-button">Poista</button>
            `;

            const checkbox = listItem.querySelector('.complete-checkbox');
            const textSpan = listItem.querySelector('span');
            const deleteButton = listItem.querySelector('.delete-button');

            checkbox.addEventListener('change', function () {
                task.completed = checkbox.checked;
                updateLocalStorage();
                renderTasks();
            });

            deleteButton.addEventListener('click', function () {
                $(listItem).fadeOut('fast', function() {
                    tasks.splice(index, 1);
                    updateLocalStorage();
                    renderTasks();
                });
            });

            todoList.appendChild(listItem);
            $(listItem).fadeIn(); 
        });

        const activeTasksCount = tasks.filter(task => !task.completed).length;
        taskCount.textContent = `${activeTasksCount} tehtävää jäljellä`;

        clearCompletedButton.style.display = tasks.some(task => task.completed) ? 'block' : 'none';
    }

    filterSelect.addEventListener('change', renderTasks);

    clearCompletedButton.addEventListener('click', function () {
        $('.complete-checkbox:checked').parent().fadeOut('fast', function() {
            tasks = tasks.filter(task => !task.completed);
            updateLocalStorage();
            renderTasks();
        });
    });

    function updateLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadFromLocalStorage() {
        const storedTasks = localStorage.getItem('tasks');
        if (storedTasks) {
            tasks = JSON.parse(storedTasks);
        }
    }

    loadFromLocalStorage();
    renderTasks();
});
