import { MessageContent } from './MessageContent';
import { useVisibleContent } from './hooks/useVisibleContent';
import { ReactNode } from 'react';

export const StreamingMessageContent = ({
  markdown,
  richContent,
}: {
  markdown: string;
  richContent?: ReactNode;
}) => {
  const { visibleContent, isVisibleContentFinished } =
    useVisibleContent(markdown);
  return (
    <MessageContent markdown={visibleContent}>
      {isVisibleContentFinished && richContent}
    </MessageContent>
  );
};
