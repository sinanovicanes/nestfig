import { Provider } from "@nestjs/common";
import { NestfigService } from "lib/nestfig.service";
import { Config } from "lib/types";

export class ConfigProviderFactory {
  static create(config: Config): Provider {
    return {
      provide: config,
      inject: [NestfigService],
      useFactory: (service: NestfigService) => service.load(config)
    };
  }
}
