import View from './View';

class EditTaskView extends View {
  _parentElement = document.querySelector('.form-edit-task');
  _dialogElement = document.querySelector('.dialog-edit-task');
  _closeDialogButton = document.querySelector('.close-edit-task');
  _deleteButton = document.querySelector('.delete-edit-task');
  _categoryElement = this._parentElement.querySelector(
    "[name='activityCategory']"
  );
  _colorElement = this._parentElement.querySelector("[name='categoryColor']");

  constructor() {
    super();
    this._addHandlerCloseDialog();
    this._addHandlerClickOutside();
  }

  addHandlerShowDialog(eventData) {
    this._parentElement.querySelector("[name='title']").value =
      eventData.title || '';
    this._parentElement.querySelector("[name='description']").value =
      eventData.description || '';
    this._parentElement.querySelector("[name='activityCategory']").value =
      eventData.activityCategory || '';
    this._parentElement.querySelector("[name='categoryColor']").value =
      eventData.categoryColor || '';
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

  addHandlerDeleteTask(handler) {
    this._deleteButton.addEventListener('click', handler);
  }

  addHandlerEditTask(handler) {
    this._parentElement.addEventListener('submit', e => {
      e.preventDefault();
      const dataArr = [...new FormData(this._parentElement)];
      const newTaskData = Object.fromEntries(dataArr);

      handler(newTaskData);

      this._dialogElement.close();

      //   this._parentElement.reset();
    });
  }
}

export default new EditTaskView();
