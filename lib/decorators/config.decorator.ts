import { ConfigOptions } from "../interfaces";

export const CONFIG_METADATA_KEY = "nestfig_config";

export const Config = (config: ConfigOptions = {}): ClassDecorator => {
  return target => {
    Reflect.defineMetadata(CONFIG_METADATA_KEY, config, target);
  };
};
