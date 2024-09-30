import { DynamicModule, Module } from "@nestjs/common";
import { ConfigProviderFactory } from "./factories";
import { NestfigModuleOptions } from "./interfaces";

@Module({})
export class NestfigModule {
  static load({ global, configs }: NestfigModuleOptions): DynamicModule {
    const providers = configs.map(config => ConfigProviderFactory.create(config));

    return {
      module: NestfigModule,
      global,
      providers,
      exports: providers
    };
  }
}
