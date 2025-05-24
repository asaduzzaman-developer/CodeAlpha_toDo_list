let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function createTaskElement(task, index) {
    const li = document.createElement("li");

    const taskText = document.createElement("span");
    taskText.textContent = task.text;
    if (task.completed) taskText.classList.add("completed");

    // Create edit input field (hidden by default)
    const editInput = document.createElement("input");
    editInput.type = "text";
    editInput.className = "edit-input";
    editInput.value = task.text;
    editInput.style.display = "none";

    taskText.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    });

    const actions = document.createElement("div");
    actions.className = "task-actions";

    const completeBtn = document.createElement("button");
    completeBtn.className = "complete-btn";
    completeBtn.innerHTML = `<i class="ri-check-line"></i>`;
    completeBtn.title = "Mark as complete";
    completeBtn.addEventListener("click", () => {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    });

    const editBtn = document.createElement("button");
    editBtn.className = "edit-btn";
    editBtn.innerHTML = `<i class="ri-edit-line"></i>`;
    editBtn.title = "Edit task";
    if (task.completed) {
        editBtn.disabled = true;
        editBtn.classList.add("disabled");
    } else {
        editBtn.addEventListener("click", () => {
            taskText.style.display = "none";
            editInput.style.display = "block";
            editInput.focus();
            editInput.select();
        });
    }

    const deleteBtn = document.createElement("button");
    deleteBtn.className = "delete-btn";
    deleteBtn.innerHTML = `<i class="ri-delete-bin-line"></i>`;
    deleteBtn.title = "Delete task";
    if (task.completed) {
        deleteBtn.disabled = true;
        deleteBtn.classList.add("disabled");
    } else {
        deleteBtn.addEventListener("click", () => {
            if (confirm("Are you sure you want to delete this task?")) {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            }
        });
    }

    // Handle edit input events
    editInput.addEventListener("keydown", (e) => {
        if (e.key === "Enter") {
            const newText = editInput.value.trim();
            if (newText) {
                tasks[index].text = newText;
                saveTasks();
                renderTasks();
            }
        } else if (e.key === "Escape") {
            editInput.value = task.text;
            taskText.style.display = "block";
            editInput.style.display = "none";
        }
    });

    editInput.addEventListener("blur", () => {
        const newText = editInput.value.trim();
        if (newText) {
            tasks[index].text = newText;
            saveTasks();
            renderTasks();
        } else {
            editInput.value = task.text;
            taskText.style.display = "block";
            editInput.style.display = "none";
        }
    });

    actions.appendChild(completeBtn);
    actions.appendChild(editBtn);
    actions.appendChild(deleteBtn);
    li.appendChild(taskText);
    li.appendChild(editInput);
    li.appendChild(actions);
    return li;
}

function renderTasks() {
    const list = document.getElementById("task-list");
    list.innerHTML = "";
    
    if (tasks.length === 0) {
        const emptyState = document.createElement("div");
        emptyState.className = "empty-state";
        emptyState.innerHTML = `
            <i class="ri-inbox-line"></i>
            <p>No tasks yet! Add one above.</p>
        `;
        list.appendChild(emptyState);
        return;
    }

    tasks.forEach((task, index) => {
        const taskElement = createTaskElement(task, index);
        list.appendChild(taskElement);
    });
}

document.getElementById("task-form").addEventListener("submit", function(e) {
    e.preventDefault();
    const input = document.getElementById("task-input");
    const newTask = input.value.trim();
    
    if (newTask) {
        tasks.push({ text: newTask, completed: false });
        saveTasks();
        renderTasks();
        input.value = "";
        input.focus();
    }
});

// Add keyboard shortcut to focus input
document.addEventListener("keydown", (e) => {
    if (e.key === "/" && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        document.getElementById("task-input").focus();
    }
});

renderTasks();
