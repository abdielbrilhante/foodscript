export const randId = () =>
  Array(8)
    .fill(null)
    .map(() => {
      const offset = Math.floor(Math.random() * 36);
      return String.fromCharCode(offset < 10 ? 48 + offset : 87 + offset);
    })
    .join('');

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
