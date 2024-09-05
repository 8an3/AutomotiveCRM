'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var Box = require('../Box/Box.js');
var Spinner = require('../Spinner/Spinner.js');
var constants = require('../constants.js');
require('@styled-system/css');
var merge = require('deepmerge');
var shared = require('./shared.js');
var Tooltip = require('../TooltipV2/Tooltip.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LeadingVisualContainer = ({
  sx = {},
  ...props
}) => {
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({
    as: "span",
    sx: merge__default.default({
      height: shared.TEXT_ROW_HEIGHT,
      // match height of text row
      minWidth: constants.get('space.3'),
      maxWidth: shared.TEXT_ROW_HEIGHT,
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
  } = React__default.default.useContext(shared.ItemContext);
  return /*#__PURE__*/React__default.default.createElement(LeadingVisualContainer, _extends({
    sx: merge__default.default({
      color: shared.getVariantStyles(variant, disabled, inactive).iconColor,
      svg: {
        fontSize: 0
      },
      '[data-variant="danger"]:not([aria-disabled]):not([data-inactive]):hover &, [data-variant="danger"]:active &': {
        color: shared.getVariantStyles(variant, disabled, inactive).hoverColor
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
  } = React__default.default.useContext(shared.ItemContext);
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({
    as: "span",
    sx: merge__default.default({
      height: '20px',
      // match height of text row
      flexShrink: 0,
      color: shared.getVariantStyles(variant, disabled, inactive).annotationColor,
      marginLeft: 2,
      fontWeight: 'initial',
      '[data-variant="danger"]:hover &, [data-variant="danger"]:active &': {
        color: shared.getVariantStyles(variant, disabled, inactive).hoverColor
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
  return inactiveText ? /*#__PURE__*/React__default.default.createElement(Tooltip.Tooltip, {
    text: inactiveText,
    type: "label"
  }, /*#__PURE__*/React__default.default.createElement(Box, {
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
  }, /*#__PURE__*/React__default.default.createElement(VisualComponent, null, /*#__PURE__*/React__default.default.createElement(octiconsReact.AlertIcon, null)))) : /*#__PURE__*/React__default.default.createElement(VisualComponent, null, /*#__PURE__*/React__default.default.createElement(Spinner, {
    size: "small"
  }));
};

exports.LeadingVisual = LeadingVisual;
exports.LeadingVisualContainer = LeadingVisualContainer;
exports.TrailingVisual = TrailingVisual;
exports.VisualOrIndicator = VisualOrIndicator;
