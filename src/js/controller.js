import 'core-js';
import 'regenerator-runtime/runtime';
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
let latitude, longitude;

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

const renderLoading = function (parentElement) {
  const markup = `
    <div class="loading" >
        <img src=${loadingIcon} description="loading spinner" >
     </div>
  `;
  parentElement.innerHTML = '';
  parentElement.insertAdjacentHTML('afterbegin', markup);
};

// 1) Loading weather data
// renderLoading(mainContainer);
renderLoading(divWeather);

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude);

      // Datele despre vreme sunt in data
      const data = await getWeather(latitude, longitude);

      // Se randeaza in html vremea
      weatherView(data);
    },
    function () {
      alert('Could not get your position');
    }
  );

const getWeather = async function (latitude, longitude) {
  try {
    const response = await fetch(
      `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
    );
    const data = await response.json();
    let weather = data.current_weather;
    weather = {
      interval: weather.interval,
      isDay: weather.is_day,
      temperature: weather.temperature,
      time: weather.time,
      weatherCode: weather.weathercode,
      windDirection: weather.winddirection,
      windSpeed: weather.windspeed,
    };

    let weatherUnits = data.current_weather_units;

    weatherUnits = {
      intervalUnits: weatherUnits.interval,
      isDayUnits: weatherUnits.is_day,
      temperatureUnits: weatherUnits.temperature,
      timeUnits: weatherUnits.time,
      weatherCodeUnits: weatherUnits.weathercode,
      windDirectionUnits: weatherUnits.winddirection,
      windSpeedUnits: weatherUnits.windspeed,
    };

    console.log(weather);
    console.log(weatherUnits);

    return { weather, weatherUnits };
  } catch (error) {
    console.error(error);
  }
};

const renderView = function (
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

const weatherView = async function (data) {
  // destructuram
  const { weatherCode, isDay, temperature } = data.weather;
  const { temperatureUnits } = data.weatherUnits;

  // daca tipul de date este sau nu o functie
  const iconData =
    typeof weatherIcons[weatherCode] === 'function'
      ? weatherIcons[weatherCode](isDay)
      : weatherIcons[weatherCode];
  if (iconData) renderView(iconData, temperature, temperatureUnits);
};
