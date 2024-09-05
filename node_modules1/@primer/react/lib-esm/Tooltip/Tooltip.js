import clsx from 'clsx';
import React, { useMemo } from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';
import sx from '../sx.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useId } from '../hooks/useId.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

/* Tooltip v1 */

const TooltipBase = styled.span.withConfig({
  displayName: "Tooltip__TooltipBase",
  componentId: "sc-17tf59c-0"
})(["position:relative;display:inline-block;&::after{position:absolute;z-index:1000000;display:none;padding:0.5em 0.75em;font:normal normal 11px/1.5 ", ";-webkit-font-smoothing:subpixel-antialiased;color:", ";text-align:center;text-decoration:none;text-shadow:none;text-transform:none;letter-spacing:normal;word-wrap:break-word;white-space:pre;pointer-events:none;content:attr(aria-label);background:", ";border-radius:", ";opacity:0;}@keyframes tooltip-appear{from{opacity:0;}to{opacity:1;}}&:hover,&:active,&:focus,&:focus-within{&::after{display:inline-block;text-decoration:none;animation-name:tooltip-appear;animation-duration:0.1s;animation-fill-mode:forwards;animation-timing-function:ease-in;animation-delay:0s;}}&.tooltipped-no-delay:hover,&.tooltipped-no-delay:active,&.tooltipped-no-delay:focus,&.tooltipped-no-delay:focus-within{&::after{animation-delay:0s;}}&.tooltipped-multiline:hover,&.tooltipped-multiline:active,&.tooltipped-multiline:focus,&.tooltipped-multiline:focus-within{&::after{display:table-cell;}}&.tooltipped-s,&.tooltipped-se,&.tooltipped-sw{&::after{top:100%;right:50%;margin-top:6px;}}&.tooltipped-se{&::after{right:auto;left:50%;margin-left:-", ";}}&.tooltipped-sw::after{margin-right:-", ";}&.tooltipped-n,&.tooltipped-ne,&.tooltipped-nw{&::after{right:50%;bottom:100%;margin-bottom:6px;}}&.tooltipped-ne{&::after{right:auto;left:50%;margin-left:-", ";}}&.tooltipped-nw::after{margin-right:-", ";}&.tooltipped-s::after,&.tooltipped-n::after{transform:translateX(50%);}&.tooltipped-w{&::after{right:100%;bottom:50%;margin-right:6px;transform:translateY(50%);}}&.tooltipped-e{&::after{bottom:50%;left:100%;margin-left:6px;transform:translateY(50%);}}&.tooltipped-multiline{&::after{width:max-content;max-width:250px;word-wrap:break-word;white-space:pre-line;border-collapse:separate;}&.tooltipped-s::after,&.tooltipped-n::after{right:auto;left:50%;transform:translateX(-50%);}&.tooltipped-w::after,&.tooltipped-e::after{right:100%;}}&.tooltipped-align-right-2::after{right:0;margin-right:0;}&.tooltipped-align-left-2::after{left:0;margin-left:0;}", ";"], get('fonts.normal'), get('colors.fg.onEmphasis'), get('colors.neutral.emphasisPlus'), get('radii.2'), get('space.3'), get('space.3'), get('space.3'), get('space.3'), sx);
const TooltipContext = /*#__PURE__*/React.createContext({});
function Tooltip({
  direction = 'n',
  children,
  className,
  text,
  noDelay,
  align,
  wrap,
  id,
  ...rest
}) {
  const tooltipId = useId(id);
  const classes = clsx(className, `tooltipped-${direction}`, align && `tooltipped-align-${align}-2`, noDelay && 'tooltipped-no-delay', wrap && 'tooltipped-multiline');
  const value = useMemo(() => ({
    tooltipId
  }), [tooltipId]);
  return (
    /*#__PURE__*/
    // This provider is used to check if an icon button is wrapped with tooltip or not.
    React.createElement(TooltipContext.Provider, {
      value: value
    }, /*#__PURE__*/React.createElement(TooltipBase, _extends({
      role: "tooltip",
      "aria-label": text,
      id: tooltipId
    }, rest, {
      className: classes
    }), children))
  );
}
Tooltip.displayName = "Tooltip";
Tooltip.alignments = ['left', 'right'];
Tooltip.directions = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw'];

export { TooltipContext, Tooltip as default };
