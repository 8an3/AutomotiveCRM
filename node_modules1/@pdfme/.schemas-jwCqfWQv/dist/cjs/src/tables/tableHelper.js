"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createMultiTables = exports.createSingleTable = void 0;
const common_1 = require("@pdfme/common");
const utils_1 = require("../utils");
const classes_1 = require("./classes");
function parseSection(sectionName, sectionRows, columns, styleProps, fallbackFontName) {
    const rowSpansLeftForColumn = {};
    const result = sectionRows.map((rawRow, rowIndex) => {
        let skippedRowForRowSpans = 0;
        const cells = {};
        let colSpansAdded = 0;
        let columnSpansLeft = 0;
        for (const column of columns) {
            if (rowSpansLeftForColumn[column.index] == null ||
                rowSpansLeftForColumn[column.index].left === 0) {
                if (columnSpansLeft === 0) {
                    let rawCell;
                    if (Array.isArray(rawRow)) {
                        rawCell = rawRow[column.index - colSpansAdded - skippedRowForRowSpans];
                    }
                    else {
                        rawCell = rawRow[column.index];
                    }
                    const styles = cellStyles(sectionName, column, rowIndex, styleProps, fallbackFontName);
                    const cell = new classes_1.Cell(rawCell, styles, sectionName);
                    cells[column.index] = cell;
                    columnSpansLeft = 0;
                    rowSpansLeftForColumn[column.index] = {
                        left: 0,
                        times: columnSpansLeft,
                    };
                }
                else {
                    columnSpansLeft--;
                    colSpansAdded++;
                }
            }
            else {
                rowSpansLeftForColumn[column.index].left--;
                columnSpansLeft = rowSpansLeftForColumn[column.index].times;
                skippedRowForRowSpans++;
            }
        }
        return new classes_1.Row(rawRow, rowIndex, sectionName, cells);
    });
    return result;
}
function parseContent4Table(input, fallbackFontName) {
    const content = input.content;
    const columns = content.columns.map((index) => new classes_1.Column(index));
    const styles = input.styles;
    return {
        columns,
        head: parseSection('head', content.head, columns, styles, fallbackFontName),
        body: parseSection('body', content.body, columns, styles, fallbackFontName),
    };
}
function cellStyles(sectionName, column, rowIndex, styles, fallbackFontName) {
    let sectionStyles;
    if (sectionName === 'head') {
        sectionStyles = styles.headStyles;
    }
    else if (sectionName === 'body') {
        sectionStyles = styles.bodyStyles;
    }
    const otherStyles = Object.assign({}, styles.styles, sectionStyles);
    const colStyles = styles.columnStyles[column.index] || styles.columnStyles[column.index] || {};
    const rowStyles = sectionName === 'body' && rowIndex % 2 === 0
        ? Object.assign({}, styles.alternateRowStyles)
        : {};
    const defaultStyle = {
        fontName: fallbackFontName,
        backgroundColor: '',
        textColor: '#000000',
        lineHeight: 1,
        characterSpacing: 0,
        alignment: 'left',
        verticalAlignment: 'middle',
        fontSize: 10,
        cellPadding: 5,
        lineColor: '#000000',
        lineWidth: 0,
        minCellHeight: 0,
        minCellWidth: 0,
    };
    return Object.assign(defaultStyle, otherStyles, rowStyles, colStyles);
}
function mapCellStyle(style) {
    return {
        fontName: style.fontName,
        alignment: style.alignment,
        verticalAlignment: style.verticalAlignment,
        fontSize: style.fontSize,
        lineHeight: style.lineHeight,
        characterSpacing: style.characterSpacing,
        backgroundColor: style.backgroundColor,
        // ---
        textColor: style.fontColor,
        lineColor: style.borderColor,
        lineWidth: style.borderWidth,
        cellPadding: style.padding,
    };
}
function createTableWithAvailableHeight(tableBody, availableHeight, args) {
    let limit = availableHeight;
    const newTableBody = [];
    let index = 0;
    while (limit > 0 && index < tableBody.length) {
        const row = tableBody.slice(0, index + 1).pop();
        if (!row)
            break;
        const rowHeight = row.height;
        if (limit - rowHeight < 0) {
            break;
        }
        newTableBody.push(row.raw);
        limit -= rowHeight;
        index++;
    }
    return createSingleTable(newTableBody, args);
}
function getTableOptions(schema, body) {
    const columnStylesWidth = schema.headWidthPercentages.reduce((acc, cur, i) => ({ ...acc, [i]: { cellWidth: schema.width * (cur / 100) } }), {});
    const columnStylesAlignment = Object.entries(schema.columnStyles.alignment || {}).reduce((acc, [key, value]) => ({ ...acc, [key]: { alignment: value } }), {});
    const allKeys = new Set([
        ...Object.keys(columnStylesWidth).map(Number),
        ...Object.keys(columnStylesAlignment).map(Number),
    ]);
    const columnStyles = Array.from(allKeys).reduce((acc, key) => {
        const widthStyle = columnStylesWidth[key] || {};
        const alignmentStyle = columnStylesAlignment[key] || {};
        return { ...acc, [key]: { ...widthStyle, ...alignmentStyle } };
    }, {});
    return {
        head: [schema.head],
        body,
        showHead: schema.showHead,
        startY: schema.position.y,
        tableWidth: schema.width,
        tableLineColor: schema.tableStyles.borderColor,
        tableLineWidth: schema.tableStyles.borderWidth,
        headStyles: mapCellStyle(schema.headStyles),
        bodyStyles: mapCellStyle(schema.bodyStyles),
        alternateRowStyles: { backgroundColor: schema.bodyStyles.alternateBackgroundColor },
        columnStyles,
        margin: { top: 0, right: 0, left: schema.position.x, bottom: 0 },
    };
}
function parseStyles(cInput) {
    const styleOptions = {
        styles: {},
        headStyles: {},
        bodyStyles: {},
        alternateRowStyles: {},
        columnStyles: {},
    };
    for (const prop of Object.keys(styleOptions)) {
        if (prop === 'columnStyles') {
            const current = cInput[prop];
            styleOptions.columnStyles = Object.assign({}, current);
        }
        else {
            const allOptions = [cInput];
            const styles = allOptions.map((opts) => opts[prop] || {});
            styleOptions[prop] = Object.assign({}, styles[0], styles[1], styles[2]);
        }
    }
    return styleOptions;
}
function parseContent4Input(options) {
    const head = options.head || [];
    const body = options.body || [];
    const columns = (head[0] || body[0] || []).map((_, index) => index);
    return { columns, head, body };
}
function parseInput(schema, body) {
    const options = getTableOptions(schema, body);
    const styles = parseStyles(options);
    const settings = {
        startY: options.startY,
        margin: options.margin,
        tableWidth: options.tableWidth,
        showHead: options.showHead,
        tableLineWidth: options.tableLineWidth ?? 0,
        tableLineColor: options.tableLineColor ?? '',
    };
    const content = parseContent4Input(options);
    return { content, styles, settings };
}
function createSingleTable(body, args) {
    const { options, _cache, basePdf } = args;
    if (!(0, common_1.isBlankPdf)(basePdf))
        throw new Error('[@pdfme/schema/table] Custom PDF is not supported');
    const input = parseInput(args.schema, body);
    const font = options.font || (0, common_1.getDefaultFont)();
    const fallbackFontName = (0, common_1.getFallbackFontName)(font);
    const content = parseContent4Table(input, fallbackFontName);
    return classes_1.Table.create({ input, content, font, _cache });
}
exports.createSingleTable = createSingleTable;
async function createMultiTables(body, args) {
    const { basePdf, schema } = args;
    if (!(0, common_1.isBlankPdf)(basePdf))
        throw new Error('[@pdfme/schema/table] Custom PDF is not supported');
    const pageHeight = basePdf.height;
    const paddingBottom = basePdf.padding[2];
    const paddingTop = basePdf.padding[0];
    let availableHeight = pageHeight - paddingBottom - schema.position.y;
    const testTable = await createSingleTable(body, args);
    let remainingBody = testTable.body;
    const tables = [];
    while (remainingBody.length > 0) {
        const tableHeight = tables.length === 0
            ? availableHeight - testTable.getHeadHeight()
            : availableHeight - paddingTop;
        const table = await createTableWithAvailableHeight(remainingBody, tableHeight, args);
        tables.push(table);
        remainingBody = remainingBody.slice(table.body.length);
        if (remainingBody.length > 0) {
            const _schema = (0, utils_1.cloneDeep)(schema);
            _schema.showHead = false;
            _schema.position.y = paddingTop;
            args.schema = _schema;
            availableHeight = pageHeight - paddingTop - paddingBottom;
        }
    }
    return tables;
}
exports.createMultiTables = createMultiTables;
//# sourceMappingURL=tableHelper.js.map