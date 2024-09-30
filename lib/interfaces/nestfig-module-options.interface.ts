import { Config } from "../types";

export interface NestfigModuleOptions {
  global?: boolean;

  /**
   * .env file path or paths to load. (default: .env)
   */
  envFilePath?: string | string[];

  configs: Config[];
}
