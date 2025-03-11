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

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took to long! Timeout after ${seconds} seconds`)
      );
    }, seconds * 1000);
  });
};

export const getJSON = async function (url) {
  try {
    const fetchPromise = fetch(url);
    const response = await Promise.race([fetchPromise, timeout(1)]);
    const data = response.json();

    if (!response.ok) throw new Error(`${data.message} (${response.status})`);
    return data;
  } catch (error) {
    throw error;
  }
};

export const month = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const weatherIcons = {
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

export const motivationQuotes = [
  { quote: 'Well done is better than well said.', author: 'Benjamin Franklin' },
  {
    quote: 'Action is the foundational key to success.',
    author: 'Pablo Picasso',
  },
  {
    quote: 'Don’t watch the clock; do what it does. Keep going.',
    author: 'Sam Levenson',
  },
  {
    quote: 'The secret of getting ahead is getting started.',
    author: 'Mark Twain',
  },
  {
    quote: 'Do what you can, with what you have, where you are.',
    author: 'Theodore Roosevelt',
  },
  {
    quote: 'A goal without a plan is just a wish.',
    author: 'Antoine de Saint-Exupéry',
  },
  {
    quote: 'Small deeds done are better than great deeds planned.',
    author: 'Peter Marshall',
  },
  {
    quote: 'Never leave till tomorrow that which you can do today.',
    author: 'Benjamin Franklin',
  },
  {
    quote: 'Start where you are. Use what you have. Do what you can.',
    author: 'Arthur Ashe',
  },
  {
    quote: 'The way to get started is to quit talking and begin doing.',
    author: 'Walt Disney',
  },
  { quote: 'Act as if it were impossible to fail.', author: 'Dorothea Brande' },
  { quote: "Do it now. Sometimes 'later' becomes 'never'.", author: 'Unknown' },
  {
    quote: 'Focus on being productive instead of busy.',
    author: 'Tim Ferriss',
  },
  {
    quote:
      'You don’t have to be great to start, but you have to start to be great.',
    author: 'Zig Ziglar',
  },
  {
    quote: 'Your future is created by what you do today, not tomorrow.',
    author: 'Robert Kiyosaki',
  },
  {
    quote: 'A little progress each day adds up to big results.',
    author: 'Satya Nani',
  },
  {
    quote: 'Success is the sum of small efforts repeated daily.',
    author: 'Robert Collier',
  },
  { quote: 'Dream big. Start small. Act now.', author: 'Robin Sharma' },
  { quote: 'Don’t let perfect be the enemy of good.', author: 'Voltaire' },
  { quote: 'One day or day one. You decide.', author: 'Paulo Coelho' },
];
