import { useState, useEffect } from 'react';

export const useVisibleContent = (fullContent: string) => {
  const [visibleContent, setVisibleContent] = useState('');
  const [
    isVisibleContentFinished,
    setIsVisibleContentFinished,
  ] = useState(false);

  useEffect(() => {
    if (fullContent.length === 0) {
      setVisibleContent('');
      setIsVisibleContentFinished(false);
      return;
    }

    // If the content is already complete, show it all
    if (fullContent === visibleContent) {
      setIsVisibleContentFinished(true);
      return;
    }

    // Simple streaming effect - show content immediately for now
    // In a real implementation, this could animate the content appearing
    setVisibleContent(fullContent);
    setIsVisibleContentFinished(true);
  }, [fullContent, visibleContent]);

  return { visibleContent, isVisibleContentFinished };
};
