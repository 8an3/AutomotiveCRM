'use strict';

var React = require('react');
require('../../Button/ButtonBase.js');
require('../../utils/defaultSxProp.js');
var Button = require('../../Button/Button.js');
require('../../TooltipV2/Tooltip.js');
require('../../Tooltip/Tooltip.js');
var _MarkdownEditorContext = require('./_MarkdownEditorContext.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Actions = ({
  children
}) => /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, children);
Actions.displayName = 'MarkdownEditor.Actions';
const ActionButton = /*#__PURE__*/React.forwardRef((props, ref) => {
  const {
    disabled
  } = React.useContext(_MarkdownEditorContext.MarkdownEditorContext);
  return /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
    ref: ref,
    disabled: disabled
  }, props));
});
ActionButton.displayName = 'MarkdownEditor.ActionButton';

exports.ActionButton = ActionButton;
exports.Actions = Actions;
