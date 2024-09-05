'use strict';

var React = require('react');
var Box = require('../../Box/Box.js');
var IconButton = require('../../Button/IconButton.js');
require('../../Button/ButtonBase.js');
require('../../utils/defaultSxProp.js');
var Button = require('../../Button/Button.js');
var Tooltip = require('../../TooltipV2/Tooltip.js');
require('@styled-system/css');
var merge = require('deepmerge');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const invisibleButtonStyleOverrides = {
  paddingTop: '2px',
  paddingRight: '4px',
  paddingBottom: '2px',
  paddingLeft: '4px',
  position: 'relative',
  '&[data-component="IconButton"]': {
    width: 'var(--inner-action-size)',
    height: 'var(--inner-action-size)'
  },
  '@media (pointer: coarse)': {
    ':after': {
      content: '""',
      position: 'absolute',
      left: 0,
      right: 0,
      transform: 'translateY(-50%)',
      top: '50%',
      minHeight: '44px'
    }
  }
};
const ConditionalTooltip = ({
  'aria-label': ariaLabel,
  children,
  tooltipDirection
}) => /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, ariaLabel ? /*#__PURE__*/React__default.default.createElement(Tooltip.Tooltip, {
  text: ariaLabel,
  direction: tooltipDirection,
  sx: {
    /* inline-block is used to ensure the tooltip dimensions don't
       collapse when being used with `grid` or `inline` children */
    display: 'inline-block'
  }
}, children) : children);
const TextInputAction = /*#__PURE__*/React.forwardRef(({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  tooltipDirection,
  children,
  icon,
  sx: sxProp,
  variant = 'invisible',
  ...rest
}, forwardedRef) => {
  const sx = variant === 'invisible' ? merge__default.default(invisibleButtonStyleOverrides, sxProp || {}) : sxProp || {};
  if (icon && !ariaLabel || !children && !ariaLabel) {
    // eslint-disable-next-line no-console
    console.warn('Use the `aria-label` prop to provide an accessible label for assistive technology');
  }
  const accessibleLabel = ariaLabel ? {
    'aria-label': ariaLabel
  } : ariaLabelledBy ? {
    'aria-labelledby': ariaLabelledBy
  } : {
    'aria-label': ''
  };
  return /*#__PURE__*/React__default.default.createElement(Box, {
    as: "span",
    className: "TextInput-action",
    marginLeft: 1,
    marginRight: 1,
    lineHeight: "0"
  }, icon && !children && ariaLabel ? /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, _extends({}, accessibleLabel, {
    tooltipDirection: tooltipDirection !== null && tooltipDirection !== void 0 ? tooltipDirection : 's',
    variant: variant,
    type: "button",
    icon: icon,
    size: "small",
    sx: sx
  }, rest, {
    ref: forwardedRef
  })) : /*#__PURE__*/React__default.default.createElement(ConditionalTooltip, {
    "aria-label": ariaLabel
  }, /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
    variant: variant,
    type: "button",
    sx: sx
  }, rest, {
    ref: forwardedRef
  }), children)));
});

module.exports = TextInputAction;
