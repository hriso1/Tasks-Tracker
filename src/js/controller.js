import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import weatherView from './views/weatherView.js';
import quotesView from './views/quotesView.js';
import { motivationQuotes } from './helpers.js';
import deleteIcon from '../img/delete.png';

const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const sidebarListContainer = document.querySelector('.list-pages');

////////////////////////////////////////////////////// Adauga clasa active linkului apasat

sidebarListContainer.addEventListener('click', function (event) {
  // Finds the clicked li
  const clickedLi = event.target.closest('li');
  if (!clickedLi || clickedLi.classList.contains('active')) return;

  // Removes the active class from the current li
  const activeLi = document.querySelector('.list-pages li.active');
  if (activeLi) activeLi.classList.remove('active');

  // Add the active class to the clicked li
  clickedLi.classList.add('active');
});

///////////////////////////////////////////////////// Roteste iconita de la sidebar
function toggleSidebar() {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
}
// allows the function to be used in directly in html document
window.toggleSidebar = toggleSidebar;

///////////////////////////////////////////////////// Function to get the data about the weather

const controlWeather = async function () {
  try {
    // 1) Render loading spinner
    weatherView.renderLoading();

    // 2) Get the latidude and longitude
    await model.loadCoordinates();

    // 3) Get data about the weather
    await model.loadWeatherInformation(
      model.state.coordinates.latitude,
      model.state.coordinates.longitude
    );

    // 4) render the weatherView using the data that was created in the model
    console.log(model.state);
    weatherView.render(model.state);
  } catch (error) {
    console.error(error);
  }
};

const controlQuotes = function () {
  quotesView.render();
};

// const generateRandom = function () {
//   const randomNumber = Math.floor(Math.random() * 10);
//   console.log(randomNumber);
//   console.log(motivationQuotes[randomNumber]);
//   // return motivationQuotes[randomNumber];
// };

const init = function () {
  weatherView.addHandlerRenderWeather(controlWeather);
  controlQuotes();
  // generateRandom();
};

init();

///// Pentru maine
const inputTasks = document.getElementById('input-tasks');
const inputCategory = document.getElementById('input-categories');
const selectedColour = document.getElementById('colours');
// const addTaskButton = document.querySelector('.add-task-button');
const tasksList = document.querySelector('.tasks-list');
const form = document.querySelector('.newTask-container');

//////////////////////////////////////////////////////// Ia tasks din localStorage
function getTasks() {
  const tasks = localStorage.getItem('tasks');
  try {
    return tasks ? JSON.parse(tasks) : []; // Ensure JSON parsing doesn't break
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    localStorage.removeItem('tasks'); // Reset localStorage to prevent future errors
    return [];
  }
}
//////////////////////////////////////////////////////// Salveaza un task in localStorage

function saveTasks(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
//////////////////////////////////////////////////////// Creates the taks object
function getTaskDetails() {
  return {
    task: inputTasks.value,
    category: inputCategory.value,
    colour: selectedColour.value,
    id: crypto.randomUUID(),
    completed: false,
  };
}
//////////////////////////////////////////////////////// Clears the form values

function clearForm() {
  inputTasks.value = '';
  inputCategory.value = '';
  inputTasks.focus();
}
//////////////////////////////////////////////////////// Adauga taskul nou in LocalStorage
function addTaskToLocalStorage(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

//////////////////////////////////////////////////////// Generate markup on display

form.addEventListener('submit', function (e) {
  e.preventDefault();
  const newTask = getTaskDetails();
  addTaskToLocalStorage(newTask);

  // Re-render tasks
  renderTasks();

  clearForm();
});

window.addEventListener('load', renderTasks);

function renderTasks() {
  const tasksLocalStorage = getTasks();
  tasksList.innerHTML = tasksLocalStorage
    .map(
      task => `
      <div class="task-container" data-id="${
        task.id
      }" style="background-color: ${task.colour}" draggable='true' >
        <input class='check-input' type='checkbox' ${
          task.completed ? 'checked' : ''
        }  >
        <div>${task.task}</div>
        <div>${task.category}</div>
        <button class="button-delete"><img src=${deleteIcon} description = 'deleteIcon' ></button>
      </div>
    `
    )
    .join('');
}

//////////////////////////// Event delegation for checked task

tasksList.addEventListener('click', function (event) {
  const targetedTask = event.target.closest('.task-container');
  if (!targetedTask) return; // If no task container is found, exit

  const taskId = targetedTask.getAttribute('data-id');
  let tasks = getTasks();

  handleCheckBox(event, tasks, taskId);
  handleDeleteTask(event, tasks, taskId, targetedTask);
});

function handleCheckBox(event, tasks, taskId) {
  if (event.target.classList.contains('check-input')) {
    const task = tasks.find(task => task.id === taskId);
    if (!task) {
      return;
    }
    task.completed = !task.completed;
    saveTasks(tasks);
  }
}

function handleDeleteTask(event, tasks, taskId, targetedTask) {
  if (event.target.closest('.button-delete')) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks(tasks);
    targetedTask.remove(); // Remove task from UI
  }
}
