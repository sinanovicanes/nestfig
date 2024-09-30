import { CONFIG_TOKEN } from "../constants";
import { ConfigOptions } from "../interfaces";

export const Config = (config: ConfigOptions = {}): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(CONFIG_TOKEN, config, target);
  };
};
