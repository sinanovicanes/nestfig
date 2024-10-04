import { CONFIG_FIELDS_TOKEN } from "../constants";
import { ConfigField } from "../types";

export const Field = (field: ConfigField): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    const existingFields = Reflect.getMetadata(CONFIG_FIELDS_TOKEN, target) || {};

    existingFields[propertyKey] = field;

    Reflect.defineMetadata(CONFIG_FIELDS_TOKEN, existingFields, target);
  };
};
