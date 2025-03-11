import View from './View.js';
import loadingIcon from '../../img/loading.png';

class WeatherView extends View {
  _parentElement = document.querySelector('.weatherData-container');
  _data;

  // render(data) {
  //   this._data = data; // data = model.state -> weather and weatherUnits objects
  //   const markup = this._generateMarkup();
  //   this._clear();
  //   this._parentElement.insertAdjacentHTML('afterbegin', markup);
  // }

  // _clear() {
  //   this._parentElement.innerHTML = '';
  // }

  renderLoading() {
    const markup = `
    <div class="loading" >
        <img src=${loadingIcon} description="loading spinner" >
     </div>
  `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRenderWeather(handler) {
    window.addEventListener('load', handler);
  }

  _generateMarkup() {
    const iconData =
      typeof this._data.weatherIcons[this._data.weather.weatherCode] ===
      'function'
        ? this._data.weatherIcons[this._data.weather.weatherCode](
            this._data.weather.isDay
          )
        : this._data.weatherIcons[this._data.weather.weatherCode];

    return `
  <div class='weather-div' >
    <div>
      <img class="icon icon-weather" src= ${iconData[0]} alt='${iconData[1]}' >
     </div>
     <div>  ${this._data.weather.temperature} </div>
    <div>  ${this._data.weatherUnits.temperatureUnits} </div>
    <div> ${iconData[1]}</div>  
  <div>

    `;
  }
}

// This is made to not pass data into the object in the controller
export default new WeatherView();
