import { FieldOptions } from "../interfaces";

export interface FieldMetadata {
  field: string;
  options: FieldOptions;
}

export const FIELD_METADATA_KEY = "nestfig_fields";

export const Field = (field: string, options: FieldOptions = {}): PropertyDecorator => {
  return (target: any, propertyKey: string) => {
    const existingFields = Reflect.getMetadata(FIELD_METADATA_KEY, target) || {};

    existingFields[propertyKey] = { field, options } as FieldMetadata;

    Reflect.defineMetadata(FIELD_METADATA_KEY, existingFields, target);
  };
};
