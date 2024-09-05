import React from 'react';
import Box from '../Box/Box.js';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import { ButtonComponent } from '../Button/Button.js';
import '../TooltipV2/Tooltip.js';
import '../Tooltip/Tooltip.js';
import Link from '../Link/Link.js';
import { get } from '../constants.js';
import styled from 'styled-components';

const StyledBlankslate = styled.div.withConfig({
  displayName: "Blankslate__StyledBlankslate",
  componentId: "sc-4802l5-0"
})(["container-type:inline-size;.Blankslate{--blankslate-outer-padding-block:var(--base-size-32,2rem);--blankslate-outer-padding-inline:var(--base-size-32,2rem);display:grid;justify-items:center;padding:var(--blankslate-outer-padding-block) var(--blankslate-outer-padding-inline);}.Blankslate[data-spacious='true']{--blankslate-outer-padding-block:var(--base-size-80,5rem);--blankslate-outer-padding-inline:var(--base-size-40,2.5rem);}.Blankslate[data-border='true']{border:var(--borderWidth-thin) solid var(--borderColor-default,", ");border-radius:var(--borderRadius-medium);}.Blankslate[data-narrow='true']{margin:0 auto;max-width:485px;}.Blankslate-Heading,.Blankslate-Description{margin:0;margin-bottom:var(--stack-gap-condensed,0.5rem);}.Blankslate-Heading{font-size:var(--text-title-size-medium,1.25rem);font-weight:var(--text-title-weight-medium,600);}.Blankslate-Description{color:var(--fgColor-muted,", ");font-size:var(--text-body-size-large,1rem);line-height:var(--text-body-lineHeight-large,1.5);}.Blankslate-Action{margin-top:var(--stack-gap-normal,1rem);}.Blankslate-Action:first-of-type{margin-top:var(--stack-gap-spacious,1.5rem);}.Blankslate-Action:last-of-type{margin-bottom:var(--stack-gap-condensed,0.5rem);}"], get('colors.border.default'), get('colors.fg.muted'));
const BlankslateContainerQuery = `
  /* At the time these styles were written,
  34rem was our "small" breakpoint width */
  @container (max-width: 34rem) {
    ${StyledBlankslate} .Blankslate {
    --blankslate-outer-padding-block: var(--base-size-20);
    --blankslate-outer-padding-inline: var(--base-size-20);
  }

  ${StyledBlankslate} .Blankslate[data-spacious='true'] {
    --blankslate-outer-padding-block: var(--base-size-44);
    --blankslate-outer-padding-inline: var(--base-size-28);
  }

  ${StyledBlankslate} .Blankslate-Visual {
    margin-bottom: var(--stack-gap-condensed, 0.5rem);
    max-width: var(--base-size-24);
  }

  ${StyledBlankslate} .Blankslate-Visual svg {
    width: 100%;
  }

  ${StyledBlankslate} .Blankslate-Heading {
    font-size: var(--text-title-size-small);
  }

  ${StyledBlankslate} .Blankslate-Description {
    font-size: var(--text-body-size-medium);
  }

  ${StyledBlankslate} .Blankslate-Action {
    margin-top: var(--stack-gap-condensed, 0.5rem);
  }

  ${StyledBlankslate} .Blankslate-Action:first-of-type {
    margin-top: var(--stack-gap-normal, 1rem);
  }

  ${StyledBlankslate} .Blankslate-Action:last-of-type {
    margin-bottom: calc(var(--stack-gap-condensed, 0.5rem) / 2);
  }
`;
function Blankslate({
  border,
  children,
  narrow,
  spacious
}) {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("style", {
    type: "text/css",
    dangerouslySetInnerHTML: {
      __html: BlankslateContainerQuery
    }
  }), /*#__PURE__*/React.createElement(StyledBlankslate, null, /*#__PURE__*/React.createElement("div", {
    className: "Blankslate",
    "data-border": border,
    "data-narrow": narrow,
    "data-spacious": spacious
  }, children)));
}
function Visual({
  children
}) {
  return /*#__PURE__*/React.createElement("span", {
    className: "Blankslate-Visual"
  }, children);
}
Visual.displayName = "Visual";
function Heading({
  as = 'h2',
  children
}) {
  return /*#__PURE__*/React.createElement(Box, {
    as: as,
    className: "Blankslate-Heading"
  }, children);
}
Heading.displayName = "Heading";
function Description({
  children
}) {
  return /*#__PURE__*/React.createElement("p", {
    className: "Blankslate-Description"
  }, children);
}
Description.displayName = "Description";
function PrimaryAction({
  children,
  href
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "Blankslate-Action"
  }, /*#__PURE__*/React.createElement(ButtonComponent, {
    as: "a",
    href: href,
    variant: "primary"
  }, children));
}
PrimaryAction.displayName = "PrimaryAction";
function SecondaryAction({
  children,
  href
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "Blankslate-Action"
  }, /*#__PURE__*/React.createElement(Link, {
    href: href
  }, children));
}
SecondaryAction.displayName = "SecondaryAction";
var Blankslate$1 = Object.assign(Blankslate, {
  Visual,
  Heading,
  Description,
  PrimaryAction,
  SecondaryAction
});

export { Blankslate$1 as default };
