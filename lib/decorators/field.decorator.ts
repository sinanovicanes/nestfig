import { CONFIG_FIELDS_TOKEN } from "../constants";
import { FieldOptions } from "../interfaces";

export interface FieldMetadata {
  field: string;
  options: FieldOptions;
}

export const Field = (field: string, options: FieldOptions = {}): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    const existingFields = Reflect.getMetadata(CONFIG_FIELDS_TOKEN, target) || {};

    existingFields[propertyKey] = { field, options } as FieldMetadata;

    Reflect.defineMetadata(CONFIG_FIELDS_TOKEN, existingFields, target);
  };
};
