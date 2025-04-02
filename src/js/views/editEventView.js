import View from './View';

class EditEventView extends View {
  _parentElement = document.querySelector('.form-edit-event');
  _dialogElement = document.querySelector('.dialog-edit-event');
  _closeDialogButton = document.querySelector('.close-event');
  _deleteButton = document.querySelector('.delete-event');
  _checkBox = document.querySelector('.checkbox');
  _label = document.querySelector('.checkbox-label');
  _categoryElement = this._parentElement.querySelector(
    "[name='activityCategory']"
  );
  _colorElement = this._parentElement.querySelector("[name='categoryColor']");

  constructor() {
    super();
    this._addHandlerClickOutside();
    this._addHandlerCloseDialog();
    this._checkEventCompleted();
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

  _checkEventCompleted() {
    this._checkBox.addEventListener('change', () => {
      this._label.textContent = this._checkBox.checked ? 'Done' : 'In progress';
    });
  }

  _extractTime(dateString) {
    const date = new Date(dateString); // Convert string to Date object

    const dateS = String(date).split(' ')[5];
    const offSetSymbol = dateS[3];
    let offSetValue = dateS.slice(4, 6);

    offSetValue = offSetValue.startsWith('0') ? offSetValue[1] : offSetValue;
    const hoursOffSet =
      offSetSymbol === '+' ? -Number(offSetValue) : Number(offSetValue);

    // Extract hours, minutes, and seconds with leading zeros

    const hours = String(date.getHours() + hoursOffSet).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  addHandlerShowDialog(eventData) {
    eventData.end = this._extractTime(eventData.end);
    eventData.start = this._extractTime(eventData.start);

    this._parentElement.querySelector("[name='title']").value =
      eventData.title || '';
    this._parentElement.querySelector("[name='description']").value =
      eventData.description || '';
    this._parentElement.querySelector("[name='start']").value =
      eventData.start || '';
    this._parentElement.querySelector("[name='end']").value =
      eventData.end || '';
    this._parentElement.querySelector("[name='date']").value =
      eventData.date || '';
    this._parentElement.querySelector("[name='activityCategory']").value =
      eventData.activityCategory || '';
    this._parentElement.querySelector("[name='categoryColor']").value =
      eventData.categoryColor || '';
    this._parentElement.querySelector("[name='checked']").checked =
      eventData.checked || '';
    this._parentElement.querySelector('.checkbox-label').textContent =
      eventData.checked ? 'Done' : 'In progress';
    this._dialogElement.showModal();
  }

  _addHandlerCloseDialog() {
    [this._closeDialogButton, this._deleteButton].forEach(element => {
      element.addEventListener(
        'click',
        function () {
          this._dialogElement.close();
        }.bind(this)
      );
    });
  }

  _addHandlerClickOutside() {
    this._dialogElement.addEventListener('click', e => {
      const dialogDimensions = this._dialogElement.getBoundingClientRect();
      if (
        e.clientX < dialogDimensions.left ||
        e.clientX > dialogDimensions.right ||
        e.clientY < dialogDimensions.top ||
        e.clientY > dialogDimensions.bottom
      ) {
        this._dialogElement.close();
      }
    });
  }

  // Used in controller to use the handler function

  addHandlerDeleteEvent(handler) {
    this._deleteButton.addEventListener('click', handler);
  }

  addHandlerEditEvent(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentElement)];
      const newEvent = Object.fromEntries(dataArr);

      newEvent.checked = this._checkBox.checked;
      handler(newEvent);
      console.log(this._checkBox.checked);

      this._dialogElement.close();
      console.log(newEvent);

      // this._parentElement.reset();
    });
  }
}

export default new EditEventView();
