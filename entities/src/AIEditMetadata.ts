import { VizId } from './Viz';
import { UserId } from './Users';
import { Timestamp } from './common';
import { CommitId } from './RevisionHistory';

export type AIEditMetadataId = string;

// Tracks metadata on an AI generation
// when the user click "Edit with AI"
export interface AIEditMetadata {
  id: AIEditMetadataId;
  openRouterGenerationId: string;
  timestamp: Timestamp;
  user: UserId;
  viz: VizId;
  commit: CommitId;
  upstreamCostCents: number;
  userCostCents: number;
  updatedCreditBalance: number;
  model: string;
  provider: string;
  inputTokens: number;
  outputTokens: number;
  userPrompt: string;
  promptTemplateVersion: number;
}
