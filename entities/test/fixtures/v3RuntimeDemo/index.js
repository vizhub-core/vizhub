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
