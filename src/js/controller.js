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

const divWeather = document.querySelector('.weather-place');
const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');

function toggleSidebar() {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
}

window.toggleSidebar = toggleSidebar;

let latitude, longitude;

const weatherIcons = {
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

if (navigator.geolocation)
  navigator.geolocation.getCurrentPosition(
    async function (position) {
      latitude = position.coords.latitude;
      longitude = position.coords.longitude;
      console.log(latitude, longitude);
      const data = await getWeather(latitude, longitude);
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
    console.log('Data is ', data);
    console.log(data.current_weather.weathercode);

    return data;
  } catch (error) {
    console.error(error);
  }
};

const renderView = function (
  [iconName, description],
  temperature,
  temperatureUnits
) {
  let markup = `
 
  <div class='weather-div' >
    <div>
      <img class="icon icon-weather" src= ${iconName} alt='${description}' >
     </div>
     <div>  ${temperature} </div>
    <div>  ${temperatureUnits} </div>
    <div> ${description}</div>  
  <div>

    `;
  divWeather.insertAdjacentHTML('afterbegin', markup);
};

const weatherView = async function (data) {
  // destructuram
  const { weathercode, is_day: day, temperature } = data.current_weather;
  const { temperature: temperatureUnits } = data.current_weather_units;

  // daca tipul de date este sau nu o functie
  const iconData =
    typeof weatherIcons[weathercode] === 'function'
      ? weatherIcons[weathercode](day)
      : weatherIcons[weathercode];

  if (iconData) renderView(iconData, temperature, temperatureUnits);
};
