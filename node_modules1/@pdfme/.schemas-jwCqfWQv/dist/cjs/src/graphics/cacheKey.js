"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCacheKey = void 0;
const getCacheKey = (schema, input) => `${schema.type}${input}`;
exports.getCacheKey = getCacheKey;
//# sourceMappingURL=cacheKey.js.map