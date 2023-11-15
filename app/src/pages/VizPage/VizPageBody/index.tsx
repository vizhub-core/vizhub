import {
  RefObject,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
} from 'react';
import type { ShareDBDoc } from 'vzcode';
import { SplitPaneResizeContext } from 'vzcode';
import {
  defaultVizWidth,
  Content,
  Info,
  User,
  UserId,
  Visibility,
} from 'entities';

// TODO consolidate imports, from 'components'
import { VizPageHead } from 'components/src/components/VizPageHead';
import { ForkModal } from 'components/src/components/ForkModal';
import { SettingsModal } from 'components/src/components/SettingsModal';
import { VizPageViewer } from 'components/src/components/VizPageViewer';
import { ShareModal } from 'components/src/components/ShareModal';

import { AuthenticatedUserContext } from '../../../contexts/AuthenticatedUserContext';
import { SmartHeader } from '../../../smartComponents/SmartHeader';

// TODO consolidate imports, from 'accessors'
import { getUserDisplayName } from '../../../accessors/getUserDisplayName';
import { formatTimestamp } from '../../../accessors/formatTimestamp';
import { getForksPageHref } from '../../../accessors/getForksPageHref';
import { getProfilePageHref } from '../../../accessors/getProfilePageHref';
import { getVizPageHref } from '../../../accessors/getVizPageHref';
import { getLicense } from '../../../accessors/getLicense';
import { getHeight } from '../../../accessors/getHeight';
import { getPackageJsonText } from '../../../accessors/getPackageJsonText';
import { getPackageJson } from '../../../accessors/getPackageJson';

import { useRuntime } from '../useRuntime';
import type { PackageJson } from '../v3Runtime/types';
import { useRenderMarkdownHTML } from './useRenderMarkdownHTML';
import { VizPageEditor } from './VizPageEditor';
import { VizSettings } from '../useVizMutations';

export const VizPageBody = ({
  info,
  content,
  contentShareDBDoc,
  contentShareDBDocPresence,
  ownerUser,
  forkedFromInfo,
  forkedFromOwnerUser,
  showEditor,
  setShowEditor,
  onExportClick,
  showForkModal,
  toggleForkModal,
  onFork,
  initialReadmeHTML,
  showSettingsModal,
  toggleSettingsModal,
  showShareModal,
  toggleShareModal,
  onSettingsSave,
  initialSrcdoc,
  initialSrcdocError,
  canUserEditViz,
  setVizTitle,
  setAnyoneCanEdit,
}: {
  info: Info;
  content: Content;
  contentShareDBDoc: ShareDBDoc<Content>;
  contentShareDBDocPresence: any;
  ownerUser: User;
  forkedFromInfo: Info | null;
  forkedFromOwnerUser: User | null;
  showEditor: boolean;
  setShowEditor: (showEditor: boolean) => void;
  onExportClick: () => void;
  showForkModal: boolean;
  toggleForkModal: () => void;
  onFork: ({
    owner,
    title,
    visibility,
  }: {
    owner: UserId;
    title: string;
    visibility: Visibility;
  }) => void;
  initialReadmeHTML: string;
  showSettingsModal: boolean;
  toggleSettingsModal: () => void;
  showShareModal: boolean;
  toggleShareModal: () => void;
  onSettingsSave: (vizSettings: VizSettings) => void;
  initialSrcdoc: string;
  initialSrcdocError: string | null;
  canUserEditViz: boolean;
  setVizTitle: (title: string) => void;
  setAnyoneCanEdit: (anyoneCanEdit: boolean) => void;
}) => {
  // The currently authenticated user, if any.
  const authenticatedUser: User | null = useContext(
    AuthenticatedUserContext,
  );

  // The list of possible owners of a fork of this viz.
  // Also serves as the list of possible owners of a settings change.
  const possibleOwners: Array<{
    id: UserId;
    label: string;
  }> = useMemo(
    () =>
      authenticatedUser
        ? [
            {
              id: authenticatedUser.id,
              label: getUserDisplayName(authenticatedUser),
            },
            // TODO add orgs that the user is a member of.
          ]
        : [],
    [authenticatedUser],
  );

  // A function that renders markdown to HTML.
  // This supports server-rendering of markdown.
  const renderMarkdownHTML = useRenderMarkdownHTML(
    initialReadmeHTML,
  );

  // The license to display for this viz.
  const packageJsonText: string | null = useMemo(
    () => getPackageJsonText(content),
    [content],
  );
  const packageJson: PackageJson | null = useMemo(
    () => getPackageJson(packageJsonText),
    [packageJsonText],
  );
  const license = useMemo(
    () => getLicense(packageJson),
    [packageJson],
  );

  // The height of the viz, in pixels, falling back to default.
  const vizHeight = useMemo(
    () => getHeight(content.height),
    [content.height],
  );

  // The ref to the viz runner iframe.
  const iframeRef: RefObject<HTMLIFrameElement> =
    useRef<HTMLIFrameElement>(null);

  // TODO clear this out on local build
  // TODO update this from client-side Rollup errors
  // const [srcdocError, setSrcdocError] = useState<
  //   string | null
  // >(initialSrcdocError);
  const srcdocError = initialSrcdocError;

  const setSrcdocError = (srcdocError: string | null) => {
    console.log('TODO surface this error in VZCode');
    console.log('setSrcdocError', srcdocError);
  };

  // Set up the runtime environment.
  useRuntime({ content, iframeRef, setSrcdocError });

  // Render the viz runner iframe.
  const renderVizRunner = useCallback(
    (iframeScale: number) => (
      <iframe
        ref={iframeRef}
        width={defaultVizWidth}
        height={vizHeight}
        srcDoc={initialSrcdoc}
        style={{
          transform: `scale(${iframeScale})`,
        }}
      />
    ),
    [initialSrcdoc, vizHeight],
  );

  // Disable pointer events when split pane is being dragged.
  // Otherwise, they do interfere with dragging the split pane.
  // Inspired by https://github.com/vizhub-core/vizhub/blob/01cadfb78a2611df32f981b1fd8136b70447de9e/vizhub-v2/packages/neoFrontend/src/pages/VizPage/VizRunnerContext/index.js#L15
  const { isDraggingLeft, isDraggingRight } = useContext(
    SplitPaneResizeContext,
  );
  useEffect(() => {
    if (!iframeRef.current) return;
    const isDragging = isDraggingLeft || isDraggingRight;
    iframeRef.current.style['pointer-events'] = isDragging
      ? 'none'
      : 'all';
  }, [isDraggingLeft, isDraggingRight]);

  // The formatted created date.
  const createdDateFormatted = useMemo(
    () => formatTimestamp(info.created),
    [info.created],
  );

  // The formatted updated date.
  const updatedDateFormatted = useMemo(
    () => formatTimestamp(info.updated),
    [info.updated],
  );

  // The display name of the author.
  const authorDisplayName = useMemo(
    () => getUserDisplayName(ownerUser),
    [ownerUser],
  );

  // The href to the forked-from viz.
  const forkedFromVizHref = useMemo(
    () =>
      forkedFromInfo
        ? getVizPageHref(
            forkedFromOwnerUser,
            forkedFromInfo,
          )
        : null,
    [forkedFromInfo, forkedFromOwnerUser],
  );

  // The href to the forks page.
  const forksPageHref = useMemo(
    () => getForksPageHref(ownerUser, info),
    [ownerUser, info],
  );

  // The href to the owner's profile page.
  const ownerUserHref = useMemo(
    () => getProfilePageHref(ownerUser),
    [ownerUser],
  );

  const anyoneCanEdit = info.anyoneCanEdit;

  const linkToCopy = useMemo(
    () => getVizPageHref(ownerUser, info),
    [ownerUser, info],
  );

  const handleLinkCopy = useCallback(() => {
    // Check if the Clipboard API is available
    if (navigator.clipboard && linkToCopy) {
      // Copy the link to the clipboard
      navigator.clipboard
        .writeText(linkToCopy)
        .then(() => {
          // TODO: show a toast or tooltip
          console.log(
            'Link copied to clipboard successfully!',
          );
        })
        .catch((err) => {
          console.error('Failed to copy link: ', err);
        });
    } else {
      console.error(
        'Clipboard API not available or link is empty.',
      );
    }
  }, [linkToCopy]);

  return (
    <div className="vh-page">
      <SmartHeader />
      <VizPageHead
        showEditor={showEditor}
        setShowEditor={setShowEditor}
        onExportClick={onExportClick}
        onShareClick={toggleShareModal}
        showForkButton={!!authenticatedUser}
        onForkClick={toggleForkModal}
        showSettingsButton={canUserEditViz}
        onSettingsClick={toggleSettingsModal}
      />
      <div className="vh-viz-page-body">
        <VizPageEditor
          showEditor={showEditor}
          content={content}
          contentShareDBDoc={contentShareDBDoc}
          contentShareDBDocPresence={
            contentShareDBDocPresence
          }
          srcdocError={srcdocError}
          authenticatedUser={authenticatedUser}
        />

        <div
          className={`right${
            showEditor ? ' editor-open' : ''
          }`}
        >
          <VizPageViewer
            vizTitle={info.title}
            enableEditingTitle={canUserEditViz}
            setVizTitle={setVizTitle}
            vizHeight={vizHeight}
            defaultVizWidth={defaultVizWidth}
            renderVizRunner={renderVizRunner}
            renderMarkdownHTML={renderMarkdownHTML}
            authorDisplayName={authorDisplayName}
            authorAvatarURL={ownerUser.picture}
            createdDateFormatted={createdDateFormatted}
            updatedDateFormatted={updatedDateFormatted}
            forkedFromVizTitle={
              forkedFromInfo ? forkedFromInfo.title : null
            }
            forkedFromVizHref={forkedFromVizHref}
            forksCount={info.forksCount}
            forksPageHref={forksPageHref}
            ownerUserHref={ownerUserHref}
            upvotesCount={info.upvotesCount}
            license={license}
            isPrivate={info.visibility === 'private'}
            isUnlisted={info.visibility === 'unlisted'}
          />
        </div>
      </div>
      {showForkModal && (
        <ForkModal
          initialTitle={'Fork of ' + info.title}
          initialVisibility={info.visibility}
          initialOwner={authenticatedUser?.id}
          possibleOwners={possibleOwners}
          show={showForkModal}
          onClose={toggleForkModal}
          onFork={onFork}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      )}
      {showSettingsModal && (
        <SettingsModal
          initialTitle={info.title}
          initialVisibility={info.visibility}
          initialOwner={info.owner}
          possibleOwners={possibleOwners}
          show={showSettingsModal}
          onClose={toggleSettingsModal}
          onSave={onSettingsSave}
          currentPlan={authenticatedUser?.plan}
          pricingHref={'/pricing'}
        />
      )}
      {showShareModal && (
        <ShareModal
          show={showShareModal}
          onClose={toggleShareModal}
          linkToCopy={linkToCopy}
          onLinkCopy={handleLinkCopy}
          anyoneCanEdit={anyoneCanEdit}
          setAnyoneCanEdit={setAnyoneCanEdit}
        />
      )}
    </div>
  );
};
