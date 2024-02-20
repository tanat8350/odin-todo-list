// import * as task from "./task.js";

const projects = [];

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }
}
projects.push(new Project("test1"));
projects.push(new Project("test2"));

const content = document.querySelector(".content");
const selectProjectList = document.querySelector("#project-list");

selectProjectList.addEventListener("change", () => {
  renderTasks();
});

function renderProjectList() {
  clearProjectList();
  projects.forEach((item) => {
    const option = document.createElement("option");
    option.textContent = item.name;

    selectProjectList.appendChild(option);
  });
}
renderProjectList();

function clearProjectList() {
  selectProjectList.innerText = "";
}

const inputProjectNew = document.querySelector("#project-new");
const btnProjectNew = document.querySelector(".project-new-btn");

function checkUniqueProject(name) {
  let result = false;
  projects.forEach((item) => {
    if (item.name === name) {
      console.log("Error duplicate name");
      return (result = true);
    }
  });
  return result;
}

btnProjectNew.addEventListener("click", () => {
  if (inputProjectNew.value) {
    if (!checkUniqueProject(inputProjectNew.value)) {
      projects.push(new Project(inputProjectNew.value));
      inputProjectNew.value = "";
      renderProjectList();
    }
  }
});

const btnProjectDelete = document.querySelector(".project-delete-btn");
btnProjectDelete.addEventListener("click", () => {
  projects.forEach((item, index) => {
    if (item.name === selectProjectList.value) {
      projects.splice(index, 1);
    }
  });
  renderProjectList();
  renderTasks();
});

class Task {
  constructor(title, dueDate, description, priority) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
  }
}

const btnNewTask = document.querySelector(".new-task-btn");
const inputNewTaskTitle = document.querySelector("#new-task-title");
const inputNewTaskDueDate = document.querySelector("#new-task-due-date");

function addTask(title, dueDate) {
  projects.forEach((item) => {
    if (item.name === selectProjectList.value) {
      item.tasks.push(new Task(title, dueDate));
    }
  });
}

btnNewTask.addEventListener("click", () => {
  if (inputNewTaskTitle.value) {
    addTask(inputNewTaskTitle.value, inputNewTaskDueDate.value);
    inputNewTaskTitle.value = "";
    inputNewTaskDueDate.value = "";
    renderTasks();
  }
});

function clearContent() {
  content.innerText = "";
}

function addDeleteBtn(projectTask, index) {
  const btn = document.createElement("button");
  btn.textContent = "Delete";
  content.appendChild(btn);
  btn.addEventListener("click", () => {
    projectTask.splice(index, 1);
    renderTasks();
  });
}

function renderTasks() {
  clearContent();
  projects.forEach((item) => {
    if (item.name === selectProjectList.value) {
      const tasks = item.tasks;
      tasks.forEach((task, index) => {
        const para = document.createElement("p");
        para.textContent = `${task.title} DueDate${task.dueDate}`;
        content.appendChild(para);
        addDeleteBtn(tasks, index);
      });
    }
  });
}
