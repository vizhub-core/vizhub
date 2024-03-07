import { useCallback, useEffect } from 'react';
import { UpgradeCallout } from '../UpgradeCallout';
import { Modal } from '../bootstrap';
import { image } from '../image';

export const AIAssistUpgradeNudgeModal = ({
  show,
  onClose,
  // onConfirm,
}: {
  show: boolean;
  onClose: () => void;
  // onConfirm?: () => void;
}) => {
  const handleEnterKey = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
      }
    },
    [],
  );

  useEffect(() => {
    if (show) {
      window.addEventListener('keydown', handleEnterKey);
    } else {
      window.removeEventListener('keydown', handleEnterKey);
    }
    return () => {
      window.removeEventListener('keydown', handleEnterKey);
    };
  }, [show, handleEnterKey]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>
          Export Code with API Access
        </Modal.Title>
      </Modal.Header>

      <UpgradeCallout
        featureId="api-access-for-vizzes"
        imageSrc={image('export-code', 'mp4')}
        isVideo={true}
        isVertical={true}
        topMargin={false}
        bottomMargin={false}
        isInline={true}
        includeHeader={false}
      >
        <p>
          API Access gives you the ability to download
          public vizzes as <code>.zip</code> files. With
          industry-standard code exports, your projects are
          portable and professional.
        </p>

        <p>
          This feature is only available with VizHub
          Premium. Consider starting a free trial to try it
          out today!
        </p>
        <p>
          <a
            href="https://vizhub.com/forum/t/api-access-for-vizzes/971"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about API Access
          </a>
        </p>
      </UpgradeCallout>
    </Modal>
  );
};
