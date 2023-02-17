import { z } from 'zod';

type Implements<Model> = {
  [key in keyof Model]-?: undefined extends Model[key]
    ? null extends Model[key]
      ? z.ZodNullableType<z.ZodOptionalType<z.ZodType<Model[key]>>>
      : z.ZodOptionalType<z.ZodType<Model[key]>>
    : null extends Model[key]
    ? z.ZodNullableType<z.ZodType<Model[key]>>
    : z.ZodType<Model[key]>;
};

export function zodSchema<Model = never>(
  schema: Implements<Model> & {
    [unknownKey in Exclude<keyof Model, keyof Model>]: never;
  },
) {
  return z.object(schema);
}
