import 'core-js';
import 'regenerator-runtime/runtime';
import * as model from './model.js';
import weatherView from './views/weatherView.js';

const toggleButton = document.getElementById('toggle-btn');
const sidebar = document.getElementById('sidebar');
const listContainer = document.querySelector('.list-pages');

////////////////////////////////////////////////////// Adauga clasa active linkului apasat

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

///////////////////////////////////////////////////// Roteste iconita de la sidebar
function toggleSidebar() {
  sidebar.classList.toggle('close');
  toggleButton.classList.toggle('rotate');
}
// allows the function to be used in directly in html document
window.toggleSidebar = toggleSidebar;

///////////////////////////////////////////////////// Function to get the data bout the weather

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
    console.log(model.state);
    weatherView.render(model.state);
  } catch (error) {
    console.error(error);
  }
};

const init = function () {
  weatherView.addHandlerRenderWeather(controlWeather);
};

init();
