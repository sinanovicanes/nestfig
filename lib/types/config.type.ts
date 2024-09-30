export type Config<T extends Function = any> = new (...args: any[]) => T;
