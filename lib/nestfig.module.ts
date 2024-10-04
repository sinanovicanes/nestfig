import { DynamicModule, Module, Provider } from "@nestjs/common";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { CONFIG_FIELDS_TOKEN, DEFAULT_ENV_FILE_PATH } from "./constants";
import { ConfigProviderFactory } from "./factories";
import { NestfigModuleOptions } from "./interfaces";
import { ConfigField } from "./types";

@Module({})
export class NestfigModule {
  private static isEnvLoaded = false;

  private static loadEnvFile(path?: string | string[]) {
    if (this.isEnvLoaded) return;

    path = Array.isArray(path)
      ? path
      : [path ?? resolve(process.cwd(), DEFAULT_ENV_FILE_PATH)];

    dotenv.config({ path });

    this.isEnvLoaded = true;
  }

  private static getConfigProviders(
    configs?: NestfigModuleOptions["configs"]
  ): Provider[] {
    if (!configs) return [];

    const loadedProviders: Record<string, boolean> = {};
    const providers: Provider[] = [];

    // Load child configurations
    for (const config of configs) {
      const fields: Record<string, ConfigField> = Reflect.getMetadata(
        CONFIG_FIELDS_TOKEN,
        config.prototype
      );

      if (!fields) continue;

      for (const key in fields) {
        const field = fields[key];

        // If the field is a function, it means it's a configuration class
        if (field instanceof Function) {
          const configConstructor = field();

          if (!loadedProviders[configConstructor.name]) {
            loadedProviders[configConstructor.name] = true;
            providers.push(ConfigProviderFactory.create(configConstructor));
          }
        }
      }
    }

    configs.forEach(config => providers.push(ConfigProviderFactory.create(config)));

    return providers;
  }

  /**
   * Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
   * Also, registers custom configurations globally.
   * @param options
   */
  static forRoot(options: NestfigModuleOptions = {}): DynamicModule {
    if (!options.ignoreEnvFile) {
      this.loadEnvFile(options.envFilePath);
    }

    const providers = this.getConfigProviders(options.configs);

    return {
      module: NestfigModule,
      global: options.global,
      providers,
      exports: providers
    };
  }

  /**
   * Registers configuration classes.
   * @param config
   */
  static forFeature(configs: NestfigModuleOptions["configs"]): DynamicModule {
    const providers = this.getConfigProviders(configs);

    return {
      module: NestfigModule,
      providers,
      exports: providers
    };
  }
}
