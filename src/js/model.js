import { weatherIcons } from './helpers.js';
import { API_URL_WEATHER } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  weather: {},
  weatherUnits: {},
  weatherIcons,
  coordinates: {},
};

export const stateTasks = {
  tasks: [],
  events: [],
};

const createWeatherObject = function (data) {
  const weather = data.current_weather;
  return {
    interval: weather.interval,
    isDay: weather.is_day,
    temperature: weather.temperature,
    time: weather.time,
    weatherCode: weather.weathercode,
    windDirection: weather.winddirection,
    windSpeed: weather.windspeed,
  };
};
const createWeatherUnitsObject = function (data) {
  const weatherUnits = data.current_weather_units;
  return {
    intervalUnits: weatherUnits.interval,
    isDayUnits: weatherUnits.is_day,
    temperatureUnits: weatherUnits.temperature,
    timeUnits: weatherUnits.time,
    weatherCodeUnits: weatherUnits.weathercode,
    windDirectionUnits: weatherUnits.winddirection,
    windSpeedUnits: weatherUnits.windspeed,
  };
};

const createCoordinatesObject = function (data) {
  // const coordinates = await getCoordinates();
  const coordinates = data;
  return {
    latitude: coordinates.latitude,
    longitude: coordinates.longitude,
  };
};

///////////////////////////////////////////////////// From the user gets the latitude and longitude
const getCoordinates = function () {
  return new Promise((resolve, reject) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        position => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        () => {
          reject('Could not get your position');
        }
      );
    } else {
      reject('Geolocation is not supported by this browser');
    }
  });
};

///////////////////////////////////////////////////// Aici se creeaza obiectul coordinates ce ajunge in state

export const loadCoordinates = async function () {
  const data = await getCoordinates();
  state.coordinates = createCoordinatesObject(data);
};

///////////////////////////////////////////////////// folosind un weather API, se creeaza obiectele weather si weatherUnits in state
export const loadWeatherInformation = async function (latitude, longitude) {
  try {
    // const response = await fetch(
    //   `${API_URL_WEATHER}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    // );
    // const data = await response.json();
    const data = await getJSON(
      `${API_URL_WEATHER}?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );

    state.weather = createWeatherObject(data);
    state.weatherUnits = createWeatherUnitsObject(data);
  } catch (error) {
    console.error(error);
  }
};

//////////////////////////////////////////////////////////// Adaug un nou task in tasks

const createTaskObject = function (task) {
  const start = task.date + 'T' + task.start + ':00.000Z';
  const end = task.date + 'T' + task.end + ':00.000Z';
  return {
    activityCategory: task.activityCategory,
    categoryColor: task.categoryColor,
    date: task.date,
    description: task.description,
    end: end,
    start: start,
    title: task.title,
    completed: false,
    id: crypto.randomUUID(),
  };
};

export const addTask = function (newTask) {
  // 1) Update la state.Tasks
  stateTasks.tasks = getTasksLocalStorage();

  // 2) Creez un nou task
  const task = createTaskObject(newTask);

  // 3) I add the task in the stateTasks
  stateTasks.tasks.push(task);

  // 4) Save the tasks into the local storage
  addTaskToLocalStorage();

  // 5) newTask has dates then create event
  newTask.end && newTask.start && newTask.date && copyTask(task);
};

export const getTasksLocalStorage = function () {
  const tasks = localStorage.getItem('tasks2');
  try {
    return tasks ? JSON.parse(tasks) : []; // Ensure JSON parsing doesn't break
  } catch (error) {
    console.error('Error parsing localStorage data:', error);
    localStorage.removeItem('tasks'); // Reset localStorage to prevent future errors
    return [];
  }
};

const addTaskToLocalStorage = function () {
  localStorage.setItem('tasks2', JSON.stringify(stateTasks.tasks));
};

export const deleteTask = function (idTask) {
  stateTasks.tasks = stateTasks.tasks.filter(task => task.id !== idTask);
  addTaskToLocalStorage();
};
/////////////////////////////////////////////////// copy a task

const copyTask = function (task) {
  stateTasks.events = getEventsFromLocalStorage();
  let event = {};
  event = structuredClone(task);
  event.id = crypto.randomUUID();
  stateTasks.events.push(event);
  console.log(stateTasks.events);
  saveEventsInLocalStorage(stateTasks.events);
};

/////////////////////////////////////////////////// Creates a new event in the calendar
function newEventCalendar(idEvent, startEvent, endEvent) {
  stateTasks.tasks = getTasksLocalStorage();
  stateTasks.events = getEventsFromLocalStorage();
  let event = {};
  /// Creez o copie a taskului si ii schimb id-ul
  stateTasks.tasks.forEach(function (task) {
    if (task.id === idEvent) {
      event = structuredClone(task);
      event.id = crypto.randomUUID();
      event.start = startEvent;
      event.end = endEvent;
    }
  });
  stateTasks.events.push(event);
  saveEventsInLocalStorage(stateTasks.events);
}

////////////////////////////////////////////////// Gets all the events of the calendar from local storage
export function getEventsFromLocalStorage() {
  const events = localStorage.getItem('events2');
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
  localStorage.setItem('events2', JSON.stringify(events));
}

///////////////////////////////////////////////////////// When an event is received into the calendar

export const receive = function (info) {
  console.log(info);
  const idEvent = info.draggedEl.dataset.id;
  let startEvent = info.event._instance.range.start;
  let endEvent = info.event._instance.range.end;

  // Something temporar i want to put it in all day category
  if (info.event._context.viewApi.type === 'dayGridMonth') {
    startEvent.setHours(8);
    endEvent = new Date(startEvent);
    endEvent.setHours(10);
  }
  newEventCalendar(idEvent, startEvent, endEvent);
};

export const drop = function (info) {
  const idEventDrop = info.event._def.publicId;
  stateTasks.events = getEventsFromLocalStorage();
  stateTasks.events.forEach(function (event) {
    if (event.id === idEventDrop) {
      event.start = info.event._instance.range.start;
      event.end = info.event._instance.range.end;
    }
  });
  saveEventsInLocalStorage(stateTasks.events);
};

export const resize = function (info) {
  stateTasks.events = getEventsFromLocalStorage();
  const idElement = info.event._def.publicId;
  stateTasks.events.forEach(event => {
    if (event.id === idElement) event.end = info.event._instance.range.end;
  });
  saveEventsInLocalStorage(stateTasks.events);
};

export const eventContent = function (arg) {
  // Creeaza un in html tot ce vrei sa afisezi
  // Ia elementele html cu document.querySelector
  // foloseste valoriile din arg pentru a afisa ce vrei sa apara in element
  // da return {domNodes: [eventContainer]} --> numele containerului in care ai tot

  // console.log('Arg este', arg);
  // Create time display
  let eventTime = document.createElement('span');
  eventTime.innerText = arg.timeText; // -------> text
  // Create title
  let eventTitle = document.createElement('span');
  eventTitle.innerText = arg.event.title; // -------> titlu
  // Create button

  let eventContainer = document.createElement('div');
  eventContainer.classList.add('event-container');
  eventContainer.appendChild(eventTime);
  eventContainer.appendChild(eventTitle);
  eventContainer.style.backgroundColor = arg.backgroundColor;
  return { domNodes: [eventContainer] };
};
