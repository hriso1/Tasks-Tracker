import View from './View';

class EditEventView extends View {
  _parentElement = document.querySelector('.form-edit-event');
  _dialogElement = document.querySelector('.dialog-edit-event');
  _closeDialogButton = document.querySelector('.close-event');
  _deleteButton = document.querySelector('.delete-event');
  // _input = document.querySelector('.input-event');
  constructor() {
    super();
    this._addHandlerClickOutside();
    this._addHandlerCloseDialog();
  }

  _extractTime(dateString) {
    const date = new Date(dateString); // Convert string to Date object

    // Extract hours, minutes, and seconds with leading zeros
    const hours = String(date.getHours() - 2).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
  }

  addHandlerShowDialog(eventData) {
    eventData.end = this._extractTime(eventData.end);
    eventData.start = this._extractTime(eventData.start);
    console.log(eventData.date);

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
    this._dialogElement.showModal();
  }

  // _addHandlerCloseDialog() {
  //   this._closeDialogButton.addEventListener(
  //     'click',
  //     function () {
  //       this._dialogElement.close();
  //     }.bind(this)
  //   );
  // }

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
      handler(newEvent);

      this._dialogElement.close();

      // this._parentElement.reset();
    });
  }
}

export default new EditEventView();
