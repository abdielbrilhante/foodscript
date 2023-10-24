export class LocalStorage {
  static getItem(key: string) {
    return localStorage.getItem(`ggd__${key}`);
  }

  static setItem(key: string, value: string) {
    return localStorage.setItem(`ggd__${key}`, value);
  }

  static removeItem(key: string) {
    return localStorage.removeItem(`ggd__${key}`);
  }
}
