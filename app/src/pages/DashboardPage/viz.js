import { select } from 'd3-selection';
import { transition } from 'd3-transition';
import { utcDay } from 'd3-time';
import { utcFormat } from 'd3-time-format';
import { scaleBand, scaleLinear } from 'd3-scale';
import { max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

const width = 500;
const height = 200;
const margin = { top: 20, right: 30, bottom: 30, left: 50 };

const recordKey = 'days';
const d3TimeInterval = utcDay;
const format = utcFormat('%Y-%m-%d');
const formatTick = utcFormat('%-m/%-d');

// The number of days shown
const maxEntries = 14; // Show 2 weeks for dashboard

const yTicks = 4;

export const viz = (
  node,
  { analyticsEvent, timeRange = '14d' },
) => {
  const svg = select(node)
    .attr('width', width)
    .attr('height', height);

  const timeseries = analyticsEvent.intervals[recordKey];

  // Parse time range
  const timeRangeMap = {
    '1d': 1,
    '7d': 7,
    '14d': 14,
    '30d': 30,
    '90d': 90,
  };

  const daysToShow = timeRangeMap[timeRange] || 14;

  const now = new Date();
  const endDate = d3TimeInterval.ceil(now);
  const startDate = d3TimeInterval.offset(now, -daysToShow);
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
    [0, max(data, yValue)],
    [height - bottom, top],
  ).nice(yTicks);

  // Clear previous content
  svg.selectAll('*').remove();

  // Add gradient definition for bars
  const defs = svg.append('defs');
  const gradient = defs
    .append('linearGradient')
    .attr('id', 'bar-gradient')
    .attr('gradientUnits', 'userSpaceOnUse')
    .attr('x1', 0)
    .attr('y1', height)
    .attr('x2', 0)
    .attr('y2', 0);

  gradient
    .append('stop')
    .attr('offset', '0%')
    .attr('stop-color', '#4f46e5')
    .attr('stop-opacity', 0.8);

  gradient
    .append('stop')
    .attr('offset', '100%')
    .attr('stop-color', '#7c3aed')
    .attr('stop-opacity', 1);

  // X-axis
  svg
    .selectAll('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - bottom})`)
    .call(
      axisBottom(xScale)
        .tickFormat((d, i) =>
          i % 2 === 0 ? formatTick(d) : '',
        )
        .tickSize(-(height - top - bottom))
        .tickPadding(10),
    )
    .call((selection) => {
      selection.select('.domain').remove();
    });

  // Y-axis
  svg
    .selectAll('g.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${left},0)`)
    .call(
      axisLeft(yScale)
        .tickSize(-(width - right - left))
        .ticks(yTicks),
    )
    .call((selection) => {
      selection.select('.domain').remove();
    });

  // Bars with animation
  const t = transition().duration(750);
  svg
    .selectAll('rect.bar')
    .data(data)
    .join(
      (enter) =>
        enter
          .append('rect')
          .attr('class', 'bar')
          .attr('x', (d) => xScale(xValue(d)))
          .attr('width', xScale.bandwidth())
          .attr('y', height - bottom)
          .attr('height', 0)
          .attr('fill', 'url(#bar-gradient)')
          .attr('rx', 2)
          .call((selection) =>
            selection
              .transition(t)
              .attr('y', (d) => yScale(yValue(d)))
              .attr(
                'height',
                (d) => height - bottom - yScale(yValue(d)),
              ),
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
    );

  // Add hover effects
  svg
    .selectAll('rect.bar')
    .on('mouseover', function (event, d) {
      select(this)
        .attr('opacity', 0.8)
        .attr('stroke', '#1f2937')
        .attr('stroke-width', 1);

      // Add tooltip
      const tooltip = svg
        .append('g')
        .attr('class', 'tooltip')
        .attr(
          'transform',
          `translate(${xScale(xValue(d)) + xScale.bandwidth() / 2}, ${yScale(yValue(d)) - 10})`,
        );

      const rect = tooltip
        .append('rect')
        .attr('x', -25)
        .attr('y', -20)
        .attr('width', 50)
        .attr('height', 16)
        .attr('fill', '#1f2937')
        .attr('rx', 3);

      tooltip
        .append('text')
        .attr('text-anchor', 'middle')
        .attr('y', -8)
        .attr('fill', 'white')
        .attr('font-size', '12px')
        .text(yValue(d));
    })
    .on('mouseout', function () {
      select(this)
        .attr('opacity', 1)
        .attr('stroke', 'none');

      svg.select('.tooltip').remove();
    });
};
