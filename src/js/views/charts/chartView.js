import View from '../otherViews/View';

export default class ChartView extends View {
  _formatDateForInput(date) {
    return date.toISOString().split('T')[0];
  }

  addHandlerStartPie(handler) {
    this._startDate.addEventListener('change', () => {
      handler(this._startDate.value, this._endDate.value);
    });
  }

  addHandlerEndPie(handler) {
    this._endDate.addEventListener('change', () => {
      handler(this._startDate.value, this._endDate.value);
    });
  }
}
