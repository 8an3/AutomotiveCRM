import { parseParams, parseParamsSafe, parseQuery, parseQuerySafe, parseForm, parseFormSafe } from './parsers';
import { BoolAsString, CheckboxAsString, IntAsString, NumAsString } from './schemas';
export { parseParams, parseParamsSafe, parseQuery, parseQuerySafe, parseForm, parseFormSafe, BoolAsString, CheckboxAsString, IntAsString, NumAsString, };
export declare const zx: {
    parseParams: typeof parseParams;
    parseParamsSafe: typeof parseParamsSafe;
    parseQuery: typeof parseQuery;
    parseQuerySafe: typeof parseQuerySafe;
    parseForm: typeof parseForm;
    parseFormSafe: typeof parseFormSafe;
    BoolAsString: import("zod").ZodEffects<import("zod").ZodString, boolean, string>;
    CheckboxAsString: import("zod").ZodEffects<import("zod").ZodOptional<import("zod").ZodLiteral<"on">>, boolean, "on" | undefined>;
    IntAsString: import("zod").ZodEffects<import("zod").ZodString, number, string>;
    NumAsString: import("zod").ZodEffects<import("zod").ZodString, number, string>;
};
