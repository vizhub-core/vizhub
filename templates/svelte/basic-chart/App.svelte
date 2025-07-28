<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svg;
  let data = [
    { name: 'A', value: 30 },
    { name: 'B', value: 80 },
    { name: 'C', value: 45 },
    { name: 'D', value: 60 },
    { name: 'E', value: 20 },
    { name: 'F', value: 90 },
    { name: 'G', value: 55 }
  ];

  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 40, left: 40 };

  onMount(() => {
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const xScale = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, chartWidth])
      .padding(0.1);

    const yScale = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value)])
      .range([chartHeight, 0]);

    const svgElement = d3.select(svg);
    
    const chart = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add bars
    chart.selectAll('.bar')
      .data(data)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.name))
      .attr('width', xScale.bandwidth())
      .attr('y', d => yScale(d.value))
      .attr('height', d => chartHeight - yScale(d.value))
      .attr('fill', '#4f46e5')
      .on('mouseover', function(event, d) {
        d3.select(this).attr('fill', '#6366f1');
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('fill', '#4f46e5');
      });

    // Add x-axis
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale));

    // Add y-axis
    chart.append('g')
      .call(d3.axisLeft(yScale));

    // Add title
    svgElement.append('text')
      .attr('x', width / 2)
      .attr('y', margin.top)
      .attr('text-anchor', 'middle')
      .style('font-size', '16px')
      .style('font-weight', 'bold')
      .text('Interactive Bar Chart with Svelte + D3');
  });
</script>

<main>
  <h1>Svelte + D3 Visualization</h1>
  <p>This is a basic bar chart built with Svelte and D3.js. Hover over the bars to see the interaction!</p>
  
  <div class="chart-container">
    <svg bind:this={svg} {width} {height}></svg>
  </div>
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 900px;
    margin: 0 auto;
    padding: 20px;
  }

  h1 {
    color: #333;
    text-align: center;
    margin-bottom: 10px;
  }

  p {
    text-align: center;
    color: #666;
    margin-bottom: 30px;
  }

  .chart-container {
    display: flex;
    justify-content: center;
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  :global(.bar) {
    cursor: pointer;
    transition: fill 0.2s ease;
  }
</style>
