import { computeSrcDoc } from './computeSrcDoc.ts';
onmessage = async ({ data }) => {
  const srcdoc = await computeSrcDoc(data.content);
  postMessage({ srcdoc });
};
