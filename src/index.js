// import * as task from "./task.js";

const projects = [];
let currentProject = 0;

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
  currentProject = selectProjectList.value;
  console.log(currentProject);
  renderTasks();
});

function renderProjectList() {
  clearProjectList();
  projects.forEach((item, index) => {
    const option = document.createElement("option");
    option.textContent = item.name;
    option.value = index;

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
  projects.splice(currentProject, 1);
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
  projects[currentProject].tasks.push(new Task(title, dueDate));
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

const editor = document.querySelector("dialog");
const editorTitle = document.querySelector("#edit-title");
const editorDescription = document.querySelector("#edit-description");
const editorDueDate = document.querySelector("#edit-due-date");
const editorPriority = document.querySelector("#edit-priority");

editor.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("edit-submit-btn")) {
    projects[0].tasks[openingTask].title = editorTitle.value;
    projects[0].tasks[openingTask].description = editorDescription.value;
    projects[0].tasks[openingTask].dueDate = editorDueDate.value;
    projects[0].tasks[openingTask].priority = editorPriority.checked;
    renderTasks();
    console.log(projects);
  }
  if (target.classList.contains("edit-close-btn")) {
    editor.close();
  }
});

let openingTask;

function addEditBtn(projectTask, index) {
  const btn = document.createElement("button");
  btn.textContent = "Edit";
  content.appendChild(btn);
  btn.addEventListener("click", () => {
    openingTask = index;
    projectTask.title
      ? (editorTitle.value = projectTask.title)
      : (editorTitle.value = "");
    projectTask.description
      ? (editorDescription.value = projectTask.description)
      : (editorDescription.value = "");
    projectTask.dueDate
      ? (editorDueDate.value = projectTask.dueDate)
      : (editorDueDate.value = "");
    projectTask.priority
      ? (editorPriority.checked = projectTask.priority)
      : (editorPriority.checked = false);
    editor.show();
  });
}

function renderTasks() {
  clearContent();
  const tasks = projects[currentProject].tasks;

  tasks.forEach((task, index) => {
    const para = document.createElement("p");
    para.textContent = `${task.title} DueDate${task.dueDate}`;
    content.appendChild(para);
    addEditBtn(task, index);
    addDeleteBtn(tasks, index);
  });
}
