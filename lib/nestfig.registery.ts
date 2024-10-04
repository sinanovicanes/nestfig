import { ConfigResolver } from "./resolvers";
import { ConfigConstructor } from "./types";

export class NestfigRegistery {
  private static readonly loadedConfigs = new Map<string, Function>();

  private static load(configConstructor: ConfigConstructor) {
    const name = configConstructor.name;

    this.loadedConfigs.set(name, new ConfigResolver(configConstructor).resolve());
  }

  static get(configConstructor: ConfigConstructor) {
    const name = configConstructor.name;

    if (!this.loadedConfigs.has(name)) {
      this.load(configConstructor);
    }

    return this.loadedConfigs.get(name);
  }
}
