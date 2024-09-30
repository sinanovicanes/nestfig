import { CONFIG_TOKEN } from "../constants";
import { ConfigOptions } from "../interfaces";

export const Config = (options: ConfigOptions = {}): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(CONFIG_TOKEN, options, target);
  };
};
