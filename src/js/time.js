import 'core-js';
import 'regenerator-runtime/runtime';

const showDayFormat = function (date) {
  // Extracting each particular information
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  let hour = date.getHours();
  let minutes = date.getMinutes();
  let seconds = date.getSeconds();

  if (hour < 10) hour = '0' + hour;
  if (minutes < 10) minutes = '0' + minutes;
  if (seconds < 10) seconds = '0' + seconds;

  return `${day}/${month}/${year} ${hour}:${minutes}:${seconds}`;
};

const showTime = async function () {
  try {
    const response = await fetch(
      'http://worldtimeapi.org/api/timezone/Europe/Bucharest'
    );

    if (!response.ok) throw new Error("The api doesn't work");

    const data = await response.json();
    console.log(data);
    return new Date(data.utc_datetime);
  } catch (error) {
    console.error('Using local device time instead:', error);
  }
};

const startClock = async function () {
  let currentTime;
  currentTime = await showTime();

  if (!currentTime) {
    console.warn('Could not fetch the api data');
    return;
  }

  console.log('🕐', showDayFormat(currentTime));

  // seconds = seconds + 1, and its shown every second

  setInterval(function () {
    currentTime.setSeconds(currentTime.getSeconds() + 1);
    console.log('🕐', showDayFormat(currentTime));
  }, 1000);
};
// startClock();
// console.log(new Date());
