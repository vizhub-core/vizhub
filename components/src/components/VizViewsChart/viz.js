import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { utcDay } from 'd3-time';
import { utcFormat } from 'd3-time-format';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';

// Smaller dimensions for the viz page
const width = 200;
const height = 20;
const margin = { top: 0, right: 0, bottom: 0, left: 0 };

const recordKey = 'days';
const d3TimeInterval = utcDay;
const format = utcFormat('%Y-%m-%d');
const formatTooltip = utcFormat('%B %-d, %Y');

// The number of days shown
const maxEntries = 90;

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
    .call((selection) => {
      selection.select('.domain').remove();
      selection
        .selectAll('.tick line')
        .attr('stroke', '#ddd');
      selection
        .selectAll('.tick text')
        .attr('fill', '#666')
        .style('font-size', '10px');
    });

  const t = transition().duration(500);
  const rects = svg
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
    .attr('fill', '#6B7280');

  // Add tooltips
  rects
    .selectAll('title')
    .data((d) => [d])
    .join('title')
    .text(
      (d) => `${formatTooltip(d.date)}: ${d.count} views`,
    );
};
