import { ReactNode } from "react";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";

export const MessageContent = ({
  markdown,
  children,
}: {
  markdown?: string;
  children?: ReactNode;
}) => {
  if (!markdown) return null;

  return (
    <div style={{ color: 'inherit' }}>
      <Markdown remarkPlugins={[remarkGfm]}>
        {markdown}
      </Markdown>
      {children}
    </div>
  );
};