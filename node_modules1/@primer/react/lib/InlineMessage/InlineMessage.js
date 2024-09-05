'use strict';

var octiconsReact = require('@primer/octicons-react');
var React = require('react');
var styled = require('styled-components');
var constants = require('../constants.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledMessage = styled__default.default.div.withConfig({
  displayName: "InlineMessage__StyledMessage",
  componentId: "sc-13z0tw8-0"
})(["display:grid;column-gap:0.5rem;grid-template-columns:auto 1fr;align-items:start;color:var(--inline-message-fgColor,", ");line-height:var(--inline-message-lineHeight);font-size:var(--inline-message-fontSize,", ");&[data-size='small']{--inline-message-fontSize:var(--text-body-size-small,", ");--inline-message-lineHeight:var(--text-body-lineHeight-small,1.6666);}&[data-size='medium']{--inline-message-fontSize:var(--text-body-size-medium,", ");--inline-message-lineHeight:var(--text-body-lineHeight-medium,1.4285);}&[data-variant='warning']{--inline-message-fgColor:", ";}&[data-variant='critical']{--inline-message-fgColor:", ";}&[data-variant='success']{--inline-message-fgColor:", ";}&[data-variant='unavailable']{--inline-message-fgColor:", ";}& .InlineMessageIcon{min-height:calc(var(--inline-message-lineHeight) * var(--inline-message-fontSize));}"], constants.get('colors.neutral.emphasis'), constants.get('fontSizes.1'), constants.get('fontSizes.0'), constants.get('fontSizes.1'), constants.get('colors.attention.fg'), constants.get('colors.danger.fg'), constants.get('colors.success.fg'), constants.get('colors.neutral.emphasis'));
const variantToIcon = {
  warning: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertIcon, {
    className: "InlineMessageIcon"
  }),
  critical: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertIcon, {
    className: "InlineMessageIcon"
  }),
  success: /*#__PURE__*/React__default.default.createElement(octiconsReact.CheckCircleIcon, {
    className: "InlineMessageIcon"
  }),
  unavailable: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertIcon, {
    className: "InlineMessageIcon"
  })
};
const variantToSmallIcon = {
  warning: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  critical: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  success: /*#__PURE__*/React__default.default.createElement(octiconsReact.CheckCircleFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  unavailable: /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  })
};
function InlineMessage({
  children,
  size = 'medium',
  variant,
  ...rest
}) {
  const icon = size === 'small' ? variantToSmallIcon[variant] : variantToIcon[variant];
  return /*#__PURE__*/React__default.default.createElement(StyledMessage, _extends({}, rest, {
    "data-size": size,
    "data-variant": variant
  }), icon, children);
}
InlineMessage.displayName = "InlineMessage";

exports.InlineMessage = InlineMessage;
