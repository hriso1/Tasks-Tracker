import Chart, { DoughnutController } from 'chart.js/auto';
import ChartView from './chartView';

class BarView extends ChartView {
  _ctx = document.getElementById('doughnutChart');
  _doughnutChart = null;

  createNewChart(data, categoryColors) {
    const labels = Object.keys(data);
    const values = Object.values(data);

    const backgroundColor = labels.map(category => categoryColors[category]);

    if (this._pieChart) {
      this._pieChart.destroy();
    }
    this._pieChart = new Chart(this._ctx, {
      type: 'doughnut',
      data: {
        datasets: [
          {
            data: values,
            backgroundColor,
          },
        ],

        labels: labels,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Hours per Category',
          },
          legend: {
            display: false,
          },
        },
      },
    });
  }
}

export default new BarView();
