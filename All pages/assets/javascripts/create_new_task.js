const url = "assets/data/employees_data.json";
const selectEmployee = document.getElementById("AssignMembersSelect");
const form = document.getElementById("add-task-form");
const selectedEmployeesSpan = document.getElementById("selected-employees");
let tasks = (localStorage.tasks && JSON.parse(localStorage.tasks)) || [];
let selectedEmployees = [];
let editMode = false;
let editedTaskId = null;
let badgeMapper = {
  high: "danger",
  medium: "warning",
  low: "primary",
};
const formFields = {
  taskTitle: document.getElementById("TaskTitle"),
  status: document.getElementById("Status"),
  startDate: document.getElementById("StartDate"),
  dueDate: document.getElementById("DueDate"),
  description: document.getElementById("Description"),
};

// initialize the modal
const modal = document.getElementById("new-task-form");
if (!bootstrap.Modal.getInstance(modal)) {
  new bootstrap.Modal(modal);
}

// Set default starting date to be today
formFields.startDate.value = new Date().toISOString().split("T")[0];

selectEmployee.addEventListener("change", (event) => {
  // Add the employee to the task
  const employeeName = selectEmployee.value;
  selectEmployeeToTheTask(employeeName);
});

function selectEmployeeToTheTask(employeeName) {
  selectedEmployees.push(employeeName);

  // Create a badge to display the selected employee
  let span = document.createElement("span");
  span.className = "badge text-bg-secondary pointer me-1";
  span.textContent = employeeName;
  span.id = employeeName;
  let icon = document.createElement("i");
  icon.className = "bi bi-x";
  span.appendChild(icon);
  selectedEmployeesSpan.appendChild(span);

  // Add delete the span on click event and remove employee from the list
  span.addEventListener("click", (event) => {
    selectedEmployees = selectedEmployees.filter((val) => val !== employeeName);
    span.remove();
    if (selectedEmployees.length === 0) {
      selectEmployee.required = true;
    }

    // Unhide the employee option
    const option = document.querySelector(`option[value="${employeeName}"]`);
    option.style.display = "";
  });

  selectEmployee.required = false;
  selectEmployee.value = "";

  // Hide the selected option after choosing it.
  const option = document.querySelector(`option[value="${employeeName}"]`);
  option.style.display = "none";
}

// Get the employee data from the Json file
async function getData() {
  const response = await fetch(url);
  const jsonData = await response.json();

  // Add the employee names as option to the select input
  function addEmployeeToTheSelect(employee) {
    const option = document.createElement("option");
    option.value = employee["Full Name"];
    option.textContent = employee["Full Name"];
    // Remove the option after selecting
    selectEmployee.appendChild(option);
  }

  jsonData.forEach((employee) => {
    addEmployeeToTheSelect(employee);
  });
}
// Initialize the first dropdowns
getData();

function addTaskToLocalStorage(task) {
  if (editMode) {
    task.id = editedTaskId;
    tasks[editedTaskId] = task;
    editTaskCard(task);
  } else {
    task.id = tasks.length;
    tasks.push(task);
    addTaskToPage(task);
  }
  localStorage.tasks = JSON.stringify(tasks);

  // Display the new task on the page.
}

// Edit the task card
function editTaskCard(task) {
  console.log(task);
  const taskCard = document.querySelector(`#task-card-${task.id}`);
  let newTaskCard = createTaskCard(task);
  taskCard.parentNode.replaceChild(newTaskCard, taskCard);
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the data from the form
  let taskData = {
    date: new Date().toString(),
    assignMembersSelect: selectedEmployees,
    priority: document.querySelector('input[name="Priority"]:checked').value,
  };
  Object.keys(formFields).forEach((key) => {
    taskData[key] = formFields[key].value;
  });
  addTaskToLocalStorage(taskData);

  // Clear form data
  restForm();
  bootstrap.Modal.getInstance(modal).hide();
});

// reset form
function restForm() {
  form.reset();
  formFields.startDate.value = new Date().toISOString().split("T")[0];
  selectedEmployeesSpan.innerHTML = "";
}

function createTaskCard(task) {
  let taskDiv = document.createElement("div");
  taskDiv.className = "task";
  taskDiv.id = `task-card-${task.id}`;

  // Create the badge
  let badgeDiv = document.createElement("div");
  badgeDiv.className = "badge bg-" + badgeMapper[task.priority];
  badgeDiv.textContent = task.priority;

  // Create the task title
  let taskTitle = document.createElement("h6");
  taskTitle.className = "task-title";
  taskTitle.textContent = task.taskTitle;

  // Create the task content
  let taskContent = document.createElement("div");
  taskContent.className = "task contant";
  taskContent.textContent = task.description;

  // Create the due date
  let dueDateDiv = document.createElement("div");
  dueDateDiv.className = "due-date";

  // Create the due date
  let spanWrapper = document.createElement("span");
  spanWrapper.className = "text-muted";
  let icon = document.createElement("i");
  icon.className = "bi bi-calendar-event";
  let dueDateText = document.createElement("span");
  dueDateText.className = "badge text-bg-secondary mx-2";
  let date = new Date(task.dueDate).toString().split(" ");
  dueDateText.textContent = `Due date ${date[1]}, ${date[2]} ${date[3]}`;
  spanWrapper.appendChild(icon);
  spanWrapper.appendChild(dueDateText);
  dueDateDiv.appendChild(spanWrapper);

  // Append all elements to the task
  taskDiv.appendChild(badgeDiv);
  taskDiv.appendChild(taskTitle);
  taskDiv.appendChild(taskContent);
  taskDiv.appendChild(dueDateDiv);

  return taskDiv;
}

// Add the tasks to the page

function addTaskToPage(task) {
  const tasksGroup = document.querySelector(`.tasks-group.${task.status}`);
  const taskContainer = tasksGroup.querySelector(".tasks-container");
  const taskGroupHeder = tasksGroup.querySelector(".tasks-group-header span");
  const taskCard = createTaskCard(task);
  // Add event listener to the task card for the edit mode
  taskCard.addEventListener("click", (event) => {
    editMode = true;
    editedTaskId = task.id;
    fillFormWithTaskData(task);

    // Show the modal

    bootstrap.Modal.getInstance(modal).show();
  });
  taskContainer.appendChild(taskCard);

  // For the tasks counter in each groupF.
  const taskCounter = taskGroupHeder.textContent.replace(/[^\d]/g, "");
  taskGroupHeder.textContent = `(${+taskCounter + 1})`;
}

function fillFormWithTaskData(task) {
  formFields.taskTitle.value = task.taskTitle;
  formFields.status.value = task.status;
  formFields.startDate.value = task.startDate;
  formFields.dueDate.value = task.dueDate;
  formFields.description.value = task.description;
  document.querySelector(`input[value="${task.priority}"]`).checked = true;
  task.assignMembersSelect.forEach((employeeName) => {
    selectEmployeeToTheTask(employeeName);
  });
}

// Load all tasks on page load
tasks.forEach((task) => {
  addTaskToPage(task);
});

// reset form when modal is closed
modal.addEventListener("hidden.bs.modal", () => {
  restForm();
  editMode = false;
  editedTaskId = null;
});
