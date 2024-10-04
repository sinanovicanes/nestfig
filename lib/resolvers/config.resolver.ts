import { plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { existsSync } from "fs";
import { extname } from "path";
import { CONFIG_FIELDS_TOKEN, CONFIG_TOKEN } from "../constants";
import { ConfigOptions } from "../interfaces";
import { NestfigRegistery } from "../nestfig.registery";
import { JsonParser, YamlParser } from "../parsers";
import { ConfigConstructor, ConfigField } from "../types";

export class ConfigResolver {
  private readonly options: ConfigOptions;
  private readonly name: string;

  constructor(private readonly configConstructor: ConfigConstructor) {
    this.name = configConstructor.name;
    this.options = Reflect.getMetadata(CONFIG_TOKEN, configConstructor);

    if (!this.options) {
      throw new Error(`No configuration options found for ${this.name}`);
    }
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
      throw new Error(`Config file not found: ${path}`);
    }

    const pathExt = extname(path).slice(1).toLowerCase();

    switch (pathExt) {
      case "json":
        return JsonParser.parseFile(path);
      case "yaml":
      case "yml":
        return YamlParser.parseFile(path);
      default:
        throw new Error(`Unsupported file extension ${pathExt}`);
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
    const fields: Record<string, ConfigField> = Reflect.getMetadata(
      CONFIG_FIELDS_TOKEN,
      instance
    );

    if (!fields) return;

    for (const propertyKey in fields) {
      const field = fields[propertyKey];

      if (typeof field === "string") {
        instance[propertyKey] = config[field] ?? instance[propertyKey];
      } else if (field instanceof Function) {
        instance[propertyKey] = NestfigRegistery.get(field());
      }
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
