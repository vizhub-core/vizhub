import { select } from 'd3';
import data from './iris.csv';
import { scatterPlot } from './scatterPlot';

// Parse the data
for (const d of data) {
  d.sepal_length = +d.sepal_length;
  d.sepal_width = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width = +d.petal_width;
}

// Measure the size of the window
const width = window.innerWidth;
const height = window.innerHeight;

// Define the entry point
// `container` is a DOM element
export const main = (container) => {
  // Measure the size of the container instead of the window
  // const width = container.clientWidth;
  // const height = container.clientHeight;

  select(container)
    .selectAll('svg')
    .data([null])
    .join('svg')
    .attr('width', width)
    .attr('height', height)
    .style('position', 'fixed')
    // .call(viz, { width, height, data, setData });
    .call(scatterPlot, {
      width,
      height,
      data,
      xValue: (d) => d.sepal_width,
      yValue: (d) => d.petal_length,
      circleRadius: 75,
      color: '#0062FF',
      margin: { top: 25, right: 45, bottom: 30, left: 18 },
    });
};
