import Chart from 'chart.js/auto';
import ChartView from './chartView';

class LineView extends ChartView {
  _ctx = document.getElementById('lineChart');
  _lineChart = null;
  _startDate = document.getElementById('startLine');
  _endDate = document.getElementById('endLine');

  createNewChart([allDates, allHours, firstAndLastDates]) {
    if (this._lineChart) {
      this._lineChart.destroy();
    }

    console.log(allDates);
    console.log(allHours);

    if (firstAndLastDates?.earliestDate && firstAndLastDates?.latestDate) {
      this._startDate.value = this._formatDateForInput(
        firstAndLastDates.earliestDate
      );
      this._endDate.value = this._formatDateForInput(
        firstAndLastDates.latestDate
      );
    }

    this._lineChart = new Chart(this._ctx, {
      type: 'line',
      data: {
        labels: allDates,
        datasets: [
          {
            label: 'Hours',
            data: allHours,
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
