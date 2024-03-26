import { utcFormat } from 'd3-time-format';
import {
  APIKey,
  Timestamp,
  timestampToDate,
} from 'entities';
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

export const APIKeysList = ({
  apiKeys,
}: {
  apiKeys: Array<APIKey>;
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
              <Button variant="danger" size="sm">
                Delete
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};
