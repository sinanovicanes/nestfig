import { DynamicModule, Module } from "@nestjs/common";
import { ClassConstructor } from "class-transformer";
import { NestfigModuleOptions } from "./interfaces";
import { NestfigService } from "./nestfig.service";
import { ConfigProviderFactory } from "./factories";

@Module({
  providers: [NestfigService]
})
export class NestfigModule {
  static load({ global, configs }: NestfigModuleOptions): DynamicModule {
    const configProviders = configs.map(config => ConfigProviderFactory.create(config));

    return {
      module: NestfigModule,
      global,
      providers: [NestfigService, ...configProviders],
      exports: configProviders
    };
  }
}
