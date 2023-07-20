import { useEffect, useMemo, useState } from 'react';
// import { renderREADME } from './renderREADME';
// import { Content } from 'entities';
// import { getFileText } from '../../accessors/getFileText';

export const useRenderMarkdownHTML = (initialReadmeHTML) => {
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

  // return () => <div __dangerouslySetInnerHTML={{ __html: readmeHTML }}></div>;
  return () => {
    const [readmeHTML, setReadmeHTML] = useState(initialReadmeHTML);
    const markup = useMemo(() => ({ __html: readmeHTML }), [readmeHTML]);
    return <div dangerouslySetInnerHTML={markup} />;
  };
};
