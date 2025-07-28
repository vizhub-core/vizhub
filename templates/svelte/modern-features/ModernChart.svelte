<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  // Modern Svelte 5 reactive state
  let chartData = $state([]);
  let selectedCategory = $state('all');
  let animationSpeed = $state(1000);
  let isPlaying = $state(false);
  let currentFrame = $state(0);
  
  // Chart dimensions
  const width = 700;
  const height = 400;
  const margin = { top: 20, right: 20, bottom: 40, left: 40 };
  
  // SVG reference
  let svg = $state();
  
  // Sample data with categories and time series
  const rawData = [
    { category: 'Technology', values: [30, 45, 60, 75, 90, 85, 95] },
    { category: 'Healthcare', values: [20, 35, 50, 65, 70, 80, 85] },
    { category: 'Finance', values: [40, 55, 45, 70, 80, 75, 90] },
    { category: 'Education', values: [15, 25, 40, 55, 60, 70, 75] },
    { category: 'Retail', values: [25, 40, 35, 50, 65, 70, 80] }
  ];
  
  // Computed properties using modern Svelte 5 syntax
  const filteredData = $derived(() => {
    if (selectedCategory === 'all') {
      return rawData;
    }
    return rawData.filter(d => d.category === selectedCategory);
  });
  
  const currentData = $derived(() => {
    return filteredData.map(d => ({
      category: d.category,
      value: d.values[currentFrame] || 0
    }));
  });
  
  const maxValue = $derived(() => {
    return d3.max(rawData.flatMap(d => d.values)) || 100;
  });
  
  // Animation controls
  let animationInterval;
  
  function startAnimation() {
    if (isPlaying) return;
    isPlaying = true;
    
    animationInterval = setInterval(() => {
      currentFrame = (currentFrame + 1) % rawData[0].values.length;
      if (currentFrame === 0) {
        // Loop completed
        setTimeout(() => {
          isPlaying = false;
        }, animationSpeed / 2);
      }
    }, animationSpeed / rawData[0].values.length);
  }
  
  function stopAnimation() {
    isPlaying = false;
    if (animationInterval) {
      clearInterval(animationInterval);
    }
  }
  
  function resetAnimation() {
    stopAnimation();
    currentFrame = 0;
  }
  
  // Chart rendering with D3
  function updateChart() {
    if (!svg || !currentData.length) return;
    
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;
    
    // Clear previous content
    d3.select(svg).selectAll('*').remove();
    
    // Create scales
    const xScale = d3.scaleBand()
      .domain(currentData.map(d => d.category))
      .range([0, chartWidth])
      .padding(0.2);
    
    const yScale = d3.scaleLinear()
      .domain([0, maxValue])
      .range([chartHeight, 0]);
    
    const colorScale = d3.scaleOrdinal()
      .domain(rawData.map(d => d.category))
      .range(['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57']);
    
    // Create chart group
    const chart = d3.select(svg)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);
    
    // Add bars with animation
    const bars = chart.selectAll('.bar')
      .data(currentData)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', d => xScale(d.category))
      .attr('width', xScale.bandwidth())
      .attr('y', chartHeight)
      .attr('height', 0)
      .attr('fill', d => colorScale(d.category))
      .attr('rx', 4)
      .attr('ry', 4);
    
    // Animate bars
    bars.transition()
      .duration(500)
      .ease(d3.easeElastic)
      .attr('y', d => yScale(d.value))
      .attr('height', d => chartHeight - yScale(d.value));
    
    // Add value labels
    const labels = chart.selectAll('.label')
      .data(currentData)
      .enter()
      .append('text')
      .attr('class', 'label')
      .attr('x', d => xScale(d.category) + xScale.bandwidth() / 2)
      .attr('y', d => yScale(d.value) - 5)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', 'bold')
      .style('fill', '#333')
      .style('opacity', 0)
      .text(d => d.value);
    
    // Animate labels
    labels.transition()
      .delay(300)
      .duration(200)
      .style('opacity', 1);
    
    // Add axes
    chart.append('g')
      .attr('transform', `translate(0,${chartHeight})`)
      .call(d3.axisBottom(xScale))
      .selectAll('text')
      .style('font-size', '11px');
    
    chart.append('g')
      .call(d3.axisLeft(yScale).ticks(5))
      .selectAll('text')
      .style('font-size', '11px');
    
    // Add interactive hover effects
    bars.on('mouseover', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 0.8)
        .attr('stroke', '#333')
        .attr('stroke-width', 2);
    })
    .on('mouseout', function(event, d) {
      d3.select(this)
        .transition()
        .duration(200)
        .attr('opacity', 1)
        .attr('stroke', 'none');
    });
  }
  
  // Effect to update chart when data changes
  $effect(() => {
    updateChart();
  });
  
  // Cleanup on destroy
  onMount(() => {
    return () => {
      stopAnimation();
    };
  });
</script>

<main>
  <header>
    <h1>🚀 Modern Svelte 5 Features</h1>
    <p>Showcasing reactive state, derived values, and effects with animated visualizations</p>
  </header>
  
  <div class="controls-panel">
    <div class="control-section">
      <h3>Data Filter</h3>
      <select bind:value={selectedCategory}>
        <option value="all">All Categories</option>
        {#each rawData as item}
          <option value={item.category}>{item.category}</option>
        {/each}
      </select>
    </div>
    
    <div class="control-section">
      <h3>Animation</h3>
      <div class="animation-controls">
        <button onclick={startAnimation} disabled={isPlaying}>
          ▶️ Play
        </button>
        <button onclick={stopAnimation} disabled={!isPlaying}>
          ⏸️ Pause
        </button>
        <button onclick={resetAnimation}>
          ⏹️ Reset
        </button>
      </div>
      
      <div class="speed-control">
        <label for="speed">Speed: {animationSpeed}ms</label>
        <input 
          id="speed"
          type="range" 
          min="500" 
          max="3000" 
          step="100"
          bind:value={animationSpeed}
        />
      </div>
    </div>
    
    <div class="control-section">
      <h3>Frame Control</h3>
      <div class="frame-control">
        <label for="frame">Frame: {currentFrame + 1} / {rawData[0].values.length}</label>
        <input 
          id="frame"
          type="range" 
          min="0" 
          max={rawData[0].values.length - 1}
          bind:value={currentFrame}
          disabled={isPlaying}
        />
      </div>
    </div>
  </div>
  
  <div class="chart-container">
    <h2>
      {selectedCategory === 'all' ? 'All Categories' : selectedCategory} 
      - Time Frame {currentFrame + 1}
    </h2>
    <svg bind:this={svg} {width} {height}></svg>
  </div>
  
  <div class="info-panel">
    <h3>Current Data Summary</h3>
    <div class="stats-grid">
      <div class="stat">
        <span class="label">Categories:</span>
        <span class="value">{filteredData.length}</span>
      </div>
      <div class="stat">
        <span class="label">Total Value:</span>
        <span class="value">{currentData.reduce((sum, d) => sum + d.value, 0)}</span>
      </div>
      <div class="stat">
        <span class="label">Average:</span>
        <span class="value">
          {Math.round(currentData.reduce((sum, d) => sum + d.value, 0) / currentData.length)}
        </span>
      </div>
      <div class="stat">
        <span class="label">Animation:</span>
        <span class="value status" class:playing={isPlaying}>
          {isPlaying ? 'Playing' : 'Stopped'}
        </span>
      </div>
    </div>
  </div>
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
  
  .controls-panel {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 20px;
    margin-bottom: 30px;
  }
  
  .control-section {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .control-section h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  .control-section select {
    width: 100%;
    padding: 8px 12px;
    border: 1px solid #ddd;
    border-radius: 6px;
    font-size: 0.9rem;
  }
  
  .animation-controls {
    display: flex;
    gap: 10px;
    margin-bottom: 15px;
  }
  
  .animation-controls button {
    flex: 1;
    padding: 8px 12px;
    border: none;
    border-radius: 6px;
    background: #4f46e5;
    color: white;
    font-size: 0.8rem;
    cursor: pointer;
    transition: background 0.2s;
  }
  
  .animation-controls button:hover:not(:disabled) {
    background: #3730a3;
  }
  
  .animation-controls button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }
  
  .speed-control, .frame-control {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  
  .speed-control label, .frame-control label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .speed-control input, .frame-control input {
    width: 100%;
  }
  
  .chart-container {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    text-align: center;
    margin-bottom: 30px;
  }
  
  .chart-container h2 {
    margin: 0 0 20px 0;
    color: #333;
  }
  
  .info-panel {
    background: white;
    padding: 20px;
    border-radius: 12px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }
  
  .info-panel h3 {
    margin: 0 0 15px 0;
    color: #333;
    font-size: 1.1rem;
  }
  
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 15px;
  }
  
  .stat {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    background: #f8fafc;
    border-radius: 6px;
  }
  
  .stat .label {
    font-size: 0.9rem;
    color: #666;
  }
  
  .stat .value {
    font-weight: bold;
    color: #333;
  }
  
  .stat .value.status {
    padding: 4px 8px;
    border-radius: 4px;
    font-size: 0.8rem;
    background: #ef4444;
    color: white;
  }
  
  .stat .value.status.playing {
    background: #10b981;
  }
  
  :global(.bar) {
    cursor: pointer;
  }
</style>
