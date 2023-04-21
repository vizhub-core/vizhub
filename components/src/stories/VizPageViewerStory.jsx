import { useState, useEffect } from 'react';
import { VizPageViewer } from '../components/VizPageViewer';

const renderVizRunner = (svgRef) => {
  const [dimensions, setDimensions] = useState(null);

  // Measure dimensions of dynamically resized SVG.
  useEffect(() => {
    const { clientWidth, clientHeight } = svgRef.current;
    setDimensions({ width: clientWidth, height: clientHeight });
    console.log({ width: clientWidth, height: clientHeight });
  }, [svgRef]);

  const srcdoc = 'Hello World';

  if (dimensions === null) {
    return null;
  }

  const { width, height } = dimensions;

  return dimensions ? (
    <iframe
      srcDoc={srcdoc}
      style={{
        width: width + 'px',
        height: height + 'px',
        transform: `scale(${Math.max(height / height, 1)})`,
        transformOrigin: '0 0',
      }}
    />
  ) : null;
};

const args = {
  vizTitle: 'Viz Title',
  vizHeight: 500,
  renderVizRunner,
  renderMarkdownHTML: () => (
    <>
      <p>This is a test of Markdown rendering.</p>
      <p>
        Support for <code>inline code snippets</code> and tables:
      </p>
      <table>
        <thead>
          <tr>
            <th>First Header</th>
            <th>Second Header</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>Content Cell</td>
            <td>Content Cell</td>
          </tr>
          <tr>
            <td>Content Cell</td>
            <td>Content Cell</td>
          </tr>
        </tbody>
      </table>
      <pre>
        <code>
          {`// You can import API functions like this from D3.js.
import { select } from 'd3';
import { message } from './myMessage';
select('#message').text(message);
`}
        </code>
      </pre>
      <p>
        Adding a pipe <code>|</code> in a cell :
      </p>
    </>
  ),
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <VizPageViewer {...args} />
    </div>
  );
};

export default Story;
