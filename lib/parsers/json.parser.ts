import { readFileSync } from "fs";

export class JsonParser {
  static parse(data: string): Record<string, any> | any[] {
    return JSON.parse(data);
  }

  static parseFile(path: string): Record<string, any> | any[] {
    try {
      return this.parse(readFileSync(path, "utf-8"));
    } catch (e) {
      throw new Error(`Failed to parse JSON file at ${path}: ${e}`);
    }
  }
}
