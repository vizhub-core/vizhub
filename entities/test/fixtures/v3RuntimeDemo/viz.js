import { csv } from 'd3';
import { scatterPlot } from './scatterPlot';

const csvFile =
  'https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv';
const parseRow = (d) => {
  d.sepal_length = +d.sepal_length;
  d.sepal_width = +d.sepal_width;
  d.petal_length = +d.petal_length;
  d.petal_width = +d.petal_width;
  return d;
};
const xValue = (d) => d.sepal_width;
const yValue = (d) => d.petal_length;

export const viz = (
  selection,
  { width, height, data, setData },
) => {
  if (data === 'loading') {
    return;
  }
  if (data === undefined) {
    setData('loading');
    csv(csvFile, parseRow).then(setData);
    // csv();
  } else {
    selection.call(scatterPlot, {
      width,
      height,
      data,
      xValue,
      yValue,
    });
  }
};
