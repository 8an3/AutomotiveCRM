'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var styled = require('styled-components');
var React = require('react');
var TextInputWrapper = require('../internal/components/TextInputWrapper.js');
var sx = require('../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var styled__default = /*#__PURE__*/_interopDefault(styled);
var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_TEXTAREA_ROWS = 7;
const DEFAULT_TEXTAREA_COLS = 30;
const DEFAULT_TEXTAREA_RESIZE = 'both';
const StyledTextarea = styled__default.default.textarea.withConfig({
  displayName: "Textarea__StyledTextarea",
  componentId: "sc-1lf8it-0"
})(["border:0;font-size:inherit;font-family:inherit;background-color:transparent;-webkit-appearance:none;color:inherit;width:100%;resize:both;&:focus{outline:0;}", " ", " ", ";"], props => props.resize && styled.css(["resize:", ";"], props.resize), props => props.disabled && styled.css(["resize:none;"]), sx.default);

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const Textarea = /*#__PURE__*/React__default.default.forwardRef(({
  value,
  disabled,
  sx: sxProp,
  required,
  validationStatus,
  rows = DEFAULT_TEXTAREA_ROWS,
  cols = DEFAULT_TEXTAREA_COLS,
  resize = DEFAULT_TEXTAREA_RESIZE,
  block,
  contrast,
  ...rest
}, ref) => {
  return /*#__PURE__*/React__default.default.createElement(TextInputWrapper.TextInputBaseWrapper, {
    sx: sxProp,
    validationStatus: validationStatus,
    disabled: disabled,
    block: block,
    contrast: contrast
  }, /*#__PURE__*/React__default.default.createElement(StyledTextarea, _extends({
    value: value,
    resize: resize,
    "aria-required": required,
    "aria-invalid": validationStatus === 'error' ? 'true' : 'false',
    ref: ref,
    disabled: disabled,
    rows: rows,
    cols: cols
  }, rest)));
});
Textarea.displayName = 'Textarea';

exports.DEFAULT_TEXTAREA_COLS = DEFAULT_TEXTAREA_COLS;
exports.DEFAULT_TEXTAREA_RESIZE = DEFAULT_TEXTAREA_RESIZE;
exports.DEFAULT_TEXTAREA_ROWS = DEFAULT_TEXTAREA_ROWS;
exports.default = Textarea;
