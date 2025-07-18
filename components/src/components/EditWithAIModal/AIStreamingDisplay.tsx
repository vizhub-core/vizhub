import { useEffect, useRef, useState } from 'react';
import { StreamingMessageContent } from './StreamingMessageContent';

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
  const displayRef = useRef<HTMLDivElement>(null);
  const [isAutoScrolling, setIsAutoScrolling] =
    useState(true);

  // Check if user is at the bottom of the scroll
  const isAtBottom = () => {
    if (!displayRef.current) return true;
    const { scrollTop, scrollHeight, clientHeight } =
      displayRef.current;
    // Allow for small rounding errors with a 5px threshold
    return scrollTop + clientHeight >= scrollHeight - 5;
  };

  // Handle user scroll events
  const handleScroll = () => {
    if (!displayRef.current) return;

    const atBottom = isAtBottom();
    setIsAutoScrolling(atBottom);
  };

  // Auto-scroll to bottom when content updates (only if auto-scrolling is enabled)
  useEffect(() => {
    if (displayRef.current && isAutoScrolling) {
      displayRef.current.scrollTop =
        displayRef.current.scrollHeight;
    }
  }, [content, isAutoScrolling]);

  // Reset auto-scrolling when the display becomes visible
  useEffect(() => {
    if (isVisible) {
      setIsAutoScrolling(true);
    }
  }, [isVisible]);

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
      <div
        ref={displayRef}
        onScroll={handleScroll}
        style={{
          flex: 1,
          overflow: 'auto',
          color: '#00ff00',
          padding: '10px',
          fontSize: '16px',
          fontFamily: 'var(--vzcode-font-family)',
          backgroundColor: 'transparent',
        }}
      >
        <StreamingMessageContent markdown={content} />
      </div>
    </div>
  );
};
