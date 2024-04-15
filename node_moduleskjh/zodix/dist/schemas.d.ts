import { z } from 'zod';
/**
 * Zod schema to parse strings that are booleans.
 * Use to parse <input type="hidden" value="true" /> values.
 * @example
 * ```ts
 * BoolAsString.parse('true') -> true
 * ```
 */
export declare const BoolAsString: z.ZodEffects<z.ZodString, boolean, string>;
/**
 * Zod schema to parse checkbox formdata.
 * Use to parse <input type="checkbox" /> values.
 * @example
 * ```ts
 * CheckboxAsString.parse('on') -> true
 * CheckboxAsString.parse(undefined) -> false
 * ```
 */
export declare const CheckboxAsString: z.ZodEffects<z.ZodOptional<z.ZodLiteral<"on">>, boolean, "on" | undefined>;
/**
 * Zod schema to parse strings that are integers.
 * Use to parse  <input type="number" /> values.
 * @example
 * ```ts
 * IntAsString.parse('3') -> 3
 * ```
 */
export declare const IntAsString: z.ZodEffects<z.ZodString, number, string>;
/**
 * Zod schema to parse strings that are numbers.
 * Use to parse <input type="number" step="0.1" /> values.
 * @example
 * ```ts
 * NumAsString.parse('3.14') -> 3.14
 * ```
 */
export declare const NumAsString: z.ZodEffects<z.ZodString, number, string>;
