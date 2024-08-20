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
  return (
    <Modal show={show} onHide={onClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Upgrade to Premium</Modal.Title>
      </Modal.Header>

      <UpgradeCallout
        featureId="ai-assisted-coding"
        imageSrc={image('ai-assist-demo-5', 'mp4')}
        isVideo={true}
        isVertical={true}
        topMargin={false}
        bottomMargin={false}
        isInline={true}
        includeHeader={false}
      >
        <p>
          Enhance your coding with AI. Speed up your
          workflow, reduce errors, and innovate faster,
          freeing up time for research, analysis, and
          creativity. How it works:
        </p>
        <ul>
          <li>
            Place your cursor in a location in the editor
            where you want code to be written
          </li>
          <li>
            (optionally) Add a comment before your cursor to
            prompt the AI with instructions or type a
            partial solution
          </li>
          <li>Press the AI Assist button</li>
          <li>
            Watch the generated code streamed directly into
            your editor
          </li>
        </ul>
        <p>
          This feature is only available with VizHub
          Premium.
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
    </Modal>
  );
};
