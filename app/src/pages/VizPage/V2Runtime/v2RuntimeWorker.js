onmessage = async (data) => {
  console.log('worker ', data);
  postMessage('pong');
};
