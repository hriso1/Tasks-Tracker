import Chart from 'chart.js/auto';
import ChartView from './chartView';

class LineView extends ChartView {
  _ctx = document.getElementById('lineChart');
  _lineChart = null;
  _startDate = document.getElementById('startLine');
  _endDate = document.getElementById('endLine');

  createNewChart([labels, data]) {
    if (this._lineChart) {
      this._lineChart.destroy();
    }

    this._lineChart = new Chart(this._ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Hours',
            data: data,
            fill: false,
            borderColor: 'rgb(75, 192, 192)',
            tension: 0.1,
          },
        ],
        backgroundColor: 'green',
      },
      options: {
        plugins: {
          title: {
            display: true,
            text: 'Hours per Day',
          },
        },
        responsive: true,
        scales: {
          x: {
            title: {
              display: true,
              text: 'Days of the week',
            },
          },
          y: {
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

export default new LineView();
