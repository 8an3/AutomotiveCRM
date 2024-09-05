import React, { forwardRef } from 'react';
import { ButtonBase } from './ButtonBase.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { generateCustomSxProp } from './Button.js';
import { TooltipContext, Tooltip } from '../TooltipV2/Tooltip.js';
import { TooltipContext as TooltipContext$1 } from '../Tooltip/Tooltip.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const IconButton = /*#__PURE__*/forwardRef(({
  sx: sxProp = defaultSxProp,
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
    sxStyles = generateCustomSxProp({
      size
    }, sxProp);
  }

  // If the icon button is already wrapped in a tooltip, do not add one.
  const {
    tooltipId
  } = React.useContext(TooltipContext); // Tooltip v2
  const {
    tooltipId: tooltipIdV1
  } = React.useContext(TooltipContext$1); // Tooltip v1

  const hasExternalTooltip = tooltipId || tooltipIdV1;
  const withoutTooltip = unsafeDisableTooltip || disabled || ariaLabel === undefined || ariaLabel === '' || hasExternalTooltip;
  if (withoutTooltip) {
    return /*#__PURE__*/React.createElement(ButtonBase, _extends({
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
    return /*#__PURE__*/React.createElement(Tooltip, {
      ref: forwardedRef,
      text: `${tooltipText}${tooltipSuffix}`,
      type: description ? undefined : 'label',
      direction: tooltipDirection
    }, /*#__PURE__*/React.createElement(ButtonBase, _extends({
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

export { IconButton };
