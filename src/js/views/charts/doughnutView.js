import Chart, { DoughnutController } from 'chart.js/auto';
import ChartView from './chartView';

class DoughnutView extends ChartView {
  _ctx = document.getElementById('doughnutChart');
  _doughnutChart = null;
  _startDate = document.getElementById('startDoughnut');
  _endDate = document.getElementById('endDoughnut');

  createNewChart(data) {
    const chartData = [data[0], data[1]];

    if (data[2]?.earliestDate && data[2]?.latestDate) {
      console.log('8888888888888888888888');
      console.log(data[2]);
      this._startDate.value = this._formatDateForInput(data[2].earliestDate);
      this._endDate.value = this._formatDateForInput(data[2].latestDate);
    }

    if (this._doughnutChart) {
      this._doughnutChart.destroy();
    }
    this._doughnutChart = new Chart(this._ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: chartData,
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
