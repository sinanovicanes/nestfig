import { Provider } from "@nestjs/common";
import { ConfigResolver } from "../resolvers";
import { Config } from "../types";

export class ConfigProviderFactory {
  static create(config: Config): Provider {
    return {
      provide: config,
      useFactory: () => ConfigResolver.resolve(config)
    };
  }
}
