"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getDynamicHeightForTable = exports.modifyTemplateForTable = void 0;
const tableHelper_1 = require("./tableHelper");
const utils_1 = require("../utils");
const helper_js_1 = require("./helper.js");
const modifyTemplateForTable = async (arg) => {
    const { template: t, input, options, _cache } = arg;
    const template = Object.assign((0, utils_1.cloneDeep)(t), { schemas: [] });
    let pageIndex = 0;
    for (const schemaObj of t.schemas) {
        const additionalSchemaObjs = [];
        for (const [key, schema] of Object.entries(schemaObj)) {
            if (schema.type === 'table') {
                schema.__bodyRange = undefined;
                const body = (0, helper_js_1.getBody)(input?.[key]);
                const tables = await (0, tableHelper_1.createMultiTables)(body, {
                    schema,
                    basePdf: template.basePdf,
                    options,
                    _cache,
                });
                if (tables.length > 1) {
                    const firstTable = tables[0];
                    schema.__bodyRange = { start: 0, end: firstTable.body.length };
                    const allBodies = tables.map((table) => table.body);
                    const from2ndTable = tables.slice(1);
                    from2ndTable.forEach((table, i) => {
                        const additionalPageIndex = pageIndex + i + 1;
                        const additionalSchemaObj = {
                            [key]: {
                                ...schema,
                                position: { x: schema.position.x, y: table.settings.startY },
                                height: table.getHeight(),
                                showHead: false,
                                __bodyRange: {
                                    start: allBodies.slice(0, i + 1).reduce((acc, cur) => acc + cur.length, 0),
                                    end: allBodies.slice(0, i + 2).reduce((acc, cur) => acc + cur.length, 0),
                                },
                                content: typeof input[key] !== 'string' ? JSON.stringify(input[key] || '[]') : input[key],
                            },
                        };
                        additionalSchemaObjs[additionalPageIndex] = additionalSchemaObj;
                    });
                }
            }
        }
        template.schemas.push(schemaObj);
        additionalSchemaObjs.forEach((obj, index) => {
            if (!template.schemas[index]) {
                template.schemas[index] = obj;
            }
            else {
                template.schemas[index] = { ...template.schemas[index], ...obj };
            }
        });
        pageIndex++;
    }
    return template;
};
exports.modifyTemplateForTable = modifyTemplateForTable;
const getDynamicHeightForTable = async (value, args) => {
    if (args.schema.type !== 'table')
        return Promise.resolve(args.schema.height);
    const schema = args.schema;
    const body = schema.__bodyRange?.start === 0 ? (0, helper_js_1.getBody)(value) : (0, helper_js_1.getBodyWithRange)(value, schema.__bodyRange);
    const table = await (0, tableHelper_1.createSingleTable)(body, args);
    return table.getHeight();
};
exports.getDynamicHeightForTable = getDynamicHeightForTable;
//# sourceMappingURL=dynamicTemplate.js.map