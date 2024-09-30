import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { FieldMetadata } from "../decorators";
import { ConfigOptions } from "../interfaces";
import { Config } from "../types";
import { CONFIG_TOKEN, CONFIG_FIELDS_TOKEN } from "../constants";

export class ConfigResolver {
  private static validateConfig<T extends Function>(config: Config<T>, instance: T) {
    const validatedConfig = plainToInstance(config, instance, {
      enableImplicitConversion: true
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }

  private static getConfigData(options: ConfigOptions) {
    const config: Record<string, any> = {};

    if (options.paths) {
      // TODO: Load config from paths
    }

    if (!options.ignoreEnv) {
      Object.assign(config, process.env);
    }

    return config;
  }

  static resolve(config: Config) {
    const options = Reflect.getMetadata(CONFIG_TOKEN, config);

    if (!options) {
      throw new Error(`No configuration options found for ${config.name}`);
    }

    const instance = new config();
    const configData = this.getConfigData(options);
    const fields: Record<string, FieldMetadata> = Reflect.getMetadata(
      CONFIG_FIELDS_TOKEN,
      instance
    );

    if (!fields) {
      throw new Error(`No fields found for ${config.name}`);
    }

    for (const propertyKey in fields) {
      const propertyOptions = fields[propertyKey];

      instance[propertyKey] = configData[propertyOptions.field] ?? instance[propertyKey];
    }

    return this.validateConfig(config, instance);
  }
}
