'use strict';

var React = require('react');
var IconButton = require('../../Button/IconButton.js');
require('../../Button/ButtonBase.js');
require('../../utils/defaultSxProp.js');
require('../../Button/Button.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ToolbarButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    disabled,
    condensed
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, _extends({
    ref: ref,
    size: condensed ? 'small' : 'medium',
    variant: "invisible",
    disabled: disabled
    // Prevent focus leaving input:
    ,
    onMouseDown: e => e.preventDefault()
  }, props, {
    sx: {
      color: 'fg.muted',
      ...props.sx
    }
    // Keeping the tooltip disable since it is not maintained anymore and its tests were failing.
    ,
    unsafeDisableTooltip: true
  }));
});
ToolbarButton.displayName = 'MarkdownEditor.ToolbarButton';

exports.ToolbarButton = ToolbarButton;
