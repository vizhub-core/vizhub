import { useEffect, useRef } from 'react';

interface AIStreamingDisplayProps {
  content: string;
  isVisible: boolean;
  status?: string;
}

export const AIStreamingDisplay = ({
  content,
  isVisible,
  status,
}: AIStreamingDisplayProps) => {
  const displayRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop =
        displayRef.current.scrollHeight;
    }
  }, [content]);

  if (!isVisible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        bottom: '10px',
        right: '50%',
        zIndex: 9999,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        borderRadius: '5px',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      {status && (
        <div
          style={{
            padding: '10px',
            borderBottom: '1px solid rgba(0, 255, 0, 0.3)',
            color: '#00ff00',
            fontSize: '14px',
            fontFamily: 'var(--vzcode-font-family)',
            fontWeight: 'bold',
          }}
        >
          {status}
        </div>
      )}
      <pre
        ref={displayRef}
        style={{
          flex: 1,
          overflow: 'auto',
          color: '#00ff00',
          padding: '10px',
          margin: 0,
          fontSize: '16px',
          fontFamily: 'var(--vzcode-font-family)',
          whiteSpace: 'pre-wrap',
          backgroundColor: 'transparent',
        }}
      >
        {content}
      </pre>
    </div>
  );
};
