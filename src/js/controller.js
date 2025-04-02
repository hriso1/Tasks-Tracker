import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import weatherView from './views/weatherView.js';
import quotesView from './views/quotesView.js';
import addTaskView from './views/addTaskView.js';
import taskListView from './views/taskListView.js';
import calendarView from './views/calendarView.js';
import editEventView from './views/editEventView.js';
import { hoursConstraint } from './helpers.js';
import editTaskView from './views/editTaskView.js';
import sidebarView from './views/sidebarView.js';

///////////////////////////////////////////////////// Function to get the data about the weather

const controlWeather = async function () {
  try {
    // 1) Render loading spinner
    // weatherView.renderLoading();

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
///////////////////////////////////////////////////////////////////////////////

const controlQuotes = function () {
  quotesView.render();
};
///////////////////////////////////////////////////////////////////////////////

// const updateCalendar = function (calendar) {
//   calendar.addEvent(
//     model.stateTasks.events[model.stateTasks.events.length - 1]
//   );
// };

const rerenderCalendar = function (calendar) {
  calendar.removeAllEvents();
  calendar.addEventSource(model.stateTasks.events);
};
///////////////////////////////////////////////////////////////////////////////

const controlTask = function (newTask) {
  // 1) Create task in model
  model.addTask(newTask);

  // 2) Render the task in the task list
  const tasks = model.stateTasks.tasks;
  taskListView.render(tasks);

  // 3) Rerender the calendar with the newTask or create a newEvent
  rerenderCalendar(calendarView.calendar);
};

//////////////////////////////////////////////////////////////////////////////
const controlEditEvent = function (newEvent) {
  // Delete old event
  model.deleteEvent();

  // Create new event
  model.addEvent(newEvent);

  // Rerender calendar with the new event
  rerenderCalendar(calendarView.calendar);
  taskListView.render(model.stateTasks.tasks);
};
///////////////////////////////////////////////////////////////////////////////

const getIdTask = function (idTask) {
  // 0) Store idTask in model
  model.storeIdTask(idTask);

  // 1) Get data about the task to display on the dialog
  const taskData = model.getDataFromOneTask(model.stateTasks.idTaskToEdit);

  // 2) Show the dialog
  editTaskView.addHandlerShowDialog(taskData);
};

const controlEditTask = function (newTaskData) {
  // 1) Edit the task
  model.editTask(newTaskData);

  // 2) Close dialog
  rerenderCalendar(calendarView.calendar);

  // 3) Rerender list
  taskListView.render(model.stateTasks.tasks);
};

///////////////////////////////////////////////////////////////////////////////

const controlListTasks = function () {
  // // 2) Update the stateTasks in model
  model.stateTasks.tasks = model.getTasksLocalStorage();

  taskListView.render(model.stateTasks.tasks);
};

///////////////////////////////////////////////////////////////////////////////
const controlDeleteTask = function (taskId) {
  // 1) Delete Task from model
  model.deleteTask(taskId);

  // 2) Rerender the new list
  taskListView.render(model.stateTasks.tasks);
};

///////////////////////////////////////////////////////////////////////////////
const controlDeleteEvent = function () {
  // 1) Delete the event
  model.deleteEvent();

  // 2) Render new calendar
  rerenderCalendar(calendarView.calendar);

  // 3) Close edit form
  editEventView._addHandlerCloseDialog();
};

//////////////////////////////////////////////////////////////////////////////////
const controlCalendar = function (calendar) {
  // 1) When the task is dragged into the calendar

  calendar.setOption('eventReceive', function (info) {
    model.receive(info);
    info.event.remove();
    // updateCalendar(calendarView.calendar);
    rerenderCalendar(calendarView.calendar);
  });

  hoursConstraint(calendar, '00:00:00', '23:59:00');

  calendar.setOption('eventDrop', function (info) {
    model.drop(info);
    rerenderCalendar(calendarView.calendar);

    hoursConstraint(calendar, '00:00:00', '23:59:00');
  });

  calendar.setOption('eventDragStart', function () {
    // Dezactivează constrângerile când începe mutarea
    calendar.setOption('eventConstraint', null);
  });

  calendar.setOption('eventResize', function (info) {
    model.resize(info);
  });

  calendar.setOption('eventClick', function (info) {
    const eventId = info.event.id;
    model.storeIdEvent(eventId);

    // Gets the data inside an object that is in an array
    const eventDataObject = model
      .getEventsFromLocalStorage()
      .filter(e => e.id === eventId)[0];
    editEventView.addHandlerShowDialog(eventDataObject); // get the object of the array
  });

  calendar.setOption('dateClick', function (info) {
    /////////////// adauga ora in form si ziua plus un end default
    console.log(info);
    const dateData = model.eventClick(info);
    addTaskView.setAllDay(info.allDay);
    addTaskView.addHandlerShowDialog(dateData);
  });

  calendar.setOption('eventAllow', function (dropInfo, draggedEvent) {
    return true;
  });

  calendar.setOption('eventContent', function (arg) {
    // model.eventContent(arg);

    ///////////////////// Functia in model si pune o clasa lui eventContainer
    //////////////////// Ca sa faci designul index.css
    let eventContainer = document.createElement('div');
    eventContainer.innerHTML = `
      ${arg.timeText}  ${arg.event.title}
    `;

    eventContainer.style.background =
      arg.event._def.extendedProps.categoryColor;

    // if (arg.event._def.extendedProps.checked === true) !!!!!!!!!!!!!!!

    eventContainer.style.height = '100%';
    eventContainer.style.color = 'black';

    return { domNodes: [eventContainer] };
  });
};

const controlSidebar = function () {
  sidebarView.handlerSidebar();
  sidebarView.toggleSidebar();
  sidebarView.showHomeContent();
};

const controlContentCharts = function () {
  model.rewriteEvents();
  console.log(model.stateTasks.eventsGraphs);
};

const init = function () {
  // 0) Populate the model with data
  model.getStateTasks();

  // 1) Listen to add new task
  addTaskView.addHandlerNewTask(controlTask);

  // 1.1) Listen to show edit task
  taskListView.handlerShowTask(getIdTask); /// !!!!!!!!! change the function

  // 1.2) Edit the task with the new data from user
  editTaskView.addHandlerEditTask(controlEditTask);

  // 2) Edit an event
  editEventView.addHandlerEditEvent(controlEditEvent);

  // 2.1) Listen for delete event
  editEventView.addHandlerDeleteEvent(controlDeleteEvent);

  // 3) Create new calendar with events
  calendarView.addCalendar(controlCalendar, model.getEventsFromLocalStorage());

  // 4) Render the list with task
  taskListView.addHandlerRenderList(controlListTasks);

  // 5) Event listener to delete a task from list
  taskListView.addHandlerDeleteTask(controlDeleteTask);

  // 6) Renders the weather panel
  weatherView.addHandlerRenderWeather(controlWeather);

  // 7) Renders the quotes panel
  controlQuotes();
  // 8) Control sidebar
  controlSidebar();

  // 9) Show charts page
  sidebarView.showChartsPage(controlContentCharts);
};

init();

model.rewriteEvents();
// console.log(model.stateTasks.eventsGraphs);

// let events = {
//   '1-04-2025': [
//     { title: 'test1', author: 'andrei' },
//     { title: 'test2', author: 'hriso' },
//   ],
//   '2-04-2025': [
//     { title: 'test3', author: 'andreii' },
//     { title: 'test4', author: 'hrisoo' },
//   ],
// };
// let event = {
//   date: '1-04-2025',
//   title: 'test9',
//   author: 'hrisoo',
// };

// let dateEvent = event.date;
// events[dateEvent]
//   ? events[dateEvent].push(event)
//   : (events[dateEvent] = [event]);
// // console.log(events);

// const events1 = [
//   {
//     date: '1-04-2025',
//     title: 'test5',
//     author: 'hrisoo',
//   },
//   {
//     date: '2-04-2025',
//     title: 'test6',
//     author: 'hrisoo',
//   },
//   {
//     date: '2-04-2025',
//     title: 'test7',
//     author: 'hrisoo',
//   },
//   {
//     date: '3-04-2025',
//     title: 'test8',
//     author: 'hrisoo',
//   },
// ];

// const rewriteEvents = function () {
//   events1.forEach(event => {
//     const { date, ...eventData } = event;
//     // if the date exists push the event, else create a new date property
//     events[date] ? events[date].push(eventData) : (events[date] = [eventData]);
//   });
// };

// rewriteEvents();

// console.log(events);

// const inputTasks = document.getElementById('input-tasks');
// const inputCategory = document.getElementById('input-categories');
// const selectedColour = document.getElementById('colours');
// // const addTaskButton = document.querySelector('.add-task-button');
// const tasksList = document.querySelector('.tasks-list');
// const form = document.querySelector('.newTask-container');

// //////////////////////////////////////////////////////// Ia tasks din localStorage
// function getTasksFromLocalS() {
//   const tasks = localStorage.getItem('tasks');
//   try {
//     return tasks ? JSON.parse(tasks) : []; // Ensure JSON parsing doesn't break
//   } catch (error) {
//     console.error('Error parsing localStorage data:', error);
//     localStorage.removeItem('tasks'); // Reset localStorage to prevent future errors
//     return [];
//   }
// }
// //////////////////////////////////////////////////////// Salveaza un task in localStorage

// function saveTaksInLocalS(tasks) {
//   localStorage.setItem('tasks', JSON.stringify(tasks));
// }
// //////////////////////////////////////////////////////// Creates the taks object
// function getTaskDetails() {
//   return {
//     id: crypto.randomUUID(),
//     task: inputTasks.value,
//     title: inputTasks.value,
//     category: inputCategory.value,
//     backgroundColor: selectedColour.value,
//     completed: false,
//   };
// }
// //////////////////////////////////////////////////////// Clears the form values

// function clearForm() {
//   inputTasks.value = '';
//   inputCategory.value = '';
//   inputTasks.focus();
// }
// //////////////////////////////////////////////////////// Adauga taskul nou in LocalStorage
// function addTaskToLocalStorage(task) {
//   const tasks = getTasksFromLocalS();
//   tasks.push(task);
//   saveTaksInLocalS(tasks);
// }

// //////////////////////////////////////////////////////// Generate markup on display

// form.addEventListener('submit', function (e) {
//   e.preventDefault();
//   const newTask = getTaskDetails();
//   addTaskToLocalStorage(newTask);

//   // Re-render tasks
//   renderTasks();

//   clearForm();
// });

// window.addEventListener('load', renderTasks);

// function renderTasks() {
//   const tasksLocalStorage = getTasksFromLocalS();
//   tasksList.innerHTML = tasksLocalStorage
//     .map(
//       task => `
//       <div class="task-container" data-id="${
//         task.id
//       }" style="background-color: ${task.backgroundColor}" draggable='true' >
//         <input class='check-input' type='checkbox' ${
//           task.completed ? 'checked' : ''
//         }  >
//         <div>${task.task}</div>
//         <div>${task.category}</div>
//         <button class="button-delete"><img src=${deleteIcon} description = 'deleteIcon' ></button>
//       </div>
//     `
//     )
//     .join('');
// }

// //////////////////////////// Event delegation for checked task and delete task

// tasksList.addEventListener('click', function (event) {
//   const targetedTask = event.target.closest('.task-container');
//   if (!targetedTask) return; // If no task container is found, exit

//   const taskId = targetedTask.getAttribute('data-id');
//   let tasks = getTasksFromLocalS();

//   handleCheckBox(event, tasks, taskId);
//   handleDeleteTask(event, tasks, taskId, targetedTask);
// });

// function handleCheckBox(event, tasks, taskId) {
//   if (event.target.classList.contains('check-input')) {
//     const task = tasks.find(task => task.id === taskId);
//     if (!task) {
//       return;
//     }
//     task.completed = !task.completed;
//     saveTaksInLocalS(tasks);
//   }
// }

// function handleDeleteTask(event, tasks, taskId, targetedTask) {
//   if (event.target.closest('.button-delete')) {
//     tasks = tasks.filter(task => task.id !== taskId);
//     saveTaksInLocalS(tasks);
//     targetedTask.remove(); // Remove task from UI
//   }
// }

// ////////////////////////////////////////////////// Gets all the events of the calendar from local storage
// function getEventsFromLocalStorage() {
//   const events = localStorage.getItem('events');
//   try {
//     return events ? JSON.parse(events) : [];
//   } catch (error) {
//     console.error("Can't get events from local storage");
//     localStorage.removeItem('events');
//     return [];
//   }
// }

// /////////////////////////////////////////////////// Preia toate evenimentele si le salveaza in local Storage
// function saveEventsInLocalStorage(events) {
//   localStorage.setItem('events', JSON.stringify(events));
// }

/////////////////////////////////////////////////// Creates a new event in the calendar
// function newEventCalendar(idEvent, startEvent, endEvent) {
//   const tasks = getTasksFromLocalS();
//   const events = getEventsFromLocalStorage();
//   let event = {};
//   /// Creez o copie a taskului si ii schimb id-ul
//   tasks.forEach(function (task) {
//     if (task.id === idEvent) {
//       event = structuredClone(task);
//       event.id = crypto.randomUUID();
//       event.start = startEvent;
//       event.end = endEvent;
//     }
//   });
//   events.push(event);
//   saveEventsInLocalStorage(events);
// }

////////////////////////////////////////////////////// Calendar

// function addCalendar(events) {
//   document.addEventListener('DOMContentLoaded', function () {
//     // const Calendar = FullCalendar.Calendar;
//     // const Draggable = FullCalendar.Draggable;

//     const calendarEl = document.getElementById('calendar');

//     var nowLocal = new Date();
//     var nowUTC = new Date(
//       nowLocal.getTime() - nowLocal.getTimezoneOffset() * 60000
//     );

//     /////////////////////////////// make tasks draggable

//     new Draggable(tasksList, {
//       itemSelector: '.task-container',
//       eventData: function (eventElement) {
//         return {
//           title: eventElement.innerText,
//         };
//       },
//     });

//     /////////////////////////////// initiate the calendar

//     let calendar = new Calendar(calendarEl, {
//       plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
//       timeZone: 'UTC',
//       headerToolbar: {
//         left: 'prev,next today',
//         center: 'title',
//         right: 'dayGridMonth,timeGridWeek,timeGridDay',
//       },
//       initialView: 'timeGridWeek',
//       editable: true,
//       eventStartEditable: true,
//       droppable: true,
//       nowIndicator: true,
//       now: nowUTC.toISOString(),
//       // contentHeight: 760,
//       // selectable: true,
//       titleFormat: {
//         month: 'long',
//         year: 'numeric',
//         day: 'numeric',
//         weekday: 'long',
//       },
//       eventContent: function (arg) {
//         // console.log('Arg este', arg);

//         // Create time display
//         let eventTime = document.createElement('span');
//         eventTime.innerText = arg.timeText;

//         // Create title
//         let eventTitle = document.createElement('span');
//         eventTitle.innerText = arg.event.title;
//         // Create button
//         let deleteButton = document.createElement('button');
//         deleteButton.classList.add('event-delete-button');

//         let imgIcon = document.createElement('img');
//         imgIcon.src = `${deleteIcon}`;
//         imgIcon.alt = 'delete button';
//         imgIcon.width = 20;
//         imgIcon.height = 20;

//         deleteButton.appendChild(imgIcon);
//         deleteButton.onclick = function () {
//           let events = getEventsFromLocalStorage();
//           let idEvent = arg.event._def.publicId;
//           events = events.filter(event => event.id !== idEvent);
//           saveEventsInLocalStorage(events);
//           arg.event.remove();
//         };

//         let eventContainer = document.createElement('div');
//         eventContainer.classList.add('event-container');
//         eventContainer.appendChild(eventTime);
//         eventContainer.appendChild(eventTitle);
//         eventContainer.appendChild(deleteButton);
//         eventContainer.style.backgroundColor = arg.backgroundColor;

//         return { domNodes: [eventContainer] };
//       },
//       eventReceive: function (info) {
//         console.log(info);
//         const idEvent = info.draggedEl.dataset.id;

//         // const tasks = model.getTasksLocalStorage();
//         const tasks = getTasksFromLocalS();
//         let task = tasks.filter(task => task.id === idEvent);
//         console.log(task);
//         // let color = task[0].categoryColor;
//         let color = task[0].backgroundColor;

//         // info.event.setProp('backgroundColor', task.backgroundColor);
//         info.event.setProp('backgroundColor', color);
//         info.event.setProp('textColor', 'black');

//         // get start and endEvent
//         const startEvent = info.event._instance.range.start;
//         let endEvent = info.event._instance.range.end;
//         console.log(startEvent);
//         console.log(endEvent);

//         if (info.event._context.viewApi.type === 'dayGridMonth') {
//           startEvent.setHours(8);
//           endEvent = new Date(startEvent);
//           endEvent.setHours(10);
//         }
//         console.log(startEvent);
//         console.log(endEvent);

//         newEventCalendar(idEvent, startEvent, endEvent);
//       },
//       eventDrop: function (info) {
//         const idEventDrop = info.event._def.publicId;
//         let events = getEventsFromLocalStorage();
//         events.forEach(function (event) {
//           if (event.id === idEventDrop) {
//             event.start = info.event._instance.range.start;
//             event.end = info.event._instance.range.end;
//           }
//         });
//         saveEventsInLocalStorage(events);
//       },
//       eventResize: function (info) {
//         console.log(info.event._instance.range.end);
//         let events = getEventsFromLocalStorage();
//         const idElement = info.event._def.publicId;
//         events.forEach(event => {
//           if (event.id === idElement)
//             event.end = info.event._instance.range.end;
//         });
//         saveEventsInLocalStorage(events);
//       },
//       eventClick: function (info) {
//         /////////////////////// Trebuie sa creez un pop up in care sa editez evenimentul si cu un buton de sters
//         console.log(info);
//       },

//       events: events,
//     });

//     calendar.render();
//     let eventsCalendar = calendar.getEvents();
//     console.log('------------------------------');
//     console.log(eventsCalendar);
//   });
// }

// addCalendar(getEventsFromLocalStorage());

// const dialogElement = document.querySelector('dialog');
// const openDialogButton = document.querySelector('.open-form');
// const closeDialogButton = document.querySelector('.close-button-form');

// openDialogButton.addEventListener('click', function () {
//   dialogElement.showModal();
// });

// closeDialogButton.addEventListener('click', function () {
//   dialogElement.close();
// });
