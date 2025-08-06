import React, { useState, useContext } from 'react';
import { VizPageContext } from '../VizPageContext';

interface AIUndoWidgetProps {
  messageId: string;
  chatId: string;
  canUndo: boolean;
}

export const AIUndoWidget: React.FC<AIUndoWidgetProps> = ({
  messageId,
  chatId,
  canUndo,
}) => {
  const [isUndoing, setIsUndoing] = useState(false);
  const { restoreToRevision, content } =
    useContext(VizPageContext);

  const handleUndo = async () => {
    if (
      !canUndo ||
      isUndoing ||
      !content?.chats?.[chatId]
    ) {
      return;
    }

    setIsUndoing(true);
    try {
      // Find the message in the chat
      const chat = content.chats[chatId];
      const message = chat.messages.find(
        (msg) => msg.id === messageId,
      );

      if (!message || !(message as any).beforeCommitId) {
        console.error(
          'No beforeCommitId found for message:',
          messageId,
        );
        return;
      }

      // Use VizHub's commit-based restoration
      await restoreToRevision(
        (message as any).beforeCommitId,
      );
    } catch (error) {
      console.error('Error undoing AI edit:', error);
      // TODO: Show user-friendly error message
    } finally {
      setIsUndoing(false);
    }
  };

  if (!canUndo) {
    return null;
  }

  return (
    <div className="undo-button-container">
      <button
        className="undo-button"
        onClick={handleUndo}
        disabled={isUndoing}
        title="Undo this AI edit"
      >
        {isUndoing ? 'Undoing...' : 'Undo'}
      </button>
    </div>
  );
};
