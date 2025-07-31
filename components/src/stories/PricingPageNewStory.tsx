export const args = {
  title: 'Pricing Page New',
};

const Story = () => {
  return (
    <div className="layout-fullscreen">
      <iframe
        src="/pricing-page-new.html"
        style={{
          width: '100%',
          height: '100vh',
          border: 'none',
        }}
        title="Pricing Page New"
      />
    </div>
  );
};

export default Story;
