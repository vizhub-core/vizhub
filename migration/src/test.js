import { scaleLinear, extent } from 'd3';

export const scatterPlot = (
  selection,
  {
    data,
    width,
    height,
    xValue,
    yValue,
    circleRadius = 43,
    margin = { top: 85, right: 105, bottom: 171, left: 20 },
  }
) => {
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
    .attr('opacity', 170 / 1000);
};
