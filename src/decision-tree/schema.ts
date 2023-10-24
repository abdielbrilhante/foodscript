import { z } from 'zod';

const graphItemSchema = z.object({
  id: z.string().length(8).cuid2(),
  x: z.number(),
  y: z.number(),
});

export const startItemSchema = graphItemSchema.and(
  z.object({
    type: z.literal('start'),
    next: z.object({
      start: z.string().nullable(),
    }),
  }),
);

export const decisionItemSchema = graphItemSchema.and(
  z.object({
    type: z.literal('decision'),
    test: z.union([
      z.literal('isCarrying'),
      z.literal('isInTerminal'),
      z.literal('isFacingTerminal'),
      z.literal('direction'),
      z.literal('center'),
      z.literal('ahead'),
      z.literal('centerLeft'),
      z.literal('left'),
      z.literal('centerRight'),
      z.literal('right'),
      z.literal('random %'),
    ]),
    next: z.object({}).catchall(z.string().nullable()),
  }),
);

export const actionItemSchema = graphItemSchema.and(
  z.object({
    type: z.literal('action'),
    command: z.union([
      z.literal('turnLeft'),
      z.literal('turnRight'),
      z.literal('move'),
      z.literal('pickUp'),
      z.literal('drop'),
    ]),
  }),
);

export const edgeItemSchema = graphItemSchema.and(
  z
    .object({
      type: z.literal('edge'),
      from: z.string().length(8).cuid2(),
      to: z.string().length(8).cuid2(),
      key: z.string().min(1),
      length: z.number().min(0),
      rotation: z.number(),
    })
    .strict(),
);

export const agentTemplateSchema = z
  .object({
    id: z.string().length(8).cuid2(),
    name: z.string().min(1),
    tree: z
      .tuple([startItemSchema])
      .rest(z.union([decisionItemSchema, actionItemSchema])),
  })
  .strict();
