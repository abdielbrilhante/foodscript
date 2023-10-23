import type { z } from 'zod';

import type {
  actionItemSchema,
  agentTemplateSchema,
  decisionItemSchema,
  edgeItemSchema,
  startItemSchema,
} from './schema';

export type AgentTree = [StartItem, ...(DecisionItem | ActionItem)[]];

export type AgentTemplate = z.infer<typeof agentTemplateSchema>;

export type StartItem = z.infer<typeof startItemSchema>;

export type EdgeItem = z.infer<typeof edgeItemSchema>;

export type DecisionItem = z.infer<typeof decisionItemSchema>;

export type ActionItem = z.infer<typeof actionItemSchema>;
