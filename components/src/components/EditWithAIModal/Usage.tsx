import { Table } from '../bootstrap';

// Usage entry interface
export interface UsageEntry {
  modelName: string;
  prompt: string;
  cost: string;
  result: string;
  thumbnailURL: string;
  timestamp?: string;
}

interface UsageProps {
  showUsage: boolean;
  usageEntries: UsageEntry[];
}

export const Usage = ({
  showUsage,
  usageEntries,
}: UsageProps) => {
  if (!showUsage) return null;

  return (
    <div className="mt-4 w-100">
      <h4>AI Usage History</h4>
      <div
        className="usage-table"
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        <Table
          striped
          bordered
          hover
          size="sm"
          style={{ width: '100%', fontSize: '12px' }}
        >
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Model</th>
              <th>Cost</th>
              {/* <th>Result</th> */}
            </tr>
          </thead>
          <tbody>
            {usageEntries.map((entry, index) => (
              <tr key={index}>
                <td
                  className="text-truncate"
                  style={{ maxWidth: '150px' }}
                >
                  {entry.prompt}
                </td>
                <td>{entry.modelName}</td>
                <td>{entry.cost}</td>
                {/* <td className="text-center">
                  <img
                    src={entry.thumbnailURL}
                    alt="Result thumbnail"
                    style={{
                      maxHeight: '50px',
                      maxWidth: '100px',
                      objectFit: 'contain',
                    }}
                  />
                </td> */}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
