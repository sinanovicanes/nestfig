import { Injectable } from "@nestjs/common";
import { CONFIG_METADATA_KEY, FIELD_METADATA_KEY, FieldMetadata } from "./decorators";
import { ClassConstructor, plainToInstance } from "class-transformer";
import { validateSync } from "class-validator";
import { ConfigOptions } from "./interfaces";

@Injectable()
export class NestfigService {
  private validateConfig<T extends Function>(target: ClassConstructor<T>, instance: T) {
    const validatedConfig = plainToInstance(target, instance, {
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

  private async getConfig(options: ConfigOptions) {
    const config: Record<string, any> = {};

    if (options.paths) {
      // TODO: Load config from paths
    }

    if (!options.ignoreEnv) {
      Object.assign(config, process.env);
    }

    return config;
  }

  load(target: ClassConstructor<any>) {
    const configOptions = Reflect.getMetadata(CONFIG_METADATA_KEY, target);

    if (!configOptions) {
      throw new Error(`No configuration found for ${target.name}`);
    }

    const instance = new target();
    const config = this.getConfig(configOptions);

    for (const propertyKey in instance) {
      const propertyOptions: FieldMetadata = Reflect.getMetadata(
        FIELD_METADATA_KEY,
        instance,
        propertyKey
      );

      if (propertyOptions) {
        instance[propertyKey] = config[propertyOptions.field] ?? instance[propertyKey];
      }
    }

    return this.validateConfig(target, instance);
  }
}
