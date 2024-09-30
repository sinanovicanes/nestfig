import { DynamicModule, Module, ModuleMetadata } from "@nestjs/common";
import { NestfigService } from "./nestfig.service";
import { ClassConstructor } from "class-transformer";

@Module({
  providers: [NestfigService]
})
export class NestfigModule {
  private static createProvider(target: ClassConstructor<any>) {
    return {
      provide: target,
      inject: [NestfigService],
      useFactory: (service: NestfigService) => service.load(target)
    };
  }

  static load(...targets: ClassConstructor<any>[]): DynamicModule {
    const providers = targets.map(this.createProvider);

    return {
      module: NestfigModule,
      global: true,
      providers: [NestfigService, ...providers],
      exports: providers
    };
  }
}
