export const files = {
  'package.json': `
        {
          "dependencies": {
            "d3": "7.6.1"
          },
          "vizhub": {
            "libraries": {
              "d3": {
                "global": "d3",
                "path": "/dist/d3.min.js"
              }
            }
          }
        }
      `,
  'index.js': `
        import { select } from 'd3';
        import { viz } from './viz';

        export const main = (container, { state, setState }) => {
          const { data, width, height } = state;

          const setSize = (width, height) => {
            setState((state) => ({ ...state, width, height }));
          };

          const setData = (data) => {
            setState((state) => ({ ...state, data }));
          };

          const handleResize = () => {
            setSize(window.innerWidth, window.innerHeight);
          };
          if (!width) {
            handleResize();
            return;
          }
          window.onresize = handleResize;

          const svg = select(container)
            .selectAll('svg')
            .data([null])
            .join('svg')
            .attr('width', width)
            .attr('height', height)
            .style('position', 'fixed')
            .call(viz, { width, height, data, setData });
        };
      `,
  'viz.js': `
        import { csv } from 'd3';
        import { scatterPlot } from './scatterPlot';
        
        const csvFile = 'https://gist.githubusercontent.com/curran/a08a1080b88344b0c8a7/raw/0e7a9b0a5d22642a06d3d5b9bcbad9890c8ee534/iris.csv';
        const parseRow = (d) => {
          d.sepal_length = +d.sepal_length;
          d.sepal_width = +d.sepal_width;
          d.petal_length = +d.petal_length;
          d.petal_width = +d.petal_width;
          return d;
        };
        const xValue = (d) => d.sepal_width;
        const yValue = (d) => d.petal_length;
        
        export const viz = (selection, { width, height, data, setData }) => {
          if (data === "loading") {
            return;
          }
          if (data === undefined) {
            setData("loading");
            csv(csvFile, parseRow).then(setData);
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
      `,
  'scatterPlot.js': `import { scaleLinear, extent } from 'd3';

export const scatterPlot = (
  selection,
  {
    data,
    width,
    height,
    xValue,
    yValue,
    circleRadius = 10,
    margin = { top: 20, right: 20, bottom: 20, left: 20 },
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
    .attr('opacity', 0.2);
};`,
};
