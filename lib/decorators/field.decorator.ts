import { CONFIG_FIELDS_TOKEN } from "../constants";
import { FieldMetadata } from "../interfaces";

export const Field = (field: string): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    const existingFields = Reflect.getMetadata(CONFIG_FIELDS_TOKEN, target) || {};

    existingFields[propertyKey] = { field } as FieldMetadata;

    Reflect.defineMetadata(CONFIG_FIELDS_TOKEN, existingFields, target);
  };
};
