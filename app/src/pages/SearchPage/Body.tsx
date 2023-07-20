import { SmartHeader } from '../../smartComponents/SmartHeader';

export const Body = ({ query }) => {
  return (
    <div className="vh-page overflow-auto">
      <SmartHeader />
      <pre>Query: `{query}`</pre>
    </div>
  );
};
