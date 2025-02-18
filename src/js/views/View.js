import loadingIcon from '../../img/loading.png';

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
