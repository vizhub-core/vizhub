<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  // Reactive state
  let selectedMetric = 'revenue';
  let timeRange = '7d';
  let data = [];
  let filteredData = [];
  let svg;
  let isLoading = true;

  // Metrics configuration
  const metrics = {
    revenue: { label: 'Revenue', color: '#10b981', format: d => `$${d3.format(',.0f')(d)}` },
    users: { label: 'Active Users', color: '#3b82f6', format: d => d3.format(',.0f')(d) },
    orders: { label: 'Orders', color: '#f59e0b', format: d => d3.format(',.0f')(d) },
    conversion: { label: 'Conversion Rate', color: '#ef4444', format: d => `${d3.format('.1%')(d)}` }
  };

  const timeRanges = {
    '7d': { label: '7 Days', days: 7 },
    '30d': { label: '30 Days', days: 30 },
    '90d': { label: '90 Days', days: 90 }
  };

  // Generate sample data
  function generateData() {
    const days = timeRanges[timeRange].days;
    const now = new Date();
    return Array.from({ length: days }, (_, i) => {
      const date = new Date(now);
      date.setDate(date.getDate() - (days - 1 - i));
      
      return {
        date,
        revenue: Math.random() * 10000 + 5000,
        users: Math.random() * 1000 + 500,
        orders: Math.random() * 100 + 50,
        conversion: Math.random() * 0.1 + 0.02
      };
    });
  }

  // Reactive statements
  $: {
    data = generateData();
    filteredData = data;
    if (svg) updateChart();
  }

  $: currentMetric = metrics[selectedMetric];
  $: totalValue = filteredData.reduce((sum, d) => sum + d[selectedMetric], 0);
  $: avgValue = totalValue / filteredData.length;
  $: trend = filteredData.length > 1 ? 
    ((filteredData[filteredData.length - 1][selectedMetric] - filteredData[0][selectedMetric]) / filteredData[0][selectedMetric]) * 100 : 0;

  const width = 800;
  const height = 300;
  const margin = { top: 20, right: 30, bottom: 40, left: 60 };

  function updateChart() {
    if (!svg || !filteredData.length) return;

    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    // Clear previous chart
    d3.select(svg).selectAll('*').remove();

    const xScale = d3.scaleTime()
      .domain(d3.extent(filteredData, d => d.date))
      .range([0, chartWidth]);

    const yScale = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[selectedMetric]))
      .nice()
      .range([chartHeight, 0]);

    const line = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d[selectedMetric]))
      .curve(d3.curveMonotoneX);

    const svgElement = d3.select(svg);
    const chart = svgElement
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Add gradient
    const gradient = svgElement.append('defs')
      .append('linearGradient')
      .attr('id', 'gradient')
      .attr('gradientUnits', 'userSpaceOnUse')
      .attr('x1', 0).attr('y1', 0)
      .attr('x2', 0).attr('y2', chartHeight);

    gradient.append('stop')
      .attr('offset', '0%')
      .attr('stop-color', currentMetric.color)
      .attr('stop-opacity', 0.3);

    gradient.append('stop')
      .attr('offset', '100%')
      .attr('stop-color', currentMetric.color)
      .attr('stop-opacity', 0);

    // Add area
    const area = d3.area()
      .x(d => xScale(d.date))
      .y0(chartHeight)
      .y1(d => yScale(d[selectedMetric]))
      .curve(d3.curveMonotoneX);

    chart.append('path')
      .datum(filteredData)
      .attr('fill', 'url(#gradient)')
      .attr('d', area);

    // Add line
    chart.append('path')
      .datum(filteredData)
      .attr('fill', 'none')
      .attr('stroke', currentMetric.color)
      .attr('stroke-width', 2)
      .attr('d', line);

    // Add dots
    chart.selectAll('.dot')
      .data(filteredData)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d[selectedMetric]))
      .attr('r', 4)
      .attr('fill', currentMetric.color)
      .on('mouseover', function(event, d) {
        // Tooltip logic could go here
        d3.select(this).attr('r', 6);
      })
      .on('mouseout', function(event, d) {
        d3.select(this).attr('r', 4);
      });

    // Add axes
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.timeFormat('%m/%d')));

    chart.append('g')
      .call(d3.axisLeft(yScale).tickFormat(currentMetric.format));
  }

  onMount(() => {
    setTimeout(() => {
      isLoading = false;
      updateChart();
    }, 500);
  });
</script>

<main>
  <header>
    <h1>📊 Reactive Analytics Dashboard</h1>
    <p>Built with Svelte + D3.js - Real-time reactive visualizations</p>
  </header>

  {#if isLoading}
    <div class="loading">
      <div class="spinner"></div>
      <p>Loading dashboard...</p>
    </div>
  {:else}
    <div class="controls">
      <div class="control-group">
        <label for="metric">Metric:</label>
        <select id="metric" bind:value={selectedMetric}>
          {#each Object.entries(metrics) as [key, metric]}
            <option value={key}>{metric.label}</option>
          {/each}
        </select>
      </div>

      <div class="control-group">
        <label for="timeRange">Time Range:</label>
        <select id="timeRange" bind:value={timeRange}>
          {#each Object.entries(timeRanges) as [key, range]}
            <option value={key}>{range.label}</option>
          {/each}
        </select>
      </div>
    </div>

    <div class="stats-grid">
      <div class="stat-card">
        <h3>Total {currentMetric.label}</h3>
        <div class="stat-value" style="color: {currentMetric.color}">
          {currentMetric.format(totalValue)}
        </div>
      </div>

      <div class="stat-card">
        <h3>Average {currentMetric.label}</h3>
        <div class="stat-value" style="color: {currentMetric.color}">
          {currentMetric.format(avgValue)}
        </div>
      </div>

      <div class="stat-card">
        <h3>Trend</h3>
        <div class="stat-value" class:positive={trend > 0} class:negative={trend < 0}>
          {trend > 0 ? '↗' : trend < 0 ? '↘' : '→'} {Math.abs(trend).toFixed(1)}%
        </div>
      </div>
    </div>

    <div class="chart-container">
      <h2>{currentMetric.label} Over Time</h2>
      <svg bind:this={svg} {width} {height}></svg>
    </div>
  {/if}
</main>

<style>
  main {
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    min-height: 100vh;
  }

  header {
    text-align: center;
    margin-bottom: 30px;
    color: white;
  }

  header h1 {
    margin: 0 0 10px 0;
    font-size: 2.5rem;
  }

  header p {
    margin: 0;
    opacity: 0.9;
    font-size: 1.1rem;
  }

  .loading {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 300px;
    color: white;
  }

  .spinner {
    width: 40px;
    height: 40px;
    border: 4px solid rgba(255, 255, 255, 0.3);
    border-top: 4px solid white;
    border-radius: 50%;
    animation: spin 1s linear infinite;
    margin-bottom: 20px;
  }

  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }

  .controls {
    display: flex;
    gap: 20px;
    margin-bottom: 30px;
    justify-content: center;
    flex-wrap: wrap;
  }

  .control-group {
    display: flex;
    flex-direction: column;
    gap: 5px;
  }

  .control-group label {
    color: white;
    font-weight: 500;
    font-size: 0.9rem;
  }

  .control-group select {
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: white;
    font-size: 0.9rem;
    cursor: pointer;
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }

  .stat-card {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .stat-card h3 {
    margin: 0 0 10px 0;
    color: #666;
    font-size: 0.9rem;
    text-transform: uppercase;
    letter-spacing: 0.5px;
  }

  .stat-value {
    font-size: 1.8rem;
    font-weight: bold;
    margin: 0;
  }

  .stat-value.positive {
    color: #10b981;
  }

  .stat-value.negative {
    color: #ef4444;
  }

  .chart-container {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
  }

  .chart-container h2 {
    margin: 0 0 20px 0;
    color: #333;
  }

  :global(.dot) {
    cursor: pointer;
    transition: r 0.2s ease;
  }
</style>
