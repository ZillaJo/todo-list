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

// Add todo on Enter key press in the input
taskinput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" || e.keyCode === 13) {
    e.preventDefault();
    addTodo();
  }
});

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

//====== 7. Toggle Completed ======
function toggleCompleted(id) {
  tasks = tasks.map((task) =>
    task.id === id ? { ...task, completed: !task.completed } : task
  );
  save(tasks);
  renderTasks();
}


todoList.addEventListener("dblclick", (e) => {
  const titleEl = e.target.closest(".task-title");
  if (!titleEl) return;
  const id = titleEl.dataset.id;
  if (id) toggleCompleted(id);
});




// ====== 8. Edit a Task ======
function startEdit(id) {
  const taskEl = document.getElementById(id);
  if (!taskEl) return;
  const titleSpan = taskEl.querySelector(".task-title");
  const oldTitle = titleSpan.textContent.trim();

  titleSpan.innerHTML = `
    <p>
      <input type="text" value="${oldTitle.replace(/"/g, "&quot;")}" class="edit-input">
      <button class="save-edit-btn">Save</button>
    </p>
  `;

  const input = titleSpan.querySelector(".edit-input");
  const saveBtn = titleSpan.querySelector(".save-edit-btn");

  input.focus();
  input.select();

  const finishEdit = () => {
    const newTitle = input.value.trim();
    if (!newTitle) {
      alert("Title cannot be empty");
      input.focus();
      return;
    }

    tasks = tasks.map((task) =>
      task.id === id ? { ...task, title: newTitle } : task
    );

    save(tasks);
    renderTasks();
  };

  const onKeyDown = (e) => {
    if (e.key === "Enter") {
      finishEdit();
    } else if (e.key === "Escape") {
      renderTasks();
    }
  };

  saveBtn.addEventListener("click", finishEdit);
  input.addEventListener("keydown", onKeyDown);
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
