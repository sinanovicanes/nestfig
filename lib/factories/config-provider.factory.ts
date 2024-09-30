import { Provider } from "@nestjs/common";
import { ConfigResolver } from "../resolvers";
import { ConfigConstructor } from "../types";

export class ConfigProviderFactory {
  static create(config: ConfigConstructor): Provider {
    return {
      provide: config,
      useFactory: () => new ConfigResolver(config).resolve()
    };
  }
}
