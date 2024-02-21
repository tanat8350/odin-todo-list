import "./style.css";

// TODO: complete list
// TODO: add expand
// TODO: composition
// TODO: near due date

class Project {
  constructor(name) {
    this.name = name;
    this.tasks = [];
  }
}

class Task {
  constructor(title, dueDate, description, priority) {
    this.title = title;
    this.dueDate = dueDate;
    this.description = description;
    this.priority = priority;
  }
}
const projects = JSON.parse(localStorage.getItem("data")) || [
  new Project("Default"),
];
let openingProject = 0;
let openingTask;

function saveToLocal() {
  localStorage.setItem("data", JSON.stringify(projects));
}

// Create New Project
const inputProjectNew = document.querySelector("#project-new");
const btnProjectNew = document.querySelector(".project-new-btn");
const errorProjectNew = document.querySelector(".project-new-error");

function checkUniqueProject(name) {
  let result = false;
  projects.forEach((item) => {
    if (item.name === name) {
      errorProjectNew.textContent = "Project already exists";
      setTimeout(() => {
        errorProjectNew.textContent = "";
      }, 2000);
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
      selectProjectList.value = projects.length - 1;
      openingProject = selectProjectList.value;
      renderTasks();
    }
  }
});

// Select Project
const content = document.querySelector(".content");

const projectContainer = document.querySelector(".project-container");
const selectProjectList = document.querySelector("#project-list");
const inputProjectRename = document.querySelector("#project-rename");

projectContainer.addEventListener("click", (e) => {
  const target = e.target;

  if (target.classList.contains("project-delete-btn")) {
    projects.splice(openingProject, 1);
    if (projects.length === 0) projects.push(new Project("Default"));
    renderProjectList();
    renderTasks();
  }

  if (target.classList.contains("project-rename-btn")) {
    if (inputProjectRename.value) {
      projects[openingProject].name = inputProjectRename.value;
      inputProjectRename.value = "";
      renderProjectList();
      renderTasks();
    }
  }
});

selectProjectList.addEventListener("change", () => {
  openingProject = selectProjectList.value;
  renderTasks();
});

function clearProjectList() {
  selectProjectList.innerText = "";
}

function renderProjectList() {
  clearProjectList();
  projects.forEach((item, index) => {
    const option = document.createElement("option");
    option.textContent = item.name;
    option.value = index;

    selectProjectList.appendChild(option);
  });
  saveToLocal();
}

// All Projects
const allProjects = document.querySelector("#all-projects");

allProjects.addEventListener("change", () => {
  renderTasks();
});

// New Task
const inputNewTaskTitle = document.querySelector("#new-task-title");
const inputNewTaskDueDate = document.querySelector("#new-task-due-date");
const btnNewTask = document.querySelector(".new-task-btn");

function addTask(title, dueDate) {
  projects[openingProject].tasks.push(new Task(title, dueDate));
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

function addEditBtn(projectTask, index, projectIndex) {
  const btn = document.createElement("button");
  btn.textContent = "Edit";
  content.appendChild(btn);
  btn.addEventListener("click", () => {
    if (projectIndex >= 0) {
      selectProjectList.value = projectIndex;
      openingProject = selectProjectList.value;
    }

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

function addDeleteBtn(projectTask, index) {
  const btn = document.createElement("button");
  btn.textContent = "Delete";
  content.appendChild(btn);
  btn.addEventListener("click", () => {
    projectTask.splice(index, 1);
    renderTasks();
  });
}

function pushTasksToDom(project, projectIndex) {
  project.tasks.forEach((task, index) => {
    const para = document.createElement("p");
    if (task.priority) para.textContent += "[Bell] ";
    para.textContent += `${task.title} `;
    if (task.dueDate) para.textContent += `[${task.dueDate}] `;
    if (allProjects.checked) para.textContent += `{${project.name}}`;

    content.appendChild(para);
    addEditBtn(task, index, projectIndex);
    addDeleteBtn(project.tasks, index);
  });
}

function renderTasks() {
  clearContent();
  if (allProjects.checked) {
    projects.forEach((project, projectIndex) => {
      pushTasksToDom(project, projectIndex);
    });
  } else {
    pushTasksToDom(projects[openingProject], openingProject);
  }
  saveToLocal();
}

// Editor modal
const editor = document.querySelector("dialog");
const editorTitle = document.querySelector("#edit-title");
const editorDescription = document.querySelector("#edit-description");
const editorDueDate = document.querySelector("#edit-due-date");
const editorPriority = document.querySelector("#edit-priority");

editor.addEventListener("click", (e) => {
  const target = e.target;
  if (target.classList.contains("edit-submit-btn")) {
    projects[openingProject].tasks[openingTask].title = editorTitle.value;
    projects[openingProject].tasks[openingTask].description =
      editorDescription.value;
    projects[openingProject].tasks[openingTask].dueDate = editorDueDate.value;
    projects[openingProject].tasks[openingTask].priority =
      editorPriority.checked;
    renderTasks();
  }
  if (target.classList.contains("edit-close-btn")) {
    editor.close();
  }
});

// Init
(function () {
  renderProjectList();
  renderTasks();
})();
