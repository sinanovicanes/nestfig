import { Provider } from "@nestjs/common";
import { NestfigRegistery } from "../nestfig.registery";
import { ConfigConstructor } from "../types";

export class ConfigProviderFactory {
  static create(config: ConfigConstructor): Provider {
    return {
      provide: config,
      useFactory: () => NestfigRegistery.get(config)
    };
  }
}
