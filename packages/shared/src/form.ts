import { z } from "zod";

export type ParseFormDataResult<TSchema extends z.ZodType> =
  | { success: true; data: z.output<TSchema> }
  | { success: false; error: z.ZodError<z.output<TSchema>> };

/**
 * Validates FormData with a Zod schema.
 *
 * Empty strings become `undefined` so optional fields and schema defaults
 * behave correctly (a blank textarea shouldn't send `""` for an optional
 * field). String values are trimmed to match the schema's `.trim()` checks.
 */
export function parseFormData<TSchema extends z.ZodType>(
  schema: TSchema,
  formData: FormData,
): ParseFormDataResult<TSchema> {
  const raw: Record<string, unknown> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === "string") {
      const trimmed = value.trim();
      raw[key] = trimmed === "" ? undefined : trimmed;
    } else {
      raw[key] = value;
    }
  }

  const result = schema.safeParse(raw);
  if (result.success) {
    return { success: true, data: result.data };
  }
  return { success: false, error: result.error };
}
