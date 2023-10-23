import { init } from '@paralleldrive/cuid2';

export const randId = init({
  length: 8,
  fingerprint: 'a-custom-host-fingerprint',
});

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
