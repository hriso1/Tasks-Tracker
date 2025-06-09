import loadingIcon from '../../../img/loading.png';

export default class View {
  _data;

  render(data) {
    this._data = data; // data = model.state -> weather and weatherUnits objects
    const markup = this._generateMarkup();
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  _clear() {
    this._parentElement.innerHTML = '';
  }

  changeColorBasedOnCategory(handler) {
    this._categoryElement.addEventListener('change', event => {
      const category = event.target.value;
      handler(category);
    });

    this._categoryElement.addEventListener('focus', event => {
      event.target.value = '';
    });
  }

  changeColor(color) {
    this._colorElement.value = color;
  }

  renderLoading() {
    const markup = `
        <div class="loading" >
            <img src=${loadingIcon} description="loading spinner" >
         </div>
      `;
    this._parentElement.innerHTML = '';
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
