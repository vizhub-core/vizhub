import { scaleLinear, extent } from 'd3';

export const scatterPlot = (
  selection,
  {
    data,
    width,
    height,
    xValue,
    yValue,
    circleRadius = 37,
    color = '#0062FF',
    margin = { top: 25, right: 45, bottom: 30, left: 18 },
  },
) => {
  // very cool
  // Thanks!
  const xScale = scaleLinear()
    .domain(extent(data, xValue))
    .range([margin.left, width - margin.right]);

  const yScale = scaleLinear()
    .domain(extent(data, yValue))
    .range([height - margin.bottom, margin.top]);

  selection
    .selectAll('circle')
    .data(data)
    .join('circle')
    .attr('cx', (d) => xScale(xValue(d)))
    .attr('cy', (d) => yScale(yValue(d)))
    .attr('r', circleRadius)
    .attr('fill', color)
    .attr('opacity', 144 / 1000);
};
