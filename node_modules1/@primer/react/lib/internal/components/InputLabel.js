'use strict';

var React = require('react');
var Box = require('../../Box/Box.js');
var _VisuallyHidden = require('../../_VisuallyHidden.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const InputLabel = ({
  children,
  disabled,
  htmlFor,
  id,
  required,
  requiredText,
  requiredIndicator,
  visuallyHidden,
  sx,
  as = 'label',
  ...props
}) => {
  return /*#__PURE__*/React__default.default.createElement(_VisuallyHidden, _extends({
    isVisible: !visuallyHidden,
    as: as /* This assertion is clearly wrong, but it's the only way TS will allow the htmlFor prop to be possibly defined */,
    htmlFor: htmlFor,
    id: id,
    sx: {
      fontWeight: 'bold',
      fontSize: 1,
      display: 'block',
      color: disabled ? 'fg.muted' : 'fg.default',
      cursor: disabled ? 'not-allowed' : 'pointer',
      alignSelf: 'flex-start',
      ...sx
    }
  }, props), required || requiredText ? /*#__PURE__*/React__default.default.createElement(Box, {
    display: "flex",
    as: "span"
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    mr: 1
  }, children), /*#__PURE__*/React__default.default.createElement("span", {
    "aria-hidden": requiredIndicator ? undefined : true
  }, requiredText !== null && requiredText !== void 0 ? requiredText : '*')) : children);
};
InputLabel.displayName = "InputLabel";

module.exports = InputLabel;
