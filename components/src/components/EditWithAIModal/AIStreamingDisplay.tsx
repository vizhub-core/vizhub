import { useEffect, useRef } from 'react';

interface AIStreamingDisplayProps {
  content: string;
  isVisible: boolean;
}

export const AIStreamingDisplay = ({ 
  content, 
  isVisible 
}: AIStreamingDisplayProps) => {
  const displayRef = useRef<HTMLPreElement>(null);

  // Auto-scroll to bottom when content updates
  useEffect(() => {
    if (displayRef.current) {
      displayRef.current.scrollTop = displayRef.current.scrollHeight;
    }
  }, [content]);

  if (!isVisible) return null;

  return (
    <pre
      ref={displayRef}
      style={{
        position: 'fixed',
        top: '10px',
        left: '10px',
        bottom: '10px',
        overflow: 'auto',
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        color: '#00ff00',
        padding: '10px',
        borderRadius: '5px',
        zIndex: 9999,
        fontSize: '16px',
        fontFamily: 'var(--vzcode-font-family)',
        whiteSpace: 'pre-wrap',
        boxShadow: '0 0 10px rgba(0, 0, 0, 0.5)',
      }}
    >
      {content}
    </pre>
  );
};
