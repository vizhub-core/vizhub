// import { computeSrcDoc } from './computeSrcDoc';

onmessage = async ({ data }) => {
  const { content } = data;
  // postMessage(await computeSrcDoc(data.content));
  postMessage({
    srcdoc: 'message from worker',
  });
};
