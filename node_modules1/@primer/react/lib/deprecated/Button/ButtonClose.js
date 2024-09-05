'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var sx = require('../../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledButton = styled__default.default.button.withConfig({
  displayName: "ButtonClose__StyledButton",
  componentId: "sc-azdk6r-0"
})(["border:none;padding:0;background:transparent;cursor:pointer;border-radius:", ";color:", ";&:focus{outline:solid 2px ", ";}&:hover{color:", ";}", ";"], constants.get('radii.2'), constants.get('colors.fg.muted'), constants.get('colors.accent.fg'), constants.get('colors.accent.fg'), sx.default);
const ButtonClose = /*#__PURE__*/React.forwardRef((props, ref) => {
  return /*#__PURE__*/React__default.default.createElement(StyledButton, _extends({
    ref: ref,
    "aria-label": "Close"
  }, props), /*#__PURE__*/React__default.default.createElement(octiconsReact.XIcon, null));
});

module.exports = ButtonClose;
