import { Config } from "lib/types";

export interface NestfigModuleOptions {
  global?: boolean;
  configs: Config[];
}
