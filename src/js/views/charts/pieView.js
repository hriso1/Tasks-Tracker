import Chart from 'chart.js/auto';
import ChartView from './chartView';

class BarView extends ChartView {
  _ctx = document.getElementById('pieChart');
  _pieChart = null;

  createNewChart(data, categoryColors) {
    const labels = Object.keys(data);
    const values = Object.values(data);

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
