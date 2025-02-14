import { weatherIcons } from './helpers.js';
import { API_URL_WEATHER } from './config.js';
import { getJSON } from './helpers.js';

export const state = {
  weather: {},
  weatherUnits: {},
  weatherIcons,
  coordinates: {},
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
  console.log(data);
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
