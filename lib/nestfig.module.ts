import { DynamicModule, Module } from "@nestjs/common";
import { ConfigProviderFactory } from "./factories";
import { NestfigModuleOptions } from "./interfaces";
import * as dotenv from "dotenv";
import { DEFAULT_ENV_FILE_PATH } from "./constants";
import { resolve } from "path";

@Module({})
export class NestfigModule {
  private static isEnvLoaded = false;

  private static loadEnvFile(paths?: NestfigModuleOptions["envFilePath"]) {
    if (this.isEnvLoaded) return;

    paths = Array.isArray(paths)
      ? paths
      : [paths ?? resolve(process.cwd(), DEFAULT_ENV_FILE_PATH)];

    paths.forEach(path => dotenv.config({ path }));

    this.isEnvLoaded = true;
  }

  static load({ global, envFilePath, configs }: NestfigModuleOptions): DynamicModule {
    this.loadEnvFile(envFilePath);

    const providers = configs.map(config => ConfigProviderFactory.create(config));

    return {
      module: NestfigModule,
      global,
      providers,
      exports: providers
    };
  }
}
