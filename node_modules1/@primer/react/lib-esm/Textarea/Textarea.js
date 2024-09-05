import styled, { css } from 'styled-components';
import React from 'react';
import { TextInputBaseWrapper } from '../internal/components/TextInputWrapper.js';
import sx from '../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_TEXTAREA_ROWS = 7;
const DEFAULT_TEXTAREA_COLS = 30;
const DEFAULT_TEXTAREA_RESIZE = 'both';
const StyledTextarea = styled.textarea.withConfig({
  displayName: "Textarea__StyledTextarea",
  componentId: "sc-1lf8it-0"
})(["border:0;font-size:inherit;font-family:inherit;background-color:transparent;-webkit-appearance:none;color:inherit;width:100%;resize:both;&:focus{outline:0;}", " ", " ", ";"], props => props.resize && css(["resize:", ";"], props.resize), props => props.disabled && css(["resize:none;"]), sx);

/**
 * An accessible, native textarea component that supports validation states.
 * This component accepts all native HTML <textarea> attributes as props.
 */
const Textarea = /*#__PURE__*/React.forwardRef(({
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
  return /*#__PURE__*/React.createElement(TextInputBaseWrapper, {
    sx: sxProp,
    validationStatus: validationStatus,
    disabled: disabled,
    block: block,
    contrast: contrast
  }, /*#__PURE__*/React.createElement(StyledTextarea, _extends({
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

export { DEFAULT_TEXTAREA_COLS, DEFAULT_TEXTAREA_RESIZE, DEFAULT_TEXTAREA_ROWS, Textarea as default };
