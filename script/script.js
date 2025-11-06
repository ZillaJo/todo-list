// ====== 1. Declare Local Storage ======
const LS_KEY = "tasks";
let tasks = JSON.parse(localStorage.getItem(LS_KEY)) || [];

// ====== 2. Get Elements ======
const todoList = document.getElementById("todo-list");
const taskinput = document.getElementById("task-input");
const addButton = document.getElementById("add-btn");

// ====== 3. Local Storage Helpers ======
const save = (todos) => {
  localStorage.setItem(LS_KEY, JSON.stringify(todos));
};

const getTasks = () => {
  tasks = JSON.parse(localStorage.getItem(LS_KEY)) || [];
  return tasks;
};

// ====== 4. Add a New Todo ======
const addTodo = () => {
  const title = taskinput.value.trim();
  if (!title) return alert("Please enter a todo");

  const newTask = {
    id: Date.now().toString(),
    title,
  };

  tasks.unshift(newTask);
  save(tasks);
  renderTasks();
  taskinput.value = ""; // clear input field
};

// ====== 5. Render Tasks ======
function renderTasks() {
  todoList.innerHTML = tasks
    .map(
      (todo) => `
        <p id="${todo.id}">
          ${todo.title}
          <button class="delete-btn" data-id="${todo.id}">
            <i class='bx bx-trash'></i>
          </button>
        </p>
      `
    )
    .join("");
}

// ====== 6. Delete a Task ======
const deleteTodo = (idToDelete) => {
  tasks = tasks.filter((t) => t.id !== idToDelete);
  save(tasks);
  renderTasks();
};

// ====== 7. Event Listeners ======
addButton.addEventListener("click", addTodo);

todoList.addEventListener("click", (e) => {
  const deleteBtn = e.target.closest(".delete-btn");
  if (!deleteBtn) return; // click wasn't on a delete button
  const idToDelete = deleteBtn.dataset.id;
  deleteTodo(idToDelete);
});

// ====== 8. Initialize ======
const initializeLocalStorage = () => {
  if (!localStorage.getItem(LS_KEY)) {
    localStorage.setItem(LS_KEY, JSON.stringify([]));
  }
};

// ====== 9. DELETE ALL TASKS ======

document.getElementById("clear-all-btn").addEventListener("click", () => {
  if (confirm("Are you sure you want to clear all tasks?")) {
    tasks = [];
    save(tasks);
    renderTasks();
  }
});

initializeLocalStorage();
getTasks();
renderTasks();
