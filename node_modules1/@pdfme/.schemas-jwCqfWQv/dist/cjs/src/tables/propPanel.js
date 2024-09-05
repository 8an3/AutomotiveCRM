"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.propPanel = void 0;
const common_1 = require("@pdfme/common");
const helper_js_1 = require("./helper.js");
const constants_js_1 = require("../constants.js");
exports.propPanel = {
    schema: ({ activeSchema, options, i18n }) => {
        // @ts-ignore
        const head = (activeSchema.head || []);
        const font = options.font || { [common_1.DEFAULT_FONT_NAME]: { data: '', fallback: true } };
        const fontNames = Object.keys(font);
        const fallbackFontName = (0, common_1.getFallbackFontName)(font);
        return {
            tableStyles: {
                title: i18n('schemas.table.tableStyle'),
                type: 'object',
                widget: 'Card',
                span: 24,
                properties: {
                    borderWidth: {
                        title: i18n('schemas.borderWidth'),
                        type: 'number',
                        widget: 'inputNumber',
                        props: { min: 0, step: 0.1 },
                        step: 1,
                    },
                    borderColor: {
                        title: i18n('schemas.borderColor'),
                        type: 'string',
                        widget: 'color',
                        rules: [{ pattern: constants_js_1.HEX_COLOR_PATTERN, message: i18n('validation.hexColor') }],
                    },
                },
            },
            headStyles: {
                title: i18n('schemas.table.headStyle'),
                type: 'object',
                widget: 'Card',
                span: 24,
                properties: (0, helper_js_1.getCellPropPanelSchema)({ i18n, fallbackFontName, fontNames }),
            },
            bodyStyles: {
                title: i18n('schemas.table.bodyStyle'),
                type: 'object',
                widget: 'Card',
                span: 24,
                properties: (0, helper_js_1.getCellPropPanelSchema)({ i18n, fallbackFontName, fontNames, isBody: true }),
            },
            columnStyles: {
                title: i18n('schemas.table.columnStyle'),
                type: 'object',
                widget: 'Card',
                span: 24,
                properties: (0, helper_js_1.getColumnStylesPropPanelSchema)({ head, i18n }),
            },
        };
    },
    defaultSchema: {
        type: 'table',
        position: { x: 0, y: 0 },
        width: 150,
        height: 20,
        content: JSON.stringify([
            ['Alice', 'New York', 'Alice is a freelance web designer and developer'],
            ['Bob', 'Paris', 'Bob is a freelance illustrator and graphic designer'],
        ]),
        showHead: true,
        head: ['Name', 'City', 'Description'],
        headWidthPercentages: [30, 30, 40],
        tableStyles: {
            borderColor: '#000000',
            borderWidth: 0.3,
        },
        headStyles: Object.assign((0, helper_js_1.getDefaultCellStyles)(), {
            fontColor: '#ffffff',
            backgroundColor: '#2980ba',
            borderColor: '',
            borderWidth: { top: 0, right: 0, bottom: 0, left: 0 },
        }),
        bodyStyles: Object.assign((0, helper_js_1.getDefaultCellStyles)(), {
            alternateBackgroundColor: '#f5f5f5',
        }),
        columnStyles: {},
    },
};
//# sourceMappingURL=propPanel.js.map