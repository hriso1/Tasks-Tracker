import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';

import partlyCloudIcon from '../img/cloudy-day.png';
import cloudyIcon from '../img/cloudy.png';
import drizzleIcon from '../img/drizzle.png';
import fogIcon from '../img/fog.png';
import frostIcon from '../img/frost.png';
import halfMoonIcon from '../img/half-moon.png';
import heavyRainIcon from '../img/heavy-rain.png';
import snowIcon from '../img/snow.png';
import stormIcon from '../img/storm.png';
import sunnyIcon from '../img/sunny.png';
import loadingIcon from '../img/loading.png';

const divWeather = document.querySelector('.weather-place');
const mainContainer = document.querySelector('.right-main');
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

const listContainer = document.querySelector('.list-pages');

//////// Adauga clasa active linkului apasat

listContainer.addEventListener('click', function (event) {
  // Finds the clicked li
  const clickedLi = event.target.closest('li');
  if (!clickedLi || clickedLi.classList.contains('active')) return;

  // Removes the active class from the current li
  const activeLi = document.querySelector('.list-pages li.active');
  if (activeLi) activeLi.classList.remove('active');

  // Add the active class to the clicked li
  clickedLi.classList.add('active');
});

/////////// Roteste iconita de la sidebar
function toggleSidebar() {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
}
// allows the function to be used in directly in html document
window.toggleSidebar = toggleSidebar;

const weatherIcons = {
  0: day =>
    day === 0 ? [halfMoonIcon, 'Clear Night'] : [sunnyIcon, 'Sunny Day'],
  1: day =>
    day === 0 ? [halfMoonIcon, 'Clear Night'] : [sunnyIcon, 'Sunny Day'],
  2: [partlyCloudIcon, 'Partly Cloud'],
  3: [cloudyIcon, 'Cloudy'],
  40: [fogIcon, 'Fog'],
  41: [fogIcon, 'Fog'],
  42: [fogIcon, 'Fog'],
  43: [fogIcon, 'Fog'],
  44: [fogIcon, 'Fog'],
  45: [fogIcon, 'Fog'],
  46: [fogIcon, 'Fog'],
  47: [fogIcon, 'Fog'],
  48: [fogIcon, 'Fog'],
  49: [fogIcon, 'Fog'],

  50: [drizzleIcon, 'Drizzle'],
  51: [drizzleIcon, 'Drizzle'],
  52: [drizzleIcon, 'Drizzle'],
  53: [drizzleIcon, 'Drizzle'],
  54: [drizzleIcon, 'Drizzle'],
  55: [drizzleIcon, 'Drizzle'],
  56: [drizzleIcon, 'Drizzle'],
  57: [drizzleIcon, 'Drizzle'],
  58: [drizzleIcon, 'Drizzle'],
  59: [drizzleIcon, 'Drizzle'],

  60: [heavyRainIcon, 'Heavy Rain'],
  61: [heavyRainIcon, 'Heavy Rain'],
  62: [heavyRainIcon, 'Heavy Rain'],
  63: [heavyRainIcon, 'Heavy Rain'],
  64: [heavyRainIcon, 'Heavy Rain'],
  65: [heavyRainIcon, 'Heavy Rain'],
  66: [heavyRainIcon, 'Heavy Rain'],
  67: [heavyRainIcon, 'Heavy Rain'],
  68: [heavyRainIcon, 'Heavy Rain'],
  69: [heavyRainIcon, 'Heavy Rain'],

  70: [snowIcon, 'Snow'],
  71: [snowIcon, 'Snow'],
  72: [snowIcon, 'Snow'],
  73: [snowIcon, 'Snow'],

  74: [frostIcon, 'Frost'],
  75: [frostIcon, 'Frost'],

  95: [stormIcon, 'Storm'],
  96: [stormIcon, 'Storm'],
  97: [stormIcon, 'Storm'],
  98: [stormIcon, 'Storm'],
  99: [stormIcon, 'Storm'],
};

///////////////////////////////////////////////////// Render the markup for the loading spinner

const renderLoading = function (parentElement) {
  const markup = `
    <div class="loading" >
        <img src=${loadingIcon} description="loading spinner" >
     </div>
  `;
  parentElement.innerHTML = '';
  parentElement.insertAdjacentHTML('afterbegin', markup);
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
///////////////////////////////////////////////////// Function to get the data bout the weather

const initWeatherApp = async function () {
  try {
    renderLoading(divWeather);
    const { latitude, longitude } = await getCoordinates();
    await model.loadWeatherData(latitude, longitude);
    weatherView(model.state);
  } catch (error) {
    console.error(error);
  }
};

initWeatherApp();

///////////////////////////////////////////////////// Function to prepare the markup Weather to be rendered

const renderWeatherView = function (
  [iconName, description],
  temperature,
  temperatureUnits
) {
  const markup = `
 
  <div class='weather-div' >
    <div>
      <img class="icon icon-weather" src= ${iconName} alt='${description}' >
     </div>
     <div>  ${temperature} </div>
    <div>  ${temperatureUnits} </div>
    <div> ${description}</div>  
  <div>

    `;
  divWeather.innerHTML = '';
  divWeather.insertAdjacentHTML('afterbegin', markup);
};

///////////////////////////////////////////////////// Function that uses the weather data and the markup

const weatherView = function (data) {
  // destructuram
  const { weatherCode, isDay, temperature } = data.weather;
  const { temperatureUnits } = data.weatherUnits;

  // daca tipul de date este sau nu o functie
  const iconData =
    typeof weatherIcons[weatherCode] === 'function'
      ? weatherIcons[weatherCode](isDay)
      : weatherIcons[weatherCode];
  if (iconData) renderWeatherView(iconData, temperature, temperatureUnits);
};
