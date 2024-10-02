import { readFileSync } from "fs";
import { parse } from "yaml";

export class YamlParser {
  static parse(data: string): Record<string, any> | any[] {
    return parse(data);
  }

  static parseFile(path: string): Record<string, any> | any[] {
    try {
      return this.parse(readFileSync(path, "utf-8"));
    } catch (e) {
      throw new Error(`Failed to parse YAML file at ${path}: ${e}`);
    }
  }
}
