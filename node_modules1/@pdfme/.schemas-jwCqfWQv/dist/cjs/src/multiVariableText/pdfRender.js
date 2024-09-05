"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRender = void 0;
const pdfRender_1 = require("../text/pdfRender");
const helper_1 = require("./helper");
const pdfRender = async (arg) => {
    const { value, schema, ...rest } = arg;
    const renderArgs = {
        value: (0, helper_1.substituteVariables)(schema.text || '', value),
        schema,
        ...rest,
    };
    await (0, pdfRender_1.pdfRender)(renderArgs);
};
exports.pdfRender = pdfRender;
//# sourceMappingURL=pdfRender.js.map