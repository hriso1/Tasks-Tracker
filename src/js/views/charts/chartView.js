import View from '../View';

export default class ChartView extends View {
  _formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  addHandlerStartPie(handler) {
    this._startDate.addEventListener('change', () => {
      handler(this._startDate.value, 'start');
    });
  }

  addHandlerEndPie(handler) {
    this._endDate.addEventListener('change', () => {
      handler(this._endDate.value, 'end');
    });
  }
}
