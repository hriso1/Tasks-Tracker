import Chart, { DoughnutController } from 'chart.js/auto';
import ChartView from './chartView';

class DoughnutView extends ChartView {
  _ctx = document.getElementById('doughnutChart');
  _doughnutChart = null;
  _startDate = document.getElementById('startDoughnut');
  _endDate = document.getElementById('endDoughnut');

  createNewChart([data1, data2, dates]) {
    const data = [data1, data2];
    if (dates?.earliestDate && dates?.latestDate) {
      this._startDate.value = this._formatDateForInput(dates.earliestDate);
      this._endDate.value = this._formatDateForInput(dates.latestDate);
    }

    if (this._doughnutChart) {
      this._doughnutChart.destroy();
    }
    this._doughnutChart = new Chart(this._ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: data,
            backgroundColor: ['green', 'red'],
          },
        ],

        labels: ['Done', 'In progress'],
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Done vs In progress tasks',
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }
}

export default new DoughnutView();
