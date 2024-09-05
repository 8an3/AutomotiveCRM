import { TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon, TextStrikethroughIcon, TextUnderlineIcon, TextVerticalAlignBottomIcon, TextVerticalAlignMiddleIcon, TextVerticalAlignTopIcon, } from './icons';
import { ALIGN_CENTER, ALIGN_RIGHT, DEFAULT_ALIGNMENT, DEFAULT_VERTICAL_ALIGNMENT, VERTICAL_ALIGN_BOTTOM, VERTICAL_ALIGN_MIDDLE, } from './constants';
export var Formatter;
(function (Formatter) {
    Formatter["STRIKETHROUGH"] = "strikethrough";
    Formatter["UNDERLINE"] = "underline";
    Formatter["ALIGNMENT"] = "alignment";
    Formatter["VERTICAL_ALIGNMENT"] = "verticalAlignment";
})(Formatter || (Formatter = {}));
export function getExtraFormatterSchema(i18n) {
    const buttons = [
        { key: Formatter.STRIKETHROUGH, icon: TextStrikethroughIcon, type: 'boolean' },
        { key: Formatter.UNDERLINE, icon: TextUnderlineIcon, type: 'boolean' },
        { key: Formatter.ALIGNMENT, icon: TextAlignLeftIcon, type: 'select', value: DEFAULT_ALIGNMENT },
        { key: Formatter.ALIGNMENT, icon: TextAlignCenterIcon, type: 'select', value: ALIGN_CENTER },
        { key: Formatter.ALIGNMENT, icon: TextAlignRightIcon, type: 'select', value: ALIGN_RIGHT },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: TextVerticalAlignTopIcon,
            type: 'select',
            value: DEFAULT_VERTICAL_ALIGNMENT,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: TextVerticalAlignMiddleIcon,
            type: 'select',
            value: VERTICAL_ALIGN_MIDDLE,
        },
        {
            key: Formatter.VERTICAL_ALIGNMENT,
            icon: TextVerticalAlignBottomIcon,
            type: 'select',
            value: VERTICAL_ALIGN_BOTTOM,
        },
    ];
    return {
        title: i18n('schemas.text.format'),
        widget: 'ButtonGroup',
        buttons,
        span: 17,
    };
}
//# sourceMappingURL=extraFormatter.js.map