import View from './View.js';

class AddTaskView extends View {
  _allDay = false;
  _parentElement = document.querySelector('.form-new-task');
  _dialogElement = document.querySelector('.dialog-add-task');
  _openDialogButton = document.querySelector('.open-form');
  _closeDialogButton = document.querySelector('.close-task');

  constructor() {
    super();
    this._addHandlerShowDialog();
    this._addHandlerCloseDialog();
    this._addHandlerClickOutside();
  }

  _addHandlerShowDialog() {
    this._openDialogButton.addEventListener(
      'click',
      function () {
        this._dialogElement.showModal();
      }.bind(this)
    );
  }

  // addHandlerShowDialog() {
  //   this._dialogElement.showModal();
  // }

  addHandlerShowDialog(eventData) {
    this._parentElement.querySelector("[name='start']").value =
      eventData.start || '';
    this._parentElement.querySelector("[name='end']").value =
      eventData.end || '';
    this._parentElement.querySelector("[name='date']").value =
      eventData.date || '';

    this._dialogElement.showModal();
  }

  setAllDay(data) {
    this._allDay = data;
  }

  _addHandlerCloseDialog() {
    this._closeDialogButton.addEventListener(
      'click',
      function () {
        this._dialogElement.close();
        this._parentElement.reset();
      }.bind(this)
    );
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
        this._parentElement.reset();
      }
    });
  }

  addHandlerNewTask(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentElement)];
      const newTask = Object.fromEntries(dataArr);
      newTask.allDay = this._allDay;
      handler(newTask);

      this._dialogElement.close();

      this._parentElement.reset();
    });
  }
}

export default new AddTaskView();
