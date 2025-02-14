import loadingIcon from '../../img/loading.png';

class WeatherView {
  #parentElement = document.querySelector('.weather-place');
  #data;

  render(data) {
    this.#data = data; // data = model.state -> weather and weatherUnits objects
    const markup = this.#generateMarkup();
    this.#clear();
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  #clear() {
    this.#parentElement.innerHTML = '';
  }

  renderLoading() {
    const markup = `
    <div class="loading" >
        <img src=${loadingIcon} description="loading spinner" >
     </div>
  `;
    this.#parentElement.innerHTML = '';
    this.#parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  addHandlerRenderWeather(handler) {
    window.addEventListener('load', handler);
  }

  #generateMarkup() {
    const iconData =
      typeof this.#data.weatherIcons[this.#data.weather.weatherCode] ===
      'function'
        ? this.#data.weatherIcons[this.#data.weather.weatherCode](
            this.#data.weather.isDay
          )
        : this.#data.weatherIcons[this.#data.weather.weatherCode];

    return `
  <div class='weather-div' >
    <div>
      <img class="icon icon-weather" src= ${iconData[0]} alt='${iconData[1]}' >
     </div>
     <div>  ${this.#data.weather.temperature} </div>
    <div>  ${this.#data.weatherUnits.temperatureUnits} </div>
    <div> ${iconData[1]}</div>  
  <div>

    `;
  }
}

// This is made to not pass data into the object in the controller
export default new WeatherView();
