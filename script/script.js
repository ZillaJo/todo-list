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
    completed: false,
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
      <div class="task-item" id="${todo.id}">
        
        <p class="task-title ${todo.completed ? "completed" : ""}" 
              data-id="${todo.id}">
            ${todo.title}
        </p>
        
        <div class="actions">
          <button class="edit-btn" data-id="${todo.id}">Edit</button>
          <button class="delete-btn" data-id="${todo.id}">
            <i class='bx bx-trash'></i>
          </button>
        </div>

      </div>
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

// ====== 7. Toggle Completed ======
// function toggleCompleted(id) {
//   tasks = tasks.map((task) =>
//     task.id === id ? { ...task, completed: !task.completed } : task
//   );
//   save(tasks);
//   renderTasks();
// }

// ====== 8. Edit a Task ======
function startEdit(id) {
  const taskEl = document.getElementById(id);
  const titleSpan = taskEl.querySelector(".task-title");
  const oldTitle = titleSpan.textContent;

  titleSpan.innerHTML = `
    <p><input type="text" value="${oldTitle}" class="edit-input">
    <button class="save-edit-btn">Save</button>
    </p>
  `;

  const input = titleSpan.querySelector(".edit-input");
  const saveBtn = titleSpan.querySelector(".save-edit-btn");

  saveBtn.addEventListener("click", () => {
    const newTitle = input.value.trim();
    if (!newTitle) return alert("Title cannot be empty");

    tasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task
    );

    save(tasks);
    renderTasks();
  });
}

// ====== 9. Event Listeners ======
addButton.addEventListener("click", addTodo);

todoList.addEventListener("click", (e) => {
  // DELETE ACTION
  const deleteBtn = e.target.closest(".delete-btn");
  if (deleteBtn) {
    deleteTodo(deleteBtn.dataset.id);
    return;
  }

  // COMPLETE ACTION
  const titleClick = e.target.closest(".task-title");
  if (titleClick) {
    toggleCompleted(titleClick.dataset.id);
    return;
  }

  // EDIT ACTION
  const editBtn = e.target.closest(".edit-btn");
  if (editBtn) {
    startEdit(editBtn.dataset.id);
    return;
  }
});

// ====== 10. Initialize Storage ======
const initializeLocalStorage = () => {
  if (!localStorage.getItem(LS_KEY)) {
    localStorage.setItem(LS_KEY, JSON.stringify([]));
  }
};

// ====== 11. DELETE ALL TASKS BUTTON ======
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
