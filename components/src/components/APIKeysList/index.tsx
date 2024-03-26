import { utcFormat } from 'd3-time-format';
import {
  APIKey,
  Timestamp,
  timestampToDate,
} from 'entities';
import { useCallback } from 'react';
import { Button, Table } from 'react-bootstrap';

// export const APIKeysList = ({
//   apiKeys,
// }: {
//   apiKeys: Array<APIKey>;
// }) => {
//   return apiKeys.map((apiKey: APIKey) => {
//     return (
//       <div key={apiKey.id}>
//         <div>{apiKey.name}</div>
//         <Button>Revoke</Button>
//       </div>
//     );
//   });
// };

const format = utcFormat('%b %d, %Y');
export const formatTimestamp = (timestamp: Timestamp) => {
  return format(timestampToDate(timestamp));
};

const APIKeyRow = ({ apiKey, setApiKeyBeingDeleted }) => {
  const handleDeleteClick = useCallback(() => {
    setApiKeyBeingDeleted(apiKey);
  }, [apiKey, setApiKeyBeingDeleted]);

  return (
    <tr key={apiKey.id}>
      <td>{apiKey.name}</td>
      {/* <td>{`sk...${apiKey.id.substring(0, 4)}`}</td>{' '} */}
      {/* <td>
  <Button variant="success" size="sm">
    Enable
  </Button>
</td> */}
      <td>{formatTimestamp(apiKey.created)}</td>
      <td>
        {apiKey.lastUsed
          ? formatTimestamp(apiKey.lastUsed)
          : 'Never'}
      </td>
      {/* <td>{apiKey.permission}</td> */}
      <td>
        {/* <Button variant="warning" size="sm">
    Edit
  </Button>{' '} */}
        <Button
          variant="danger"
          size="sm"
          onClick={handleDeleteClick}
        >
          Delete
        </Button>
      </td>
    </tr>
  );
};

export const APIKeysList = ({
  apiKeys,
  setApiKeyBeingDeleted,
  // const handleDeleteAPIKeyClick = useCallback(
  //   (apiKey: APIKey) => {
  //     setApiKeyBeingDeleted(apiKey);
  //   },
  //   [],
  // );
}: {
  apiKeys: Array<APIKey>;
  setApiKeyBeingDeleted: (apiKey: APIKey | null) => void;
}) => {
  return (
    <Table striped bordered hover>
      <thead>
        <tr>
          <th>NAME</th>
          {/* <th>SECRET KEY</th> */}
          {/* <th>TRACKING</th> */}
          <th>CREATED</th>
          <th>LAST USED</th>
          {/* <th>PERMISSIONS</th> */}
          <th>ACTIONS</th>
        </tr>
      </thead>
      <tbody>
        {apiKeys.map((apiKey) => (
          <APIKeyRow
            key={apiKey.id}
            apiKey={apiKey}
            setApiKeyBeingDeleted={setApiKeyBeingDeleted}
          />
        ))}
      </tbody>
    </Table>
  );
};
