'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var sx = require('../sx.js');
var getSegmentedControlStyles = require('./getSegmentedControlStyles.js');
var Box = require('../Box/Box.js');
var defaultSxProp = require('../utils/defaultSxProp.js');
var merge = require('deepmerge');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SegmentedControlIconButtonStyled = styled__default.default.button.withConfig({
  displayName: "SegmentedControlIconButton__SegmentedControlIconButtonStyled",
  componentId: "sc-oxh6a9-0"
})(["", ";"], sx.default);

// TODO: update this component to be accessible when we update the Tooltip component
// - we wouldn't render tooltip content inside a pseudoelement
// - users can pass custom tooltip text in addition to `ariaLabel`
//
// See Slack thread: https://github.slack.com/archives/C02NUUQ9C30/p1656444474509599
//
const SegmentedControlIconButton = ({
  'aria-label': ariaLabel,
  icon: Icon,
  selected,
  sx: sxProp = defaultSxProp.defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge__default.default({
    width: '32px',
    // TODO: use primitive `control.medium.size` when it is available
    ...getSegmentedControlStyles.getSegmentedControlListItemStyles()
  }, sxProp);
  return /*#__PURE__*/React__default.default.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React__default.default.createElement(SegmentedControlIconButtonStyled, _extends({
    "aria-label": ariaLabel,
    "aria-current": selected,
    sx: getSegmentedControlStyles.getSegmentedControlButtonStyles({
      selected,
      isIconOnly: true
    })
  }, rest), /*#__PURE__*/React__default.default.createElement("span", {
    className: "segmentedControl-content"
  }, /*#__PURE__*/React__default.default.createElement(Icon, null))));
};
SegmentedControlIconButton.displayName = "SegmentedControlIconButton";

exports.SegmentedControlIconButton = SegmentedControlIconButton;
exports.default = SegmentedControlIconButton;
