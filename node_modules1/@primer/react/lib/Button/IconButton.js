'use strict';

var React = require('react');
var ButtonBase = require('./ButtonBase.js');
var defaultSxProp = require('../utils/defaultSxProp.js');
var Button = require('./Button.js');
var Tooltip = require('../TooltipV2/Tooltip.js');
var Tooltip$1 = require('../Tooltip/Tooltip.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const IconButton = /*#__PURE__*/React.forwardRef(({
  sx: sxProp = defaultSxProp.defaultSxProp,
  icon: Icon,
  'aria-label': ariaLabel,
  description,
  disabled,
  tooltipDirection,
  // This is planned to be a temporary prop until the default tooltip on icon buttons are fully rolled out.
  unsafeDisableTooltip = false,
  keyshortcuts,
  ...props
}, forwardedRef) => {
  let sxStyles = sxProp;
  // grap the button props that have associated data attributes in the styles
  const {
    size
  } = props;
  if (sxProp !== null && Object.keys(sxProp).length > 0) {
    sxStyles = Button.generateCustomSxProp({
      size
    }, sxProp);
  }

  // If the icon button is already wrapped in a tooltip, do not add one.
  const {
    tooltipId
  } = React__default.default.useContext(Tooltip.TooltipContext); // Tooltip v2
  const {
    tooltipId: tooltipIdV1
  } = React__default.default.useContext(Tooltip$1.TooltipContext); // Tooltip v1

  const hasExternalTooltip = tooltipId || tooltipIdV1;
  const withoutTooltip = unsafeDisableTooltip || disabled || ariaLabel === undefined || ariaLabel === '' || hasExternalTooltip;
  if (withoutTooltip) {
    return /*#__PURE__*/React__default.default.createElement(ButtonBase.ButtonBase, _extends({
      icon: Icon,
      "data-component": "IconButton",
      sx: sxStyles,
      type: "button",
      "aria-label": ariaLabel,
      disabled: disabled
    }, props, {
      // @ts-expect-error StyledButton wants both Anchor and Button refs
      ref: forwardedRef
    }));
  } else {
    // Does it have keyshortcuts?
    const tooltipSuffix = keyshortcuts ? `, ${keyshortcuts}` : '';
    const tooltipText = description !== null && description !== void 0 ? description : ariaLabel;
    return /*#__PURE__*/React__default.default.createElement(Tooltip.Tooltip, {
      ref: forwardedRef,
      text: `${tooltipText}${tooltipSuffix}`,
      type: description ? undefined : 'label',
      direction: tooltipDirection
    }, /*#__PURE__*/React__default.default.createElement(ButtonBase.ButtonBase, _extends({
      icon: Icon,
      "data-component": "IconButton",
      sx: sxStyles,
      type: "button",
      "aria-keyshortcuts": keyshortcuts !== null && keyshortcuts !== void 0 ? keyshortcuts : undefined
      // If description is provided, we will use the tooltip to describe the button, so we need to keep the aria-label to label the button.
      ,
      "aria-label": description ? ariaLabel : undefined
    }, props)));
  }
});

exports.IconButton = IconButton;
