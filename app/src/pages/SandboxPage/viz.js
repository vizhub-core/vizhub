import { select } from 'd3-selection';
import { utcDay } from 'd3-time';
import { utcFormat } from 'd3-time-format';
import { scaleUtc, scaleLinear } from 'd3-scale';
import { area, curveStep } from 'd3-shape';
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

export const viz = (node, { analyticsEvent }) => {
  const svg = select(node).attr('width', width).attr('height', height);

  const timeseries = analyticsEvent.intervals[recordKey];

  const now = new Date();
  const endDate = d3TimeInterval.ceil(now);
  const startDate = d3TimeInterval.offset(now, -maxEntries);
  const dates = d3TimeInterval.range(startDate, endDate);

  const data = dates.map((date) => ({
    date,
    value: timeseries[format(date)] || 0,
  }));

  const { top, right, bottom, left } = margin;

  const xScale = scaleUtc(extent(dates), [left, width - right]);

  const yScale = scaleLinear(
    [0, max(data, (d) => d.value)],
    [height - bottom, top]
  );

  const areaGenerator = area()
    .x((d) => xScale(d.date))
    .y1((d) => yScale(d.value))
    .y0(yScale(0))
    .curve(curveStep);

  svg
    .selectAll('path')
    .data([null])
    .join('path')
    .attr('d', areaGenerator(data));

  svg
    .selectAll('g.x-axis')
    .data([null])
    .join('g')
    .attr('class', 'x-axis')
    .attr('transform', `translate(0,${height - bottom})`)
    .call(axisBottom(xScale).ticks(maxEntries));

  svg
    .selectAll('g.y-axis')
    .data([null])
    .join('g')
    .attr('class', 'y-axis')
    .attr('transform', `translate(${left},0)`)
    .call(axisLeft(yScale));

  console.log(data);
};
