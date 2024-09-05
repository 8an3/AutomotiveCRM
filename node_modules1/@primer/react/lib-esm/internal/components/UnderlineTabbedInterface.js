import React, { forwardRef } from 'react';
import { isElement } from 'react-is';
import styled, { keyframes } from 'styled-components';
import CounterLabel from '../../CounterLabel/CounterLabel.js';
import sx from '../../sx.js';
import { defaultSxProp } from '../../utils/defaultSxProp.js';
import { get } from '../../constants.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// The gap between the list items. It is a constant because the gap is used to calculate the possible number of items that can fit in the container.
const GAP = 8;
const StyledUnderlineWrapper = styled.div.withConfig({
  displayName: "UnderlineTabbedInterface__StyledUnderlineWrapper",
  componentId: "sc-4ilrg0-0"
})(["display:flex;padding-inline:var(--stack-padding-normal,", ");justify-content:flex-start;align-items:center;min-height:var(--control-xlarge-size,48px);box-shadow:inset 0px -1px var(--borderColor-muted,", ");", ";"], get('space.3'), get('colors.border.muted'), sx);
const StyledUnderlineItemList = styled.ul.withConfig({
  displayName: "UnderlineTabbedInterface__StyledUnderlineItemList",
  componentId: "sc-4ilrg0-1"
})(["display:flex;list-style:none;white-space:nowrap;padding:0;margin:0;align-items:center;gap:", "px;position:relative;"], GAP);
const StyledUnderlineItem = styled.div.withConfig({
  displayName: "UnderlineTabbedInterface__StyledUnderlineItem",
  componentId: "sc-4ilrg0-2"
})(["appearance:none;background-color:transparent;border:0;cursor:pointer;font:inherit;position:relative;display:inline-flex;color:", ";text-align:center;text-decoration:none;line-height:var(--text-body-lineHeight-medium,1.4285);border-radius:var(--borderRadius-medium,", ");font-size:var(--text-body-size-medium,", ");padding-inline:var(--control-medium-paddingInline-condensed,", ");padding-block:var(--control-medium-paddingBlock,6px);align-items:center;@media (hover:hover){&:hover{background-color:var(--bgColor-neutral-muted,", ");transition:background 0.12s ease-out;text-decoration:none;}}&:focus:{outline:2px solid transparent;box-shadow:inset 0 0 0 2px var(--fgColor-accent,", ");&:not(:focus-visible){box-shadow:none;}}&:focus-visible{outline:2px solid transparent;box-shadow:inset 0 0 0 2px var(--fgColor-accent,", ");}[data-content]::before{content:attr(data-content);display:block;height:0;font-weight:var(--base-text-weight-semibold,", ");visibility:hidden;white-space:nowrap;}[data-component='icon']{color:var(--fgColor-muted,", ");align-items:center;display:inline-flex;margin-inline-end:var(--control-medium-gap,", ");}[data-component='counter']{margin-inline-start:var(--control-medium-gap,", ");display:flex;align-items:center;}&::after{position:absolute;right:50%;bottom:calc(50% - calc(var(--control-xlarge-size,48px) / 2 + 1px));width:100%;height:2px;content:'';background-color:transparent;border-radius:0;transform:translate(50%,-50%);}&[aria-current]:not([aria-current='false']),&[aria-selected='true']{[data-component='text']{font-weight:var(--base-text-weight-semibold,", ");}&::after{background-color:var(--underlineNav-borderColor-active,var(--color-primer-border-active,#fd8c73));}}@media (forced-colors:active){&[aria-current]:not([aria-current='false']),&[aria-selected='true']{::after{background-color:LinkText;}}}", ";"], get('colors.fg.default'), get('radii.2'), get('fontSizes.1'), get('space.2'), get('colors.neutral.subtle'), get('colors.accent.fg'), get('colors.accent.fg'), get('fontWeights.semibold'), get('colors.fg.muted'), get('space.2'), get('space.2'), get('fontWeights.semibold'), sx);
const loadingKeyframes = keyframes(["from{opacity:1;}to{opacity:0.2;}"]);
const LoadingCounter = styled.span.withConfig({
  displayName: "UnderlineTabbedInterface__LoadingCounter",
  componentId: "sc-4ilrg0-3"
})(["animation:", " 1.2s ease-in-out infinite alternate;background-color:var(--bgColor-neutral-muted,", ");border-color:var(--borderColor-default,", ");width:1.5rem;height:1rem;display:inline-block;border-radius:20px;"], loadingKeyframes, get('colors.neutral.subtle'), get('colors.border.default'));

// We can uncomment these when/if we add overflow behavior
// to the UnderlinePanels component
//
// export const StyledMoreButton = styled(Button)`
//   margin: 0;
//   border: 0;
//   background: transparent;
//   font-weight: normal;
//   box-shadow: none;
//   padding-block: var(--control-small-paddingBlock);
//   padding-inline: var(--control-small-paddingInline-condensed);

//   > span[data-component='trailingVisual'] {
//     margin-left: 0;
//   }
// `

// export const StyledOverflowDivider = styled.span`
//   display: inline-block;
//   border-left: 1px solid var(--borderColor-muted);
//   width: 1px;
//   margin-right: var(--control-xsmall-gap);
//   /* The height of the divider - reference from Figma */
//   height: 24px;
// `

// export const StyledMoreMenuListItem = styled.li`
//   display: flex;
//   align-items: center;
//   height: 45px;
// `

const UnderlineItem = /*#__PURE__*/forwardRef(({
  as = 'a',
  children,
  counter,
  icon: Icon,
  iconsVisible,
  loadingCounters,
  sx: sxProp = defaultSxProp,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(StyledUnderlineItem, _extends({
    ref: forwardedRef,
    as: as,
    sx: sxProp
  }, rest), iconsVisible && Icon && /*#__PURE__*/React.createElement("span", {
    "data-component": "icon"
  }, isElement(Icon) ? Icon : /*#__PURE__*/React.createElement(Icon, null)), children && /*#__PURE__*/React.createElement("span", {
    "data-component": "text",
    "data-content": children
  }, children), loadingCounters ? /*#__PURE__*/React.createElement("span", {
    "data-component": "counter"
  }, /*#__PURE__*/React.createElement(LoadingCounter, null)) : counter !== undefined && /*#__PURE__*/React.createElement("span", {
    "data-component": "counter"
  }, /*#__PURE__*/React.createElement(CounterLabel, null, counter)));
});

export { GAP, LoadingCounter, StyledUnderlineItem, StyledUnderlineItemList, StyledUnderlineWrapper, UnderlineItem };
