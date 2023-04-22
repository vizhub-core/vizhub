export const renderMarkdownHTML = () => (
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
