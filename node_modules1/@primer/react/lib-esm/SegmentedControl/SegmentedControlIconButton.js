import React from 'react';
import styled from 'styled-components';
import sx from '../sx.js';
import { getSegmentedControlListItemStyles, getSegmentedControlButtonStyles } from './getSegmentedControlStyles.js';
import Box from '../Box/Box.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const SegmentedControlIconButtonStyled = styled.button.withConfig({
  displayName: "SegmentedControlIconButton__SegmentedControlIconButtonStyled",
  componentId: "sc-oxh6a9-0"
})(["", ";"], sx);

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
  sx: sxProp = defaultSxProp,
  ...rest
}) => {
  const mergedSx = merge({
    width: '32px',
    // TODO: use primitive `control.medium.size` when it is available
    ...getSegmentedControlListItemStyles()
  }, sxProp);
  return /*#__PURE__*/React.createElement(Box, {
    as: "li",
    sx: mergedSx
  }, /*#__PURE__*/React.createElement(SegmentedControlIconButtonStyled, _extends({
    "aria-label": ariaLabel,
    "aria-current": selected,
    sx: getSegmentedControlButtonStyles({
      selected,
      isIconOnly: true
    })
  }, rest), /*#__PURE__*/React.createElement("span", {
    className: "segmentedControl-content"
  }, /*#__PURE__*/React.createElement(Icon, null))));
};
SegmentedControlIconButton.displayName = "SegmentedControlIconButton";

export { SegmentedControlIconButton, SegmentedControlIconButton as default };
