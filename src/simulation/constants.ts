export const decisions = [
  'isCarrying',
  'isInTerminal',
  'isFacingTerminal',
  'direction',
  'center',
  'ahead',
  'centerLeft',
  'left',
  'centerRight',
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
