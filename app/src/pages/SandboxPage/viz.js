import { select } from 'd3-selection';
import { utcDay } from 'd3-time';
import { utcFormat } from 'd3-time-format';
import { scaleUtc, scaleLinear } from 'd3-scale';
import { extent, max } from 'd3-array';
import { axisBottom, axisLeft } from 'd3-axis';

const width = 600;
const height = 200;
const margin = { top: 10, right: 30, bottom: 20, left: 30 };

const recordKey = 'days';
const d3TimeInterval = utcDay;
const format = utcFormat('%Y-%m-%d');

// The number of days shown
const maxEntries = 7;

// The gap (pixels) between vertical bars.
const gap = 30;

const yTicks = 5;

const round = 8;

export const viz = (node, { analyticsEvent }) => {
  const svg = select(node).attr('width', width).attr('height', height);

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

  const xScale = scaleUtc(extent(data.map(xValue)), [left, width - right]);

  const yScale = scaleLinear([0, max(data, yValue)], [height - bottom, top]);

  const barWidth = (width - right - left) / (data.length - 1) - gap * 2;

  svg
    .selectAll('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - bottom})`)
    .call(axisBottom(xScale).ticks(maxEntries))
    .call((selection) => {
      selection.select('.domain').remove();
      selection.selectAll('.tick line').remove();
    });

  svg
    .selectAll('g.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${left},0)`)
    .call(
      axisLeft(yScale)
        .tickSize(-(width - right - left))
        .ticks(yTicks)
    )
    .call((selection) => {
      selection.select('.domain').remove();
    });

  svg
    .selectAll('rect')
    .data(data)
    .join('rect')
    .attr('x', (d) => xScale(xValue(d)) - barWidth / 2)
    .attr('y', (d) => yScale(yValue(d)))
    .attr('width', barWidth)
    .attr('height', (d) => height - bottom - yScale(yValue(d)))
    .attr('rx', round)
    .attr('ry', round);
};