import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { existsSync, readFileSync } from "fs";
import { CONFIG_FIELDS_TOKEN, CONFIG_TOKEN } from "../constants";
import { FieldMetadata } from "../decorators";
import { ConfigOptions } from "../interfaces";
import { Config } from "../types";

export class ConfigResolver {
  private static logger = new Logger(ConfigResolver.name);

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

  private static loadConfigFile(path: string): Record<string, any> {
    if (!existsSync(path)) {
      throw new Error(`Config file not found at ${path}`);
    }

    const pathExt = path.split(".").pop().toLowerCase();

    switch (pathExt) {
      case "json":
        try {
          return JSON.parse(readFileSync(path, "utf-8"));
        } catch (e) {
          throw new Error(`Failed to parse JSON config file at ${path}: ${e}`);
        }
      // TODO: Add support for other file types like yaml, toml, etc.
      default:
        this.logger.warn(`Unsupported file extension ${pathExt}`);
        break;
    }
  }

  private static getConfigData(options: ConfigOptions) {
    const config: Record<string, any> = {};

    if (options.paths) {
      options.paths.forEach(path => {
        const data = this.loadConfigFile(path);

        Object.assign(config, data);
      });
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
