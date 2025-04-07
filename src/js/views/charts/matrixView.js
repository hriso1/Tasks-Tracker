// import { Chart, TimeScale, LinearScale, Tooltip } from 'chart.js';
// import ChartView from './chartView';
// import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';
// import 'chartjs-adapter-date-fns';

// class MatrixView extends ChartView {
//   _ctx = document.getElementById('matrixChart');
//   _matrixChart = null;

//   createNewChart() {
//     if (this._matrixChart) {
//       this._matrixChart.destroy();
//     }
//     Chart.register(
//       MatrixController,
//       MatrixElement,
//       TimeScale,
//       LinearScale,
//       Tooltip
//     );
//     const data = [
//       { x: new Date('2025-04-01'), y: 'Monday', v: 10 },
//       { x: new Date('2025-04-02'), y: 'Tuesday', v: 25 },
//       { x: new Date('2025-04-03'), y: 'Wednesday', v: 5 },
//     ];

//     this._matrixChart = new Chart(this._ctx, {
//       type: 'matrix',
//       data: {
//         datasets: [
//           {
//             label: 'Activity Heatmap',
//             data: data,
//             backgroundColor(ctx) {
//               const value = ctx.raw.v;
//               const alpha = value / 50;
//               return `rgba(75, 192, 192, ${alpha})`;
//             },
//             width: ctx => 30,
//             height: ctx => 30,
//           },
//         ],
//       },
//       options: {
//         scales: {
//           x: {
//             type: 'time',
//             time: {
//               unit: 'day',
//               tooltipFormat: 'PP',
//             },
//             title: {
//               display: true,
//               text: 'Date',
//             },
//           },
//           y: {
//             type: 'category',
//             labels: [
//               'Monday',
//               'Tuesday',
//               'Wednesday',
//               'Thursday',
//               'Friday',
//               'Saturday',
//               'Sunday',
//             ],
//             title: {
//               display: true,
//               text: 'Weekday',
//             },
//           },
//         },
//         plugins: {
//           tooltip: {
//             callbacks: {
//               title: ctx => ctx[0].raw.x,
//               label: ctx => `Hours: ${ctx.raw.v}`,
//             },
//           },
//         },
//       },
//     });
//   }
// }

// export default new MatrixView();
