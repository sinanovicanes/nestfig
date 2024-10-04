export type ConfigConstructor<T extends Function = any> = new (...args: any[]) => T;
export type ConfigConstructorFactory<T extends Function = any> =
  () => ConfigConstructor<T>;
