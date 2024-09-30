import { FieldOptions } from "lib/interfaces";

export interface FieldMetadata {
  field: string;
  options: FieldOptions;
}

export const FIELD_METADATA_KEY = "nestfig_fields";

export const Field = (field: string, options: FieldOptions = {}): PropertyDecorator => {
  return (target: any, propertyKey: string) =>
    Reflect.defineMetadata(
      FIELD_METADATA_KEY,
      { field, options } as FieldMetadata,
      target
    );
};
