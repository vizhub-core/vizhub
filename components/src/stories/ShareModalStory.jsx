import { useState } from 'react';
import { userJane, userJoe } from 'entities/test/fixtures';
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
  handleCollaboratorSearch: async (query) => {
    // // TODO implement API
    // // fetch(
    // //   `${SEARCH_URI}?q=${query}+in:login&page=1&per_page=50`,
    // // )
    // //   .then((resp) => resp.json())
    // //   .then(({ items }: Response) => {
    // //     setOptions(items);
    // //     setIsLoading(false);
    // //   });
    // await new Promise((resolve) =>
    //   setTimeout(resolve, 100),
    // );
    // setOptions([userJoe, userJane]);
    console.log('handleCollaboratorSearch: ' + query);
    return [userJoe, userJane];
  },
  showAnyoneCanEdit: true,
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
