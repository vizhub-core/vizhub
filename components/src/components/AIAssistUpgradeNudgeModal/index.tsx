import { UpgradeCallout } from '../UpgradeCallout';
import { Modal } from '../bootstrap';
import { image } from '../image';

// This modal pops up when the user attempt to invoke AI Assist,
// but is on the free plan. Its purpose is to
// Phase 1.) Document the fact that AI Assist is a paid feature
//           and direct them to the pricing page to upgrade.
// Phase 2.) Allow the user to use up one of their 10 free generations
//           as a form of "feature teasing."
export const AIAssistUpgradeNudgeModal = ({
  show,
  onClose,
}: {
  show: boolean;
  onClose: () => void;
}) => {
  // const handleEnterKey = useCallback(
  //   (event: KeyboardEvent) => {
  //     if (event.key === 'Enter') {
  //       onConfirm();
  //     }
  //   },
  //   [onConfirm],
  // );

  // useEffect(() => {
  //   if (show) {
  //     window.addEventListener('keydown', handleEnterKey);
  //   } else {
  //     window.removeEventListener('keydown', handleEnterKey);
  //   }
  //   return () => {
  //     window.removeEventListener('keydown', handleEnterKey);
  //   };
  // }, [show, handleEnterKey]);

  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Try AI Assist</Modal.Title>
      </Modal.Header>

      {/* <Modal.Body> */}
      {/* <p>
          This feature lets you leverage generative
          artificial intelligence in your coding practice.
          Here's how it works:
          <ul>
            <li>
              Place your cursor in a location in the editor
              where you want code to be written
            </li>
            <li>
              (optionally) Add a comment before your cursor
              to prompt the AI with instructions
            </li>
            <li>
              Press the AI Assist button to trigger code
              generation!
            </li>
            <li>
              The generated code is streamed directly into
              the editor, as though a remote collaborator is
              typing.
            </li>
          </ul>
          This feature is only available with VizHub
          Premium. Consider starting a free trial to test
          out this feature!
          <a href="/pricing">Start free trial</a>
        </p> */}
      <UpgradeCallout
        imageSrc={image('ai-assist-demo-5', 'mp4')}
        isVideo={true}
        isVertical={true}
        topMargin={false}
        bottomMargin={false}
        isInline={true}
        includeHeader={false}
      >
        {/* Add collaborators to invite others to edit your
            viz with you in real-time. This feature is only
            available on VizHub Premium. */}
        {/* With VizHub Premium, you can add unlimited
          real-time collaborators to your viz. */}
        <p>
          The AI Assist feature lets you leverage generative
          artificial intelligence in your coding practice.
          Here's how it works:
        </p>
        <ul>
          <li>
            Place your cursor in a location in the editor
            where you want code to be written
          </li>
          <li>
            (optionally) Add a comment before your cursor to
            prompt the AI with instructions
          </li>
          <li>
            Press the AI Assist button to trigger code
            generation!
          </li>
          <li>
            The generated code is streamed directly into the
            editor, as though a remote collaborator is
            typing.
          </li>
        </ul>
        <p>
          This feature is only available with VizHub
          Premium. Consider starting a free trial to test
          out this feature!
        </p>
        <p>
          <a
            href="https://vizhub.com/forum/t/ai-assisted-coding/952"
            target="_blank"
            rel="noreferrer"
          >
            Learn more about AI Assist
          </a>
        </p>
      </UpgradeCallout>
      {/* </Modal.Body> */}

      {/* <Modal.Footer>
        <Button
          variant="secondary"
          type="button"
          onClick={onClose}
        >
          Cancel
        </Button>
        <Button variant="primary" onClick={onConfirm}>
          Try AI Assist
        </Button>
      </Modal.Footer> */}
    </Modal>
  );
};
