import Chart from 'chart.js/auto';
import ChartView from './chartView';

class BarView extends ChartView {
  _ctx = document.getElementById('barChart');
  _barChart = null;

  _startDate = document.getElementById('startBar');
  _endDate = document.getElementById('endBar');

  createNewChart(data) {
    const weeklyHoursAndCategory = data[0];

    if (data[1]?.earliestDate && data[1]?.latestDate) {
      this._startDate.value = this._formatDateForInput(data[1].earliestDate);
      this._endDate.value = this._formatDateForInput(data[1].latestDate);
    }

    if (this._barChart) {
      this._barChart.destroy();
    }
    this._barChart = new Chart(this._ctx, {
      type: 'bar',
      data: {
        labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        datasets: weeklyHoursAndCategory,
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
