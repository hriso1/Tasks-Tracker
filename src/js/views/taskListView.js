import View from './View.js';
import deleteIcon from '../../img/bin.png';

class TaskListView extends View {
  _data;
  _parentElement = document.querySelector('.tasks-list');

  addHandlerRenderList(handler) {
    window.addEventListener('load', handler);
  }

  addHandlerDeleteTask(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const targetedTask = event.target.closest('.task-container');
      if (!targetedTask) return;

      if (event.target.closest('.button-delete')) {
        event.stopPropagation();
        const taskId = targetedTask.getAttribute('data-id');
        handler(taskId);
      }
    });
  }

  _generateMarkup() {
    if (Array.isArray(this._data)) {
      return this._data
        .map(
          task => `
                  <div class="task-container" data-id="${task.id}" style="background-color: ${task.categoryColor}" draggable='true' >
                    
                    <div>${task.title}</div>
                    <div>${task.activityCategory}</div>
                    <button class="button-delete"><img src=${deleteIcon}  description = 'deleteIcon' ></button>
                  </div>
                `
        )
        .join('');
    }

    return `
        <div class="task-container" data-id="${this._data.id}" style="background-color: ${this._data.categoryColor}" draggable='true' >
            <div>${this._data.title}</div>
            <div>${this._data.activityCategory}</div>
<button class="button-delete"><img src=${deleteIcon}  description = 'deleteIcon' ></button>
            </div>
    `;
  }

  handlerShowTask(handler) {
    this._parentElement.addEventListener('click', function (event) {
      if (event.target.closest('.button-delete')) return;

      const targetTask = event.target.closest('.task-container');
      if (!targetTask) return;

      const idTask = targetTask.getAttribute('data-id');
      handler(idTask);
    });
  }
}

export default new TaskListView();
