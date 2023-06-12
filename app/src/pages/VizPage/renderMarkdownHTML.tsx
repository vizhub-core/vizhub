import { useEffect, useState } from 'react';
import { renderREADME } from './renderREADME';
import { Content } from 'entities';
import { getFileText } from '../../accessors/getFileText';

export const renderMarkdownHTML = () => {
  // TODO get all this working
  // const [worker, setWorker] = useState(null);

  // // const { content } = useContext(VizContext);
  // const [readmeHTML, setReadmeHTML] = useState(getInitialReadmeHTML(content));

  // // Only instantiate the Worker in the client (not server).
  // useEffect(() => {
  //   setWorker(
  //     new Worker(new URL('./renderMarkdownWorker.js', import.meta.url))
  //   );
  // }, []);

  // // Receive rendered Markdown.
  // useEffect(() => {
  //   if (!worker) return;
  //   worker.onmessage = ({ data }) => {
  //     setReadmeHTML(data);
  //   };
  // }, [worker]);

  // // Send Markdown for rendering.
  // const timeoutRef = useRef();
  // useEffect(() => {
  //   clearTimeout(timeoutRef.current);
  //   timeoutRef.current = setTimeout(() => {
  //     worker.postMessage(getFileText(vizContent, 'README.md'));
  //   }, readmeRenderDebounce);
  // }, [vizContent]);

  return (
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
  );
};
