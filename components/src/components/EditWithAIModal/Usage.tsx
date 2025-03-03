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
      <h5>Usage History</h5>
      <div
        className="usage-table"
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              <th>Prompt</th>
              <th>Model</th>
              <th>Result</th>
              <th>Cost</th>
            </tr>
          </thead>
          <tbody>
            {usageEntries.map((entry, index) => (
              <tr key={index}>
                <td>{entry.modelName}</td>
                <td
                  className="text-truncate"
                  style={{ maxWidth: '150px' }}
                >
                  {entry.prompt}
                </td>
                <td className="text-primary">
                  {entry.cost}
                </td>
                <td className="text-center">
                  <img
                    src={entry.thumbnailURL}
                    alt="Result thumbnail"
                    style={{
                      maxHeight: '50px',
                      maxWidth: '100px',
                      objectFit: 'contain',
                    }}
                  />
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </div>
  );
};
