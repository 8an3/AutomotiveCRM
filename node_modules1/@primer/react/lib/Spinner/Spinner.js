'use strict';

var React = require('react');
var styled = require('styled-components');
var sx = require('../sx.js');
var VisuallyHidden = require('../internal/components/VisuallyHidden.js');
var Box = require('../Box/Box.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useId = require('../hooks/useId.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const sizeMap = {
  small: '16px',
  medium: '32px',
  large: '64px'
};
function Spinner({
  size: sizeKey = 'medium',
  srText = 'Loading',
  'aria-label': ariaLabel,
  ...props
}) {
  const size = sizeMap[sizeKey];
  const hasHiddenLabel = srText !== null && ariaLabel === undefined;
  const labelId = useId.useId();
  return (
    /*#__PURE__*/
    /* inline-flex removes the extra line height */
    React__default.default.createElement(Box, {
      as: "span",
      sx: {
        display: 'inline-flex'
      }
    }, /*#__PURE__*/React__default.default.createElement("svg", _extends({
      height: size,
      width: size,
      viewBox: "0 0 16 16",
      fill: "none",
      "aria-hidden": true,
      "aria-label": ariaLabel !== null && ariaLabel !== void 0 ? ariaLabel : undefined,
      "aria-labelledby": hasHiddenLabel ? labelId : undefined
    }, props), /*#__PURE__*/React__default.default.createElement("circle", {
      cx: "8",
      cy: "8",
      r: "7",
      stroke: "currentColor",
      strokeOpacity: "0.25",
      strokeWidth: "2",
      vectorEffect: "non-scaling-stroke"
    }), /*#__PURE__*/React__default.default.createElement("path", {
      d: "M15 8a7.002 7.002 0 00-7-7",
      stroke: "currentColor",
      strokeWidth: "2",
      strokeLinecap: "round",
      vectorEffect: "non-scaling-stroke"
    })), hasHiddenLabel ? /*#__PURE__*/React__default.default.createElement(VisuallyHidden.VisuallyHidden, {
      id: labelId
    }, srText) : null)
  );
}
Spinner.displayName = "Spinner";
const StyledSpinner = styled__default.default(Spinner).withConfig({
  displayName: "Spinner__StyledSpinner",
  componentId: "sc-1knt686-0"
})(["@keyframes rotate-keyframes{100%{transform:rotate(360deg);}}animation:rotate-keyframes 1s linear infinite;", ""], sx.default);
StyledSpinner.displayName = 'Spinner';

module.exports = StyledSpinner;
