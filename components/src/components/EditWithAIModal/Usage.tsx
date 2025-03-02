// Usage entry interface
export interface UsageEntry {
  modelName: string;
  prompt: string;
  cost: string;
  result: string;
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
        className="usage-list"
        style={{ maxHeight: '200px', overflowY: 'auto' }}
      >
        {usageEntries.map((entry, index) => (
          <div
            key={index}
            className="usage-item border-bottom py-2"
          >
            <div className="d-flex justify-content-between">
              <strong>{entry.modelName}</strong>
              <span className="text-muted">
                {entry.timestamp}
              </span>
            </div>
            <div className="text-truncate">
              <small>Prompt: {entry.prompt}</small>
            </div>
            <div className="text-truncate">
              <small>Result: {entry.result}</small>
            </div>
            <div className="text-end text-primary">
              {entry.cost}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
