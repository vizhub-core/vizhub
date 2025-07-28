# Svelte Templates for VizHub

This directory contains Svelte templates and examples for creating interactive visualizations in VizHub.

## Overview

VizHub now supports Svelte 5.37.1 for building reactive, component-based visualizations. Svelte offers several advantages for data visualization:

- **Reactive by default**: Automatic updates when data changes
- **Minimal boilerplate**: Clean, readable syntax
- **Small bundle size**: Compiled output is highly optimized
- **Great performance**: No virtual DOM overhead
- **Excellent developer experience**: Built-in state management and lifecycle methods

## Available Templates

### 1. Basic Chart (`basic-chart/`)

A simple bar chart demonstrating:

- Basic Svelte component structure
- D3.js integration
- Interactive hover effects
- Responsive design

**Features:**

- Interactive bar chart with hover effects
- Clean, modern styling
- D3.js scales and axes
- SVG-based rendering

### 2. Reactive Dashboard (`reactive-dashboard/`)

An advanced analytics dashboard showcasing:

- Reactive state management
- Multiple chart types and metrics
- Dynamic data filtering
- Loading states and animations

**Features:**

- Multiple metrics (Revenue, Users, Orders, Conversion Rate)
- Time range filtering (7d, 30d, 90d)
- Real-time reactive updates
- Gradient fills and smooth animations
- Responsive grid layout
- Loading spinner

## Getting Started

### Basic Usage

1. Create a new visualization in VizHub
2. Set up your main entry point (`index.js`):

```javascript
export { default } from './App.svelte';
```

3. Create your Svelte component (`App.svelte`):

```svelte
<script>
  import * as d3 from 'd3';
  // Your component logic here
</script>

<main>
  <!-- Your HTML template -->
</main>

<style>
  /* Your component styles */
</style>
```

### Key Concepts

#### Reactive Statements

Use `$:` for reactive computations that automatically update when dependencies change:

```svelte
<script>
  let data = [];
  let selectedMetric = 'revenue';

  // This will automatically recalculate when data or selectedMetric changes
  $: filteredData = data.filter(d => d.type === selectedMetric);
  $: total = filteredData.reduce((sum, d) => sum + d.value, 0);
</script>
```

#### Data Binding

Svelte provides powerful two-way data binding:

```svelte
<script>
  let selectedValue = 'option1';
</script>

<select bind:value={selectedValue}>
  <option value="option1">Option 1</option>
  <option value="option2">Option 2</option>
</select>
```

#### Lifecycle Methods

Use lifecycle methods for initialization and cleanup:

```svelte
<script>
  import { onMount, onDestroy } from 'svelte';

  onMount(() => {
    // Initialize your visualization
    console.log('Component mounted');
  });

  onDestroy(() => {
    // Cleanup if needed
    console.log('Component destroyed');
  });
</script>
```

## Integration with D3.js

Svelte works excellently with D3.js. Here are some best practices:

### 1. Use D3 for Data Processing and Scales

```svelte
<script>
  import * as d3 from 'd3';

  let data = [/* your data */];

  $: xScale = d3.scaleBand()
    .domain(data.map(d => d.name))
    .range([0, width])
    .padding(0.1);

  $: yScale = d3.scaleLinear()
    .domain([0, d3.max(data, d => d.value)])
    .range([height, 0]);
</script>
```

### 2. Use Svelte for DOM Manipulation

Instead of D3's selection API, use Svelte's reactive templates:

```svelte
<!-- Instead of d3.selectAll('.bar').data(data).enter().append('rect') -->
{#each data as d}
  <rect
    x={xScale(d.name)}
    y={yScale(d.value)}
    width={xScale.bandwidth()}
    height={height - yScale(d.value)}
    fill="#4f46e5"
  />
{/each}
```

### 3. Combine Both When Needed

For complex visualizations, you can still use D3 for DOM manipulation:

```svelte
<script>
  import { onMount } from 'svelte';
  import * as d3 from 'd3';

  let svg;

  onMount(() => {
    const chart = d3.select(svg)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    // Use D3 for complex path generation, axes, etc.
  });
</script>

<svg bind:this={svg} width={width} height={height}></svg>
```

## Styling

Svelte provides scoped styling by default. Styles in a component only apply to that component:

```svelte
<style>
  .chart-container {
    background: #f9fafb;
    border-radius: 8px;
    padding: 20px;
  }

  /* Use :global() for global styles */
  :global(.d3-axis) {
    font-size: 12px;
  }
</style>
```

## Performance Tips

1. **Use reactive statements wisely**: Only compute what's necessary
2. **Avoid unnecessary re-renders**: Use `{#key}` blocks when needed
3. **Optimize D3 operations**: Cache scales and expensive computations
4. **Use `tick()` for DOM updates**: When you need to wait for DOM updates

```svelte
<script>
  import { tick } from 'svelte';

  async function updateChart() {
    // Update data
    data = newData;

    // Wait for DOM to update
    await tick();

    // Now safe to measure DOM elements
    const bbox = svgElement.getBBox();
  }
</script>
```

## Advanced Features

### Stores for Global State

For complex applications, use Svelte stores:

```javascript
// stores.js
import { writable } from 'svelte/store';

export const selectedMetric = writable('revenue');
export const timeRange = writable('7d');
```

```svelte
<script>
  import { selectedMetric } from './stores.js';

  // Subscribe to store
  $: console.log('Selected metric:', $selectedMetric);
</script>

<select bind:value={$selectedMetric}>
  <!-- options -->
</select>
```

### Animations and Transitions

Svelte has built-in animation support:

```svelte
<script>
  import { fade, slide } from 'svelte/transition';
  import { flip } from 'svelte/animate';
</script>

{#each items as item (item.id)}
  <div animate:flip transition:slide>
    {item.name}
  </div>
{/each}
```

## Resources

- [Svelte Documentation](https://svelte.dev/docs)
- [Svelte Tutorial](https://svelte.dev/tutorial)
- [D3.js Documentation](https://d3js.org/)
- [VizHub Documentation](https://vizhub.com/docs)

## Contributing

To add new Svelte templates:

1. Create a new directory under `templates/svelte/`
2. Include an `index.js` entry point
3. Create your main Svelte component
4. Update this README with template documentation
5. Test the template in VizHub

## Version Information

- **Svelte Version**: 5.37.1
- **VizHub Runtime**: 4.1.0
- **D3.js**: Latest (available in VizHub)

---

Happy visualizing with Svelte! 🎉
