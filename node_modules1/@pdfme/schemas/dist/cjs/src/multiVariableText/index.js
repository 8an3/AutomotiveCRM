"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfRender_js_1 = require("./pdfRender.js");
const propPanel_js_1 = require("./propPanel.js");
const uiRender_js_1 = require("./uiRender.js");
const schema = {
    pdf: pdfRender_js_1.pdfRender,
    ui: uiRender_js_1.uiRender,
    propPanel: propPanel_js_1.propPanel,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-type"><polyline points="4 7 4 4 20 4 20 7"/><line x1="9" x2="15" y1="20" y2="20"/><line x1="12" x2="12" y1="4" y2="20"/></svg>',
    uninterruptedEditMode: true
};
exports.default = schema;
//# sourceMappingURL=index.js.map