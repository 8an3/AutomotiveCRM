import React from 'react';
import { AlertIcon } from '@primer/octicons-react';
import Box from '../Box/Box.js';
import StyledSpinner from '../Spinner/Spinner.js';
import { get } from '../constants.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { ItemContext, getVariantStyles, TEXT_ROW_HEIGHT } from './shared.js';
import { Tooltip } from '../TooltipV2/Tooltip.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LeadingVisualContainer = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "span",
    sx: merge({
      height: TEXT_ROW_HEIGHT,
      // match height of text row
      minWidth: get('space.3'),
      maxWidth: TEXT_ROW_HEIGHT,
      // square (same as height)
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      flexShrink: 0,
      marginRight: 2
    }, sx)
  }, props));
};
LeadingVisualContainer.displayName = "LeadingVisualContainer";
const LeadingVisual = ({
  sx = {},
  ...props
}) => {
  const {
    variant,
    disabled,
    inactive
  } = React.useContext(ItemContext);
  return /*#__PURE__*/React.createElement(LeadingVisualContainer, _extends({
    sx: merge({
      color: getVariantStyles(variant, disabled, inactive).iconColor,
      svg: {
        fontSize: 0
      },
      '[data-variant="danger"]:not([aria-disabled]):not([data-inactive]):hover &, [data-variant="danger"]:active &': {
        color: getVariantStyles(variant, disabled, inactive).hoverColor
      }
    }, sx)
  }, props), props.children);
};
LeadingVisual.displayName = "LeadingVisual";
const TrailingVisual = ({
  sx = {},
  ...props
}) => {
  const {
    variant,
    disabled,
    inactive
  } = React.useContext(ItemContext);
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "span",
    sx: merge({
      height: '20px',
      // match height of text row
      flexShrink: 0,
      color: getVariantStyles(variant, disabled, inactive).annotationColor,
      marginLeft: 2,
      fontWeight: 'initial',
      '[data-variant="danger"]:hover &, [data-variant="danger"]:active &': {
        color: getVariantStyles(variant, disabled, inactive).hoverColor
      }
    }, sx)
  }, props), props.children);
};
TrailingVisual.displayName = "TrailingVisual";
// VisualOrIndicator handles the positioning of indicators and determines whether to show a visual or an indicator.
//
// If we're showing an *inactive* or *loading* indicator and a leading visual has NOT been passed,
// replace the trailing visual with the inactive indicator.
//
// This preserves the left alignment of item text.
const VisualOrIndicator = ({
  children,
  labelId,
  loading,
  inactiveText,
  itemHasLeadingVisual,
  position
}) => {
  const VisualComponent = position === 'leading' ? LeadingVisual : TrailingVisual;
  if (!loading && !inactiveText) return children;
  if (itemHasLeadingVisual && position === 'trailing' ||
  // has a leading visual, and it's in the trailing position, or
  !itemHasLeadingVisual && position === 'leading' // it doesn't have a leading visual, and it's in the leading position
  ) {
    // => so we don't render the indicator here
    return children;
  }
  return inactiveText ? /*#__PURE__*/React.createElement(Tooltip, {
    text: inactiveText,
    type: "label"
  }, /*#__PURE__*/React.createElement(Box, {
    as: "button",
    sx: {
      background: 'none',
      color: 'inherit',
      border: 'none',
      padding: 0,
      font: 'inherit',
      cursor: 'pointer'
    },
    "aria-describedby": labelId
  }, /*#__PURE__*/React.createElement(VisualComponent, null, /*#__PURE__*/React.createElement(AlertIcon, null)))) : /*#__PURE__*/React.createElement(VisualComponent, null, /*#__PURE__*/React.createElement(StyledSpinner, {
    size: "small"
  }));
};

export { LeadingVisual, LeadingVisualContainer, TrailingVisual, VisualOrIndicator };
