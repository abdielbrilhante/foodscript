export class LocalStorage {
  static getItem(key: string) {
    return localStorage.getItem(`adt__${key}`);
  }

  static setItem(key: string, value: string) {
    return localStorage.setItem(`adt__${key}`, value);
  }

  static removeItem(key: string) {
    return localStorage.removeItem(`adt__${key}`);
  }
}
