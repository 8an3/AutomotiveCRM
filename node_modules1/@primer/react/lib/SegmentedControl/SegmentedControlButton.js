'use strict';

var React = require('react');
var styled = require('styled-components');
var Box = require('../Box/Box.js');
var sx = require('../sx.js');
var getSegmentedControlStyles = require('./getSegmentedControlStyles.js');
var defaultSxProp = require('../utils/defaultSxProp.js');
var merge = require('deepmerge');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SegmentedControlButtonStyled = styled__default.default.button.withConfig({
  displayName: "SegmentedControlButton__SegmentedControlButtonStyled",
  componentId: "sc-8lkgxl-0"
})(["", ";"], sx.default);
const SegmentedControlButton = ({
  children,
  leadingIcon: LeadingIcon,
  selected,
  sx: sxProp = defaultSxProp.defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge__default.default(getSegmentedControlStyles.getSegmentedControlListItemStyles(), sxProp);
  return /*#__PURE__*/React__default.default.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React__default.default.createElement(SegmentedControlButtonStyled, _extends({
    "aria-current": selected,
    sx: getSegmentedControlStyles.getSegmentedControlButtonStyles({
      selected,
      children
    }),
    type: "button"
  }, rest), /*#__PURE__*/React__default.default.createElement("span", {
    className: "segmentedControl-content"
  }, LeadingIcon && /*#__PURE__*/React__default.default.createElement(Box, {
    mr: 1
  }, /*#__PURE__*/React__default.default.createElement(LeadingIcon, null)), /*#__PURE__*/React__default.default.createElement(Box, {
    className: "segmentedControl-text"
  }, children))));
};
SegmentedControlButton.displayName = "SegmentedControlButton";

module.exports = SegmentedControlButton;
