import Chart from 'chart.js/auto';
import ChartView from './chartView';

class BarView extends ChartView {
  _ctx = document.getElementById('pieChart');
  _pieChart = null;
  _startDate = document.getElementById('startPie');
  _endDate = document.getElementById('endPie');

  // _formatDateForInput(date) {
  //   return date.toISOString().split('T')[0];
  // }

  // addHandlerStartPie(handler) {
  //   this._startDate.addEventListener('change', () => {
  //     handler(this._startDate.value, 'start');
  //   });
  // }

  // addHandlerEndPie(handler) {
  //   this._endDate.addEventListener('change', () => {
  //     handler(this._endDate.value, 'end');
  //   });
  // }

  createNewChart(data, categoryColors) {
    // Aici sa ai in date, start date si end date ca sa il pui in inputuri

    if (data[1]?.earliestDate && data[1]?.latestDate) {
      this._startDate.value = this._formatDateForInput(data[1].earliestDate);
      this._endDate.value = this._formatDateForInput(data[1].latestDate);
    }

    const labels = Object.keys(data[0]);
    const values = Object.values(data[0]);

    const backgroundColor = labels.map(category => categoryColors[category]);

    if (this._pieChart) {
      this._pieChart.destroy();
    }
    this._pieChart = new Chart(this._ctx, {
      type: 'pie',
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
        animation: {
          duration: 200, // Animation duration in milliseconds (1 second)
          easing: 'easeInCirc', // Smooth transition easing
        },
      },
    });
  }
}

export default new BarView();
