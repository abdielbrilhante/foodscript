export const decisions = [
  'isCarrying',
  'isInTerminal',
  'isFacingTerminal',
  'direction',
  'center',
  'ahead',
  'slightLeft',
  'left',
  'slightRight',
  'right',
  'random %',
] as const;

export const actions = [
  'turnLeft',
  'turnRight',
  'move',
  'pickUp',
  'drop',
] as const;
