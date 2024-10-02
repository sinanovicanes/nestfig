import { DynamicModule, Module } from "@nestjs/common";
import * as dotenv from "dotenv";
import { resolve } from "path";
import { DEFAULT_ENV_FILE_PATH } from "./constants";
import { ConfigProviderFactory } from "./factories";
import { NestfigModuleOptions } from "./interfaces";

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

  /**
   * Loads process environment variables depending on the "ignoreEnvFile" flag and "envFilePath" value.
   * Also, registers custom configurations globally.
   * @param options
   */
  static forRoot(options: NestfigModuleOptions = {}): DynamicModule {
    if (!options.ignoreEnvFile) {
      this.loadEnvFile(options.envFilePath);
    }

    const providers = options.configs
      ? options.configs.map(config => ConfigProviderFactory.create(config))
      : undefined;

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
    const providers = configs.map(config => ConfigProviderFactory.create(config));

    return {
      module: NestfigModule,
      providers,
      exports: providers
    };
  }
}
