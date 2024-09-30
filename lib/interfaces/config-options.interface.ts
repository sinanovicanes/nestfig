export interface ConfigOptions {
  /**
   * If "true", process.env will be ignored.
   */
  ignoreEnv?: boolean;

  /**
   * Path to the config file(s) to be loaded.
   */
  paths?: string[];
}
