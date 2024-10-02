import { ConfigConstructor } from "../types";

export interface NestfigModuleOptions {
  global?: boolean;

  /**
   * If true, the .env file will not be loaded.
   * (default: false)
   */
  ignoreEnvFile?: boolean;

  /**
   * .env file path or paths to load. (default: .env)
   */
  envFilePath?: string | string[];

  configs?: ConfigConstructor[];
}
