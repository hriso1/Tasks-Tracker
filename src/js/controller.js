import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import weatherView from './views/weatherView.js';
import quotesView from './views/quotesView.js';
import addTaskView from './views/addTaskView.js';

import deleteIcon from '../img/deleteRed.png';

import { Calendar } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin, { Draggable } from '@fullcalendar/interaction';

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
    weatherView.render(model.state);
  } catch (error) {
    console.error(error);
  }
};

const controlQuotes = function () {
  quotesView.render();
};

const inputTasks = document.getElementById('input-tasks');
const inputCategory = document.getElementById('input-categories');
const selectedColour = document.getElementById('colours');
// const addTaskButton = document.querySelector('.add-task-button');
const tasksList = document.querySelector('.tasks-list');
const form = document.querySelector('.newTask-container');

//////////////////////////////////////////////////////// Ia tasks din localStorage
function getTasksFromLocalS() {
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

function saveTaksInLocalS(tasks) {
  localStorage.setItem('tasks', JSON.stringify(tasks));
}
//////////////////////////////////////////////////////// Creates the taks object
function getTaskDetails() {
  return {
    id: crypto.randomUUID(),
    task: inputTasks.value,
    title: inputTasks.value,
    category: inputCategory.value,
    backgroundColor: selectedColour.value,
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
  const tasks = getTasksFromLocalS();
  tasks.push(task);
  saveTaksInLocalS(tasks);
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
  const tasksLocalStorage = getTasksFromLocalS();
  tasksList.innerHTML = tasksLocalStorage
    .map(
      task => `
      <div class="task-container" data-id="${
        task.id
      }" style="background-color: ${task.backgroundColor}" draggable='true' >
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

//////////////////////////// Event delegation for checked task and delete task

tasksList.addEventListener('click', function (event) {
  const targetedTask = event.target.closest('.task-container');
  if (!targetedTask) return; // If no task container is found, exit

  const taskId = targetedTask.getAttribute('data-id');
  let tasks = getTasksFromLocalS();

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
    saveTaksInLocalS(tasks);
  }
}

function handleDeleteTask(event, tasks, taskId, targetedTask) {
  if (event.target.closest('.button-delete')) {
    tasks = tasks.filter(task => task.id !== taskId);
    saveTaksInLocalS(tasks);
    targetedTask.remove(); // Remove task from UI
  }
}

////////////////////////////////////////////////// Gets all the events of the calendar from local storage
function getEventsFromLocalStorage() {
  const events = localStorage.getItem('events');
  try {
    return events ? JSON.parse(events) : [];
  } catch (error) {
    console.error("Can't get events from local storage");
    localStorage.removeItem('events');
    return [];
  }
}

/////////////////////////////////////////////////// Preia toate evenimentele si le salveaza in local Storage
function saveEventsInLocalStorage(events) {
  localStorage.setItem('events', JSON.stringify(events));
}

/////////////////////////////////////////////////// Creates a new event in the calendar
function newEventCalendar(idEvent, startEvent, endEvent) {
  const tasks = getTasksFromLocalS();
  const events = getEventsFromLocalStorage();
  let event = {};
  /// Creez o copie a taskului si ii schimb id-ul
  tasks.forEach(function (task) {
    if (task.id === idEvent) {
      event = structuredClone(task);
      event.id = crypto.randomUUID();
      event.start = startEvent;
      event.end = endEvent;
    }
  });
  events.push(event);
  saveEventsInLocalStorage(events);
}

////////////////////////////////////////////////////// Calendar

function addCalendar(events) {
  document.addEventListener('DOMContentLoaded', function () {
    // const Calendar = FullCalendar.Calendar;
    // const Draggable = FullCalendar.Draggable;

    const calendarEl = document.getElementById('calendar');

    var nowLocal = new Date();
    var nowUTC = new Date(
      nowLocal.getTime() - nowLocal.getTimezoneOffset() * 60000
    );

    console.log(nowLocal);
    console.log(nowUTC.toISOString());

    /////////////////////////////// make tasks draggable

    new Draggable(tasksList, {
      itemSelector: '.task-container',
      eventData: function (eventElement) {
        return {
          title: eventElement.innerText,
        };
      },
    });

    /////////////////////////////// initiate the calendar

    let calendar = new Calendar(calendarEl, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      timeZone: 'UTC',
      headerToolbar: {
        left: 'prev,next today',
        center: 'title',
        right: 'dayGridMonth,timeGridWeek,timeGridDay',
      },
      initialView: 'timeGridWeek',
      editable: true,
      eventStartEditable: true,
      droppable: true,
      nowIndicator: true,
      now: nowUTC.toISOString(),
      // contentHeight: 760,
      // selectable: true,
      titleFormat: {
        month: 'long',
        year: 'numeric',
        day: 'numeric',
        weekday: 'long',
      },
      eventContent: function (arg) {
        // console.log('Arg este', arg);

        // Create time display
        let eventTime = document.createElement('span');
        eventTime.innerText = arg.timeText;

        // Create title
        let eventTitle = document.createElement('span');
        eventTitle.innerText = arg.event.title;
        // Create button
        let deleteButton = document.createElement('button');
        deleteButton.classList.add('event-delete-button');

        let imgIcon = document.createElement('img');
        imgIcon.src = `${deleteIcon}`;
        imgIcon.alt = 'delete button';
        imgIcon.width = 20;
        imgIcon.height = 20;

        deleteButton.appendChild(imgIcon);
        deleteButton.onclick = function () {
          let events = getEventsFromLocalStorage();
          let idEvent = arg.event._def.publicId;
          events = events.filter(event => event.id !== idEvent);
          saveEventsInLocalStorage(events);
          arg.event.remove();
        };

        let eventContainer = document.createElement('div');
        eventContainer.classList.add('event-container');
        eventContainer.appendChild(eventTime);
        eventContainer.appendChild(eventTitle);
        eventContainer.appendChild(deleteButton);
        eventContainer.style.backgroundColor = arg.backgroundColor;

        return { domNodes: [eventContainer] };
      },
      eventReceive: function (info) {
        console.log(info);
        const idEvent = info.draggedEl.dataset.id;

        const tasks = getTasksFromLocalS();
        let task = tasks.filter(task => task.id === idEvent);
        let color = task[0].backgroundColor;

        // info.event.setProp('backgroundColor', task.backgroundColor);
        info.event.setProp('backgroundColor', color);
        info.event.setProp('textColor', 'black');

        // get start and endEvent
        const startEvent = info.event._instance.range.start;
        let endEvent = info.event._instance.range.end;
        console.log(startEvent);
        console.log(endEvent);

        if (info.event._context.viewApi.type === 'dayGridMonth') {
          startEvent.setHours(8);
          endEvent = new Date(startEvent);
          endEvent.setHours(10);
        }
        console.log(startEvent);
        console.log(endEvent);

        newEventCalendar(idEvent, startEvent, endEvent);
      },
      eventDrop: function (info) {
        const idEventDrop = info.event._def.publicId;
        let events = getEventsFromLocalStorage();
        events.forEach(function (event) {
          if (event.id === idEventDrop) {
            event.start = info.event._instance.range.start;
            event.end = info.event._instance.range.end;
          }
        });
        saveEventsInLocalStorage(events);
      },
      eventResize: function (info) {
        console.log(info.event._instance.range.end);
        let events = getEventsFromLocalStorage();
        const idElement = info.event._def.publicId;
        events.forEach(event => {
          if (event.id === idElement)
            event.end = info.event._instance.range.end;
        });
        saveEventsInLocalStorage(events);
      },
      eventClick: function (info) {
        /////////////////////// Trebuie sa creez un pop up in care sa editez evenimentul si cu un buton de sters
        console.log(info);
      },

      events: events,
    });

    calendar.render();
  });
}

addCalendar(getEventsFromLocalStorage());

// const dialogElement = document.querySelector('dialog');
// const openDialogButton = document.querySelector('.open-form');
// const closeDialogButton = document.querySelector('.close-button-form');

// openDialogButton.addEventListener('click', function () {
//   dialogElement.showModal();
// });

// closeDialogButton.addEventListener('click', function () {
//   dialogElement.close();
// });

const controlTask = function (newTask) {
  // 1) Create task in model
  model.addTask(newTask);

  // 2) Adaug in baza de date noul Task
  model.persistTasks(model.stateTasks.tasks);

  // Afiseaza noul task in lista de taskuri --> ceva previewTask.update(
};

const init = function () {
  weatherView.addHandlerRenderWeather(controlWeather);
  controlQuotes();
  addTaskView.addHandlerNewTask(controlTask);
};

init();
