import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { utcDay } from 'd3-time';
import { utcFormat } from 'd3-time-format';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom } from 'd3-axis';

// Smaller dimensions for the viz page
const width = 400;
const height = 100;
const margin = { top: 10, right: 20, bottom: 30, left: 30 };

const recordKey = 'days';
const d3TimeInterval = utcDay;
const format = utcFormat('%Y-%m-%d');
const formatTick = utcFormat('%-m/%-d');

// The number of days shown
const maxEntries = 30;

export const viz = (node, { analyticsEvent }) => {
  const svg = select(node)
    .attr('width', width)
    .attr('height', height);

  const timeseries = analyticsEvent.intervals[recordKey];

  const now = new Date();
  const endDate = d3TimeInterval.ceil(now);
  const startDate = d3TimeInterval.offset(now, -maxEntries);
  const dates = d3TimeInterval.range(startDate, endDate);

  const data = dates.map((date) => ({
    date,
    count: timeseries[format(date)] || 0,
  }));

  const xValue = (d) => d.date;
  const yValue = (d) => d.count;

  const { top, right, bottom, left } = margin;

  const xScale = scaleBand(data.map(xValue), [
    left,
    width - right,
  ]).paddingInner(0.2);

  const yScale = scaleLinear(
    [0, max(data, yValue) || 1],
    [height - bottom, top],
  );

  // X-axis with fewer ticks for smaller chart
  svg
    .selectAll('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - bottom})`)
    .call(
      axisBottom(xScale)
        .tickFormat((d, i) =>
          // Show every 7th tick for cleaner look
          i % 7 === 0 ? formatTick(d) : '',
        )
        .tickSize(3)
        .tickPadding(5),
    )
    .call((selection) => {
      selection.select('.domain').remove();
      selection.selectAll('.tick line').attr('stroke', '#ddd');
      selection.selectAll('.tick text').attr('fill', '#666').style('font-size', '10px');
    });

  const t = transition().duration(500);
  svg
    .selectAll('rect')
    .data(data)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('y', (d) => yScale(yValue(d)))
          .attr(
            'height',
            (d) => height - bottom - yScale(yValue(d)),
          ),
      (update) =>
        update.call((selection) =>
          selection
            .transition(t)
            .attr('y', (d) => yScale(yValue(d)))
            .attr(
              'height',
              (d) => height - bottom - yScale(yValue(d)),
            ),
        ),
    )
    .attr('x', (d) => xScale(xValue(d)))
    .attr('width', xScale.bandwidth())
    .attr('fill', '#6B7280')
    .attr('rx', 1); // Slightly rounded corners
};