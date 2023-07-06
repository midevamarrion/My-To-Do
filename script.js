const todoContainer = document.getElementById('todos');
const addTodoForm = document.getElementById('addTodoForm');
const todoInput = document.getElementById('todoInput');
let todos = [];

const getTodos = () => {
  return fetch('https://dummyjson.com/todos/user/17')
    .then(response => response.json())
    .then(response => {
      todos = response.todos;
      console.log(todos);
    });
};

const displayTodos = () => {
  todoContainer.innerHTML = '';
  todos.forEach(item => {
    const div = document.createElement('div');
    const todo = document.createElement('h2');
    const completed = document.createElement('p');
    const checkbox = document.createElement('input');
    const deleteButton = document.createElement('button');
    const updateButton = document.createElement('button');

    todo.innerHTML = item.todo;
    completed.innerHTML = `Task completed: ${item.completed}`;
    checkbox.type = 'checkbox';
    checkbox.checked = item.completed;
    checkbox.addEventListener('change', () => updateTodoStatus(item.id, checkbox.checked));

    deleteButton.textContent = 'Delete';
    deleteButton.addEventListener('click', () => deleteTodo(item.id));

    updateButton.textContent = 'Update';
    updateButton.addEventListener('click', () => updateTodoItem(item.id));

    div.appendChild(todo);
    div.appendChild(completed);
    div.appendChild(checkbox);
    div.appendChild(deleteButton);
    div.appendChild(updateButton);

    div.setAttribute('key', item.id);
    div.setAttribute('class', 'todo');

    if (item.completed) {
      div.classList.add('completed');
    } else {
      div.classList.add('uncompleted');
    }

    todoContainer.appendChild(div);
  });
};

const addTodo = () => {
  const todo = todoInput.value.trim();
  if (todo === '') {
    
    return;
  }

  fetch('https://dummyjson.com/todos/add', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      todo,
      completed: false,
      userId: 17,
    }),
  })
    .then(response => response.json())
    .then(response => {
      todos.push(response);
      displayTodos();
      todoInput.value = '';
    })
    .catch(error => {
      console.error('Error adding todo:', error);
    });
};

const deleteTodo = todoId => {
  fetch(`https://dummyjson.com/todos/${todoId}`, {
    method: 'DELETE',
  })
    .then(() => {
      todos = todos.filter(item => item.id !== todoId);
      displayTodos();
    })
    .catch(error => {
      console.error('Error deleting todo:', error);
    });
};

const updateTodoItem = itemId => {
  const todoItem = todos.find(item => item.id === itemId);
  if (todoItem) {
    const newTodo = prompt('Enter updated task:', todoItem.todo);
    if (newTodo) {
      todoItem.todo = newTodo;
      console.log(`Todo item ${itemId} updated.`);
      displayTodos();
    }
  }
};

const updateTodoStatus = (itemId, checked) => {
  const todoItem = todos.find(item => item.id === itemId);
  if (todoItem) {
    todoItem.completed = checked;
    console.log(`Todo item ${itemId} status updated.`);
    displayTodos();
  }
};

addTodoForm.addEventListener('submit', event => {
  event.preventDefault();
  addTodo();
});

getTodos()
  .then(() => {
    displayTodos();
  });
