document.addEventListener('DOMContentLoaded', function () {
    const addTodoBtn = document.getElementById('addTodoBtn');
    const todoForm = document.getElementById('todoForm');
    const todoName = document.getElementById('todoName');
    const dueDate = document.getElementById('dueDate');
    const description = document.getElementById('description');
    const todoList = document.getElementById('todoList');
    const congratulationsPrompt = document.getElementById('congratulationsPrompt');

    function fetchTodos() {
        fetch('/all')
            .then(response => response.json())
            .then(todos => {
                todos.forEach(todo => {
                    renderTodo(todo.name, todo.date, todo.description, todo.id, todo.completed);
                });
            })
            .catch(error => console.error('Error fetching todos:', error));
    }

    function markTodoComplete(id) {
        fetch('/complete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: id })
        })
            .then(response => response.json())
            .then(data => {
                congratulationsPrompt.style.display = 'block';

                setTimeout(() => {
                    congratulationsPrompt.style.display = 'none';
                }, 5000);
            })
            .catch(error => console.error('Error marking todo as complete:', error));
    }

    function renderTodo(name, date, desc, id, completed) {
        const listItem = document.createElement('li');
        listItem.innerHTML = `
            <strong>${name}</strong> Due Date: ${date}<br>${desc}
            <button class="removeTodo">Remove</button>
            <button class="completeTodo">Complete</button>
        `;

        const removeBtn = listItem.querySelector('.removeTodo');
        removeBtn.addEventListener('click', function () {
            fetch(`/delete/${id}`, {
                method: 'DELETE'
            })
                .then(response => response.json())
                .then(data => {
                    todoList.removeChild(listItem);
                })
                .catch(error => console.error('Error deleting todo:', error));
        });

        const completeBtn = listItem.querySelector('.completeTodo');
        completeBtn.addEventListener('click', function () {
            markTodoComplete(id);
            listItem.classList.add("completed-todo");
        });

        if (completed) {
            listItem.classList.add("completed-todo");
        }

        todoList.appendChild(listItem);
    }

    fetchTodos();

    addTodoBtn.addEventListener('click', function () {
        if (todoForm.style.display === 'none' || todoForm.style.display === '') {
            todoForm.style.display = 'block';
        } else {
            todoForm.style.display = 'none';
        }
    });

    submitTodo.addEventListener('click', function (e) {
        e.preventDefault()
        const name = todoName.value;
        const date = dueDate.value;
        const desc = description.value;

        if (name.trim() === "") {
            alert("Please enter a To-Do Name");
            return;
        }

        renderTodo(name, date, desc);

        fetch('/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: name, date: date, description: desc })
        })
            .then(response => response.json())
            .then(data => {
                todoName.value = "";
                dueDate.value = "";
                description.value = "";
                todoForm.style.display = 'none';
            })
            .catch(error => console.error('Error adding todo:', error));
    });
});
