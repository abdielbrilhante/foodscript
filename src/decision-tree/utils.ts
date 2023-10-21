export const randId = () =>
  String(Math.random() * +new Date())
    .replace('.', '')
    .substring(1, 9);

export function readable(camelCase: string) {
  return camelCase.replace(/([A-Z])/gu, (char) => ` ${char.toLowerCase()}`);
}

export function keysOf<T extends object>(obj: T) {
  return Object.keys(obj) as (keyof T)[];
}

export function classes(
  ...cssClasses: (string | boolean | null | undefined)[]
) {
  return cssClasses.filter((cl) => typeof cl === 'string').join(' ');
}
