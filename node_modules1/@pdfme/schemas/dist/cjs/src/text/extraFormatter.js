"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getExtraFormatterSchema = exports.Formatter = void 0;
const icons_1 = require("./icons");
const constants_1 = require("./constants");
var Formatter;
(function (Formatter) {
    Formatter["STRIKETHROUGH"] = "strikethrough";
    Formatter["UNDERLINE"] = "underline";
    Formatter["ALIGNMENT"] = "alignment";
    Formatter["VERTICAL_ALIGNMENT"] = "verticalAlignment";
})(Formatter = exports.Formatter || (exports.Formatter = {}));
function getExtraFormatterSchema(i18n) {
    const buttons = [
        { key: Formatter.STRIKETHROUGH, icon: icons_1.TextStrikethroughIcon, type: 'boolean' },
        { key: Formatter.UNDERLINE, icon: icons_1.TextUnderlineIcon, type: 'boolean' },
        { key: Formatter.ALIGNMENT, icon: icons_1.TextAlignLeftIcon, type: 'select', value: constants_1.DEFAULT_ALIGNMENT },
        { key: Formatter.ALIGNMENT, icon: icons_1.TextAlignCenterIcon, type: 'select', value: constants_1.ALIGN_CENTER },
        { key: Formatter.ALIGNMENT, icon: icons_1.TextAlignRightIcon, type: 'select', value: constants_1.ALIGN_RIGHT },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: icons_1.TextVerticalAlignTopIcon,
            type: 'select',
            value: constants_1.DEFAULT_VERTICAL_ALIGNMENT,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: icons_1.TextVerticalAlignMiddleIcon,
            type: 'select',
            value: constants_1.VERTICAL_ALIGN_MIDDLE,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: icons_1.TextVerticalAlignBottomIcon,
            type: 'select',
            value: constants_1.VERTICAL_ALIGN_BOTTOM,
        },
    ];
    return {
        title: i18n('schemas.text.format'),
        widget: 'ButtonGroup',
        buttons,
        span: 17,
    };
}
exports.getExtraFormatterSchema = getExtraFormatterSchema;
//# sourceMappingURL=extraFormatter.js.map