import { AlertIcon, CheckCircleIcon, AlertFillIcon, CheckCircleFillIcon } from '@primer/octicons-react';
import React from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledMessage = styled.div.withConfig({
  displayName: "InlineMessage__StyledMessage",
  componentId: "sc-13z0tw8-0"
})(["display:grid;column-gap:0.5rem;grid-template-columns:auto 1fr;align-items:start;color:var(--inline-message-fgColor,", ");line-height:var(--inline-message-lineHeight);font-size:var(--inline-message-fontSize,", ");&[data-size='small']{--inline-message-fontSize:var(--text-body-size-small,", ");--inline-message-lineHeight:var(--text-body-lineHeight-small,1.6666);}&[data-size='medium']{--inline-message-fontSize:var(--text-body-size-medium,", ");--inline-message-lineHeight:var(--text-body-lineHeight-medium,1.4285);}&[data-variant='warning']{--inline-message-fgColor:", ";}&[data-variant='critical']{--inline-message-fgColor:", ";}&[data-variant='success']{--inline-message-fgColor:", ";}&[data-variant='unavailable']{--inline-message-fgColor:", ";}& .InlineMessageIcon{min-height:calc(var(--inline-message-lineHeight) * var(--inline-message-fontSize));}"], get('colors.neutral.emphasis'), get('fontSizes.1'), get('fontSizes.0'), get('fontSizes.1'), get('colors.attention.fg'), get('colors.danger.fg'), get('colors.success.fg'), get('colors.neutral.emphasis'));
const variantToIcon = {
  warning: /*#__PURE__*/React.createElement(AlertIcon, {
    className: "InlineMessageIcon"
  }),
  critical: /*#__PURE__*/React.createElement(AlertIcon, {
    className: "InlineMessageIcon"
  }),
  success: /*#__PURE__*/React.createElement(CheckCircleIcon, {
    className: "InlineMessageIcon"
  }),
  unavailable: /*#__PURE__*/React.createElement(AlertIcon, {
    className: "InlineMessageIcon"
  })
};
const variantToSmallIcon = {
  warning: /*#__PURE__*/React.createElement(AlertFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  critical: /*#__PURE__*/React.createElement(AlertFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  success: /*#__PURE__*/React.createElement(CheckCircleFillIcon, {
    className: "InlineMessageIcon",
    size: 12
  }),
  unavailable: /*#__PURE__*/React.createElement(AlertFillIcon, {
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
  return /*#__PURE__*/React.createElement(StyledMessage, _extends({}, rest, {
    "data-size": size,
    "data-variant": variant
  }), icon, children);
}
InlineMessage.displayName = "InlineMessage";

export { InlineMessage };
