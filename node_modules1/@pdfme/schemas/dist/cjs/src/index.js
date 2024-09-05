"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rotatePoint = exports.convertForPdfLayoutProps = exports.builtInPlugins = exports.ellipse = exports.rectangle = exports.getDynamicHeightForTable = exports.modifyTemplateForTable = exports.tableBeta = exports.line = exports.barcodes = exports.readOnlySvg = exports.svg = exports.readOnlyImage = exports.image = exports.readOnlyText = exports.text = exports.multiVariableText = void 0;
const index_js_1 = __importDefault(require("./multiVariableText/index.js"));
exports.multiVariableText = index_js_1.default;
const index_js_2 = __importStar(require("./text/index.js"));
exports.text = index_js_2.default;
Object.defineProperty(exports, "readOnlyText", { enumerable: true, get: function () { return index_js_2.readOnlyText; } });
const image_js_1 = __importStar(require("./graphics/image.js"));
exports.image = image_js_1.default;
Object.defineProperty(exports, "readOnlyImage", { enumerable: true, get: function () { return image_js_1.readOnlyImage; } });
const svg_js_1 = __importStar(require("./graphics/svg.js"));
exports.svg = svg_js_1.default;
Object.defineProperty(exports, "readOnlySvg", { enumerable: true, get: function () { return svg_js_1.readOnlySvg; } });
const index_js_3 = __importDefault(require("./barcodes/index.js"));
exports.barcodes = index_js_3.default;
const line_js_1 = __importDefault(require("./shapes/line.js"));
exports.line = line_js_1.default;
const index_js_4 = __importDefault(require("./tables/index.js"));
const dynamicTemplate_js_1 = require("./tables/dynamicTemplate.js");
Object.defineProperty(exports, "modifyTemplateForTable", { enumerable: true, get: function () { return dynamicTemplate_js_1.modifyTemplateForTable; } });
Object.defineProperty(exports, "getDynamicHeightForTable", { enumerable: true, get: function () { return dynamicTemplate_js_1.getDynamicHeightForTable; } });
const rectAndEllipse_js_1 = require("./shapes/rectAndEllipse.js");
Object.defineProperty(exports, "rectangle", { enumerable: true, get: function () { return rectAndEllipse_js_1.rectangle; } });
Object.defineProperty(exports, "ellipse", { enumerable: true, get: function () { return rectAndEllipse_js_1.ellipse; } });
const utils_js_1 = require("./utils.js");
Object.defineProperty(exports, "convertForPdfLayoutProps", { enumerable: true, get: function () { return utils_js_1.convertForPdfLayoutProps; } });
Object.defineProperty(exports, "rotatePoint", { enumerable: true, get: function () { return utils_js_1.rotatePoint; } });
const tableBeta = index_js_4.default;
exports.tableBeta = tableBeta;
const builtInPlugins = { Text: index_js_2.default };
exports.builtInPlugins = builtInPlugins;
//# sourceMappingURL=index.js.map