"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pdfRender = void 0;
const rectAndEllipse_1 = require("../shapes/rectAndEllipse");
const cell_1 = __importDefault(require("./cell"));
const helper_1 = require("./helper");
const tableHelper_1 = require("./tableHelper");
const rectanglePdfRender = rectAndEllipse_1.rectangle.pdf;
const cellPdfRender = cell_1.default.pdf;
async function drawCell(arg, cell) {
    await cellPdfRender({
        ...arg,
        value: cell.raw,
        schema: {
            type: 'cell',
            position: { x: cell.x, y: cell.y },
            width: cell.width,
            height: cell.height,
            fontName: cell.styles.fontName,
            alignment: cell.styles.alignment,
            verticalAlignment: cell.styles.verticalAlignment,
            fontSize: cell.styles.fontSize,
            lineHeight: cell.styles.lineHeight,
            characterSpacing: cell.styles.characterSpacing,
            backgroundColor: cell.styles.backgroundColor,
            fontColor: cell.styles.textColor,
            borderColor: cell.styles.lineColor,
            borderWidth: cell.styles.lineWidth,
            padding: cell.styles.cellPadding,
        },
    });
}
async function drawRow(arg, table, row, cursor, columns) {
    cursor.x = table.settings.margin.left;
    for (const column of columns) {
        const cell = row.cells[column.index];
        if (!cell) {
            cursor.x += column.width;
            continue;
        }
        cell.x = cursor.x;
        cell.y = cursor.y;
        await drawCell(arg, cell);
        cursor.x += column.width;
    }
    cursor.y += row.height;
}
async function drawTableBorder(arg, table, startPos, cursor) {
    const lineWidth = table.settings.tableLineWidth;
    const lineColor = table.settings.tableLineColor;
    if (!lineWidth || !lineColor)
        return;
    await rectanglePdfRender({
        ...arg,
        schema: {
            type: 'rectangle',
            borderWidth: lineWidth,
            borderColor: lineColor,
            color: '',
            position: { x: startPos.x, y: startPos.y },
            width: table.getWidth(),
            height: cursor.y - startPos.y,
            readOnly: true,
        },
    });
}
async function drawTable(arg, table) {
    const settings = table.settings;
    const startY = settings.startY;
    const margin = settings.margin;
    const cursor = { x: margin.left, y: startY };
    const startPos = Object.assign({}, cursor);
    if (settings.showHead) {
        for (const row of table.head) {
            await drawRow(arg, table, row, cursor, table.columns);
        }
    }
    for (const row of table.body) {
        await drawRow(arg, table, row, cursor, table.columns);
    }
    await drawTableBorder(arg, table, startPos, cursor);
}
const pdfRender = async (arg) => {
    const { value, schema } = arg;
    const body = (0, helper_1.getBodyWithRange)(typeof value !== 'string' ? JSON.stringify(value || '[]') : value, schema.__bodyRange);
    const table = await (0, tableHelper_1.createSingleTable)(body, arg);
    await drawTable(arg, table);
};
exports.pdfRender = pdfRender;
//# sourceMappingURL=pdfRender.js.map