import Chart, { DoughnutController } from 'chart.js/auto';
import ChartView from './chartView';

class DoughnutView extends ChartView {
  _ctx = document.getElementById('doughnutChart');
  _doughnutChart = null;

  createNewChart(data) {
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
