const tasks = (localStorage.tasks && JSON.parse(localStorage.tasks)) || [];

// Count tasks
document.getElementById("to-do-tasks-count").innerText = tasks.filter(
  ({ status }) => status === "to-do"
).length;
document.getElementById("in-progress-tasks-count").innerText = tasks.filter(
  ({ status }) => status === "in-progress"
).length;
document.getElementById("completed-tasks-count").innerText = tasks.filter(
  ({ status }) => status === "completed"
).length;
document.getElementById("on-hold-tasks-count").innerText = tasks.filter(
  ({ status }) => status === "on-hold"
).length;

// Count tasks since yesterday
let now = new Date();
let count = tasks.filter(
  ({ status, date }) => status === "on-hold" && now - new Date(date) < 86400000
).length;
document.getElementById(
  "on-hold-since-yesterday"
).innerText = `+${count} since yesterday`;
count = tasks.filter(
  ({ status, date }) => status === "to-do" && now - new Date(date) < 86400000
).length;
document.getElementById(
  "to-do-since-yesterday"
).innerText = `+${count} since yesterday`;
count = tasks.filter(
  ({ status, date }) => status === "in-progress" && now - new Date(date) < 86400000
).length;
document.getElementById(
  "in-progress-since-yesterday"
).innerText = `+${count} since yesterday`;
count = tasks.filter(
  ({ status, date }) => status === "completed" && now - new Date(date) < 86400000
).length;
document.getElementById(
  "completed-since-yesterday"
).innerText = `+${count} since yesterday`;
