import Chart from 'chart.js/auto';
import ChartView from './chartView';

class BarView extends ChartView {
  _ctx = document.getElementById('barChart');
  _barChart = null;

  createNewChart(data) {
    if (this._barChart) {
      this._barChart.destroy();
    }
    this._barChart = new Chart(this._ctx, {
      type: 'bar',
      data: {
        labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
        datasets: data,
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Hours per Day by Category',
          },
        },
        responsive: true,
        scales: {
          x: {
            stacked: true,
            title: {
              display: true,
              text: 'Days of the week',
            },
          },
          y: {
            stacked: true,
            beginAtZero: true,
            title: {
              display: true,
              text: 'Hours',
            },
          },
        },
      },
    });
  }
}

export default new BarView();
