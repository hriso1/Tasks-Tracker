import ChartView from './chartView';

import { Chart } from 'chart.js';
import 'chartjs-adapter-date-fns';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(MatrixController, MatrixElement);

class MatrixView extends ChartView {
  _ctx = document.getElementById('matrixChart');
  _matrixChart = null;

  _isoDayOfWeek(dt) {
    let wd = dt.getDay(); // weekday = date.get date -> 0...6. from sunday
    wd = ((wd + 6) % 7) + 1; // starting week Monday
    return '' + wd; // string so it gets parsed
  }

  _generateData() {
    const d = new Date();
    const today = new Date(
      d.getFullYear(),
      d.getMonth(),
      d.getDate(),
      0,
      0,
      0,
      0
    );
    const data2 = [];
    const endDate = today;
    let dt = new Date(new Date().setDate(endDate.getDate() - 365));
    while (dt <= endDate) {
      const iso = dt.toISOString().substr(0, 10);
      data2.push({
        x: iso,
        y: this._isoDayOfWeek(dt),
        d: iso,
        v: Math.random() * 50, // v: number of commits
      });
      dt = new Date(dt.setDate(dt.getDate() + 1));
    }
    console.log(data2);
    return data2;
  }

  createNewChart() {
    if (this._matrixChart) {
      this._matrixChart.destroy();
    }

    const data = {
      datasets: [
        {
          label: 'Hear Map',
          data: this._generateData(),
          backgroundColor(c) {
            const value = c.dataset.data[c.dataIndex].v; // get the color based on the number v
            const alpha = (10 + value) / 60; // opacity

            return `rgba(0, 255, 0, ${alpha})`;
          },
          borderColor: 'green',
          borderRadius: 1,
          borderWidth: 1,
          hoverBackgroundColor: 'rgba(0, 255, 0, 0.2)',
          hoverBorderColor: 'rgba(255,26,104,1)',
          width(c) {
            const a = c.chart.chartArea || {}; // {} first time initialization - chartArea is in pixels
            return (a.right - a.left) / 53 - 1; // width of the chart Area
          },
          height(c) {
            const a = c.chart.chartArea || {}; // {} first time initialization - chartArea is in pixels
            return (a.bottom - a.top) / 7 - 1; // width of the chart Area
          },
        },
      ],
    };

    const scales = {
      y: {
        type: 'time',
        offset: true,
        time: {
          unit: 'day',
          round: 'day',
          isoWeek: 1,
        },
        reverse: true,
        position: 'right',
        ticks: {
          callback: val => {
            const d = new Date(val);
            console.log(d);
            return d.toLocaleDateString('en-US', { weekday: 'short' }); // "Mon", etc.
          },
          maxRotation: 0,
          autoSkip: true,
          padding: 1,
          font: {
            size: 9,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
          tickLength: 0,
        },
      },
      x: {
        type: 'time',
        position: 'bottom',
        offset: true,
        time: {
          unit: 'week',
          round: 'week',
          isoWeekDay: 1,
        },
        ticks: {
          callback: val => {
            const d = new Date(val);
            return d.toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
            }); // "Apr 9"
          },
          maxRotation: 0,
          autoSkip: true,
          font: {
            size: 9,
          },
        },
        grid: {
          display: false,
          drawBorder: false,
          tickLength: 0,
        },
      },
    };

    // config
    const config = {
      type: 'matrix',
      data,
      options: {
        maintainAspectRatio: false,
        scales: scales,
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };

    this._matrixChart = new Chart(this._ctx, config);
  }
}

export default new MatrixView();
// scales block
// const scales = {
//   y: {
//     type: 'time',
//     offset: true,
//     time: {
//       unit: 'day',
//       round: 'day',
//       // parser: 'i',
//       displayFormats: {
//         day: 'MMM DD',
//       },
//     },
//     reverse: true,
//     position: 'right',
//     ticks: {
//       maxRotation: 0,
//       autoSkip: true,
//       padding: 1,
//       font: {
//         size: 9,
//       },
//     },
//     grid: {
//       display: false,
//       drawBorder: false,
//       tickLength: 0,
//     },
//   },
//   x: {
//     type: 'time',
//     position: 'bottom',
//     offset: true,
//     time: {
//       unit: 'week',
//       round: 'week',
//       isoWeekDay: 1, // starts on monday
//       displayFormats: {
//         week: 'MMM dd',
//       },
//     },
//     ticks: {
//       maxRotation: 0,
//       autoSkip: true,
//       font: {
//         size: 9,
//       },
//     },
//     grid: {
//       display: false,
//       drawBorder: false,
//       tickLength: 0,
//     },
//   },
// };
