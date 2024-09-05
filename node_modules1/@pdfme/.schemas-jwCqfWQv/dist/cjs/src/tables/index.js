"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pdfRender_js_1 = require("./pdfRender.js");
const uiRender_js_1 = require("./uiRender.js");
const propPanel_js_1 = require("./propPanel.js");
const tableSchema = {
    pdf: pdfRender_js_1.pdfRender,
    ui: uiRender_js_1.uiRender,
    propPanel: propPanel_js_1.propPanel,
    icon: '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-table"><path d="M12 3v18"/><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M3 9h18"/><path d="M3 15h18"/></svg>',
};
exports.default = tableSchema;
//# sourceMappingURL=index.js.map