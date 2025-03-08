import { VizId } from './Viz';
import { UserId } from './Users';
import { Timestamp } from './common';
import { CommitId } from './RevisionHistory';

export type AIEditMetadataId = string;

// The simplified type exposed in the usage history
export type AIEditMetadataUsage = {
  id: AIEditMetadataId;
  commit: CommitId;
  userCostCents: number;
  model: string;
  timestamp: Timestamp;
  updatedCreditBalance: number;
  userPrompt: string;
};

// Tracks metadata on an AI generation
// when the user click "Edit with AI"
export type AIEditMetadata = AIEditMetadataUsage & {
  openRouterGenerationId: string;
  user: UserId;
  viz: VizId;
  upstreamCostCents: number;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  promptTemplateVersion: number;
};
