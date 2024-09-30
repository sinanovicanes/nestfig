import { Logger } from "@nestjs/common";
import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { existsSync, readFileSync } from "fs";
import { CONFIG_FIELDS_TOKEN, CONFIG_TOKEN } from "../constants";
import { ConfigOptions, FieldMetadata } from "../interfaces";
import { ConfigConstructor } from "../types";

export class ConfigResolver {
  private readonly logger: Logger;
  private readonly options: ConfigOptions;
  private readonly name: string;

  constructor(private readonly configConstructor: ConfigConstructor) {
    this.name = configConstructor.name;
    this.options = Reflect.getMetadata(CONFIG_TOKEN, configConstructor);

    if (!this.options) {
      throw new Error(`No configuration options found for ${this.name}`);
    }

    this.logger = new Logger(`ConfigResolver:${this.name}`);
  }

  private validateConfig<T extends Function>(instance: T) {
    const validatedConfig = plainToInstance(this.configConstructor, instance, {
      enableImplicitConversion: true
    });

    const errors = validateSync(validatedConfig, {
      skipMissingProperties: false,
      forbidUnknownValues: false
    });

    if (errors.length > 0) {
      throw new Error(errors.toString());
    }

    return validatedConfig;
  }

  private loadConfigFile(path: string): Record<string, any> {
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

  private getConfig() {
    const config: Record<string, any> = {};

    if (this.options.paths) {
      this.options.paths.forEach(path => {
        const data = this.loadConfigFile(path);

        Object.assign(config, data);
      });
    }

    if (!this.options.ignoreEnv) {
      Object.assign(config, process.env);
    }

    return config;
  }

  private populateInstance(instance: ConfigConstructor) {
    const config = this.getConfig();
    const fields: Record<string, FieldMetadata> = Reflect.getMetadata(
      CONFIG_FIELDS_TOKEN,
      instance
    );

    if (!fields) return;

    for (const propertyKey in fields) {
      const propertyOptions = fields[propertyKey];

      instance[propertyKey] = config[propertyOptions.field] ?? instance[propertyKey];
    }
  }

  private createInstance() {
    return new this.configConstructor();
  }

  resolve() {
    const instance = this.createInstance();

    this.populateInstance(instance);

    return this.validateConfig(instance);
  }
}
