export const renderVizRunner = (svgRef) => {
  // const [dimensions, setDimensions] = useState(null);

  // Measure dimensions of dynamically resized SVG.
  // useEffect(() => {
  //   const { clientWidth, clientHeight } = svgRef.current;
  //   setDimensions({ width: clientWidth, height: clientHeight });
  //   console.log({ width: clientWidth, height: clientHeight });
  // }, [svgRef]);

  const srcdoc = 'Hello World';

  // TODO figure out a way to render the complete runner iframe
  // _before_ JS loads in the client - send it all from the server.
  // How to scale the iframe? Put some critical JS in the initial payload
  // that measures dimensions and sets the iframe scale!
  // if (dimensions === null) {
  //   return null;
  // }

  // const { width, height } = dimensions;

  return (
    <iframe
      srcDoc={srcdoc}
      style={{
        width: '100%',
        height: '100%',
        // transform: `scale(${Math.max(height / height, 1)})`,
        // transformOrigin: '0 0',
      }}
    />
  );
};
