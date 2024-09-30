import { Config } from "../types";

export interface NestfigModuleOptions {
  global?: boolean;
  configs: Config[];
}
