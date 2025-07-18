export const PrivateVizzesUpgradeCallout = ({
  reachedLimit,
}: {
  reachedLimit: boolean;
}) => (
  <>
    {reachedLimit && (
      <>
        You have reached the limit of 3 non-public vizzes
        allowed on the free plan.{' '}
      </>
    )}
    With VizHub Premium, you can make an unlimited number of
    your vizzes <strong>private</strong> or{' '}
    <strong>unlisted</strong>. These features are perfect
    for client work, personal projects, and other situations
    where you want to control who can see your vizzes.
    {/* <p>
      <a
        href="https://vizhub.com/forum/t/making-vizzes-private/977"
        target="_blank"
        rel="noreferrer"
      >
        Learn more about private vizzes
      </a>
    </p> */}
  </>
);
