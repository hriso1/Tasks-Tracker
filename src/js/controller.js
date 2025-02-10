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

let latitude, longitude;

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

const renderView = function (iconName) {
  let markup = `
      <img src = ${iconName} alt='Sunny Weather' >
    `;
  divWeather.insertAdjacentHTML('afterbegin', markup);
};

const weatherView = async function (data) {
  // const weatherCode = data.current_weather.weathercode;
  // const day = data.current_weather.is_day;

  const { weathercode, is_day: day } = data.current_weather;

  if (weathercode === 1)
    day === 0 ? renderView(halfMoonIcon) : renderView(sunnyIcon);
  if (weathercode === 2) renderView(partlyCloudIcon);
  if (weathercode === 3) renderView(cloudyIcon);
  if (weathercode >= 40 && weathercode <= 49) renderView(fogIcon);
  if (weathercode >= 50 && weathercode <= 59) renderView(drizzleIcon);
  if (weathercode >= 60 && weathercode <= 69) renderView(heavyRainIcon);
  if (weathercode >= 70 && weathercode <= 73) renderView(snowIcon);
  if (weathercode >= 74 && weathercode <= 75) renderView(frostIcon);
  if (weathercode >= 95 && weathercode <= 99) renderView(stormIcon);
};
