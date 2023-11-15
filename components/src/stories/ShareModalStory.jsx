import { useState } from 'react';
import { ShareModal } from '../components/ShareModal';

export const args = {
  linkToCopy:
    'https://vizhub.com/curran/2ee9f785faee42e6b697c527cd196025',
  onClose: () => {
    console.log('onClose');
  },
  onLinkCopy: () => {
    console.log('onLinkCopy');
  },
  onLinkSectionNavigate: () => {
    console.log('onLinkSectionNavigate');
  },
  onEmbedSectionNavigate: () => {
    console.log('onEmbedSectionNavigate');
  },
  onSnippetSectionNavigate: () => {
    console.log('onSnippetSectionNavigate');
  },
};

const Story = () => {
  const [show, setShow] = useState(true);

  // State to manage checkbox value, renamed to anyoneCanEdit
  const [anyoneCanEdit, setAnyoneCanEdit] = useState(false);

  console.log('anyoneCanEdit', anyoneCanEdit);

  return (
    <div className="layout-centered">
      <ShareModal
        show={show}
        onClose={() => {
          setShow(false);
        }}
        anyoneCanEdit={anyoneCanEdit}
        setAnyoneCanEdit={setAnyoneCanEdit}
        {...args}
      />
    </div>
  );
};

export default Story;
