import clsx from 'clsx';
import React, { useEffect } from 'react';
import styled from 'styled-components';
import { XIcon, StopIcon, InfoIcon, CheckCircleIcon, AlertIcon } from '@primer/octicons-react';
import { IconButton } from '../Button/IconButton.js';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import { ButtonComponent } from '../Button/Button.js';
import { get } from '../constants.js';
import { VisuallyHidden } from '../internal/components/VisuallyHidden.js';
import { useMergedRefs } from '../internal/hooks/useMergedRefs.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const iconForVariant = {
  critical: /*#__PURE__*/React.createElement(StopIcon, null),
  info: /*#__PURE__*/React.createElement(InfoIcon, null),
  success: /*#__PURE__*/React.createElement(CheckCircleIcon, null),
  upsell: /*#__PURE__*/React.createElement(InfoIcon, null),
  warning: /*#__PURE__*/React.createElement(AlertIcon, null)
};
const labels = {
  critical: 'Critical',
  info: 'Information',
  success: 'Success',
  upsell: 'Recommendation',
  warning: 'Warning'
};
const Banner = /*#__PURE__*/React.forwardRef(function Banner({
  'aria-label': label,
  children,
  description,
  hideTitle,
  icon,
  onDismiss,
  primaryAction,
  secondaryAction,
  title,
  variant = 'info',
  ...rest
}, forwardRef) {
  const dismissible = variant !== 'critical' && onDismiss;
  const hasActions = primaryAction || secondaryAction;
  const bannerRef = React.useRef(null);
  const ref = useMergedRefs(forwardRef, bannerRef);
  if (process.env.NODE_ENV !== "production") {
    // This hook is called consistently depending on the environment
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (title) {
        return;
      }
      const {
        current: banner
      } = bannerRef;
      if (!banner) {
        return;
      }
      const hasTitle = banner.querySelector('[data-banner-title]');
      if (!hasTitle) {
        throw new Error('Expected a title to be provided to the <Banner> component with the `title` prop or through `<Banner.Title>` but no title was found');
      }
    }, [title]);
  }
  return /*#__PURE__*/React.createElement(StyledBanner, _extends({}, rest, {
    "aria-label": label !== null && label !== void 0 ? label : labels[variant],
    as: "section",
    "data-dismissible": onDismiss ? '' : undefined,
    "data-title-hidden": hideTitle ? '' : undefined,
    "data-variant": variant,
    tabIndex: -1,
    ref: ref
  }), /*#__PURE__*/React.createElement("style", null, BannerContainerQuery), /*#__PURE__*/React.createElement("div", {
    className: "BannerIcon"
  }, icon && variant === 'info' ? icon : iconForVariant[variant]), /*#__PURE__*/React.createElement("div", {
    className: "BannerContainer"
  }, /*#__PURE__*/React.createElement("div", {
    className: "BannerContent"
  }, title ? hideTitle ? /*#__PURE__*/React.createElement(VisuallyHidden, null, /*#__PURE__*/React.createElement(BannerTitle, null, title)) : /*#__PURE__*/React.createElement(BannerTitle, null, title) : null, description ? /*#__PURE__*/React.createElement(BannerDescription, null, description) : null, children), hasActions ? /*#__PURE__*/React.createElement(BannerActions, {
    primaryAction: primaryAction,
    secondaryAction: secondaryAction
  }) : null), dismissible ? /*#__PURE__*/React.createElement(IconButton, {
    "aria-label": "Dismiss banner",
    onClick: onDismiss,
    className: "BannerDismiss",
    icon: XIcon,
    variant: "invisible"
  }) : null);
});

/**
 * For styling, it's important that the icons and the text have the same height
 * for alignment to occur in multi-line scenarios. Currently, we use a
 * line-height of `20px` so that means that the height of icons should match
 * that value.
 */
const StyledBanner = styled.div.withConfig({
  displayName: "Banner__StyledBanner",
  componentId: "sc-1n1s78v-0"
})(["display:grid;grid-template-columns:auto minmax(0,1fr) auto;align-items:start;background-color:var(--banner-bgColor);border:var(--borderWidth-thin,1px) solid var(--banner-borderColor);padding:var(--base-size-8,0.5rem);border-radius:var(--borderRadius-medium,", ");@supports (container-type:inline-size){container:banner / inline-size;}&[data-variant='critical']{--banner-bgColor:", ";--banner-borderColor:", ";--banner-icon-fgColor:", ";}&[data-variant='info']{--banner-bgColor:", ";--banner-borderColor:", ";--banner-icon-fgColor:", ";}&[data-variant='success']{--banner-bgColor:", ";--banner-borderColor:", ";--banner-icon-fgColor:", ";}&[data-variant='upsell']{--banner-bgColor:var(--bgColor-upsell-muted,", ");--banner-borderColor:var(--borderColor-upsell-muted,", ");--banner-icon-fgColor:var(--fgColor-upsell-muted,", ");}&[data-variant='warning']{--banner-bgColor:", ";--banner-borderColor:", ";--banner-icon-fgColor:", ";}.BannerIcon{display:grid;place-items:center;padding:var(--base-size-8,0.5rem);}.BannerIcon svg{color:var(--banner-icon-fgColor);fill:var(--banner-icon-fgColor);height:var(--base-size-20,1.25rem);}&[data-title-hidden=''] .BannerIcon svg{height:var(--base-size-16,1rem);}.BannerContainer{font-size:var(--text-body-size-medium,0.875rem);align-items:start;line-height:var(--text-body-lineHeight-medium,calc(20 / 14));row-gap:var(--base-size-4,0.25rem);column-gap:var(--base-size-4,0.25rem);}& :where(.BannerContainer){display:flex;flex-wrap:wrap;justify-content:space-between;}&[data-dismissible] .BannerContainer{display:grid;grid-template-columns:auto;grid-template-rows:auto;}.BannerContent{display:grid;row-gap:var(--base-size-4,0.25rem);grid-column-start:1;margin-block:var(--base-size-8,0.5rem);}&[data-title-hidden=''] .BannerContent{margin-block:var(--base-size-6,0.375rem);}@media screen and (min-width:544px){.BannerContent{flex:1 1 0%;}}.BannerTitle{margin:0;font-size:inherit;font-weight:var(--base-text-weight-semibold,600);}.BannerActionsContainer{display:flex;column-gap:var(--base-size-8,0.5rem);align-items:center;}.BannerActions :where([data-primary-action='trailing']){display:none;}@media screen and (min-width:544px){.BannerActions :where([data-primary-action='trailing']){display:flex;}.BannerActions :where([data-primary-action='leading']){display:none;}}&[data-dismissible] .BannerActions{margin-block-end:var(--size-small,0.375rem);}&[data-dismissible] .BannerActionsContainer[data-primary-action='trailing']{display:none;}&[data-dismissible] .BannerActionsContainer[data-primary-action='leading']{display:flex;}.BannerDismiss{display:grid;place-items:center;padding:var(--base-size-8,0.5rem);margin-inline-start:var(--base-size-4,0.25rem);}.BannerDismiss svg{color:var(--banner-icon-fgColor);}"], get('radii.2'), get('colors.danger.subtle'), get('colors.danger.muted'), get('colors.danger.fg'), get('colors.accent.subtle'), get('colors.accent.muted'), get('colors.accent.fg'), get('colors.success.subtle'), get('colors.success.muted'), get('colors.success.fg'), get('colors.done.subtle'), get('colors.done.muted'), get('colors.done.fg'), get('colors.attention.subtle'), get('colors.attention.muted'), get('colors.attention.fg'));
const BannerContainerQuery = `
  @container banner (max-width: 500px) {
    .BannerContainer {
      display: grid;
      grid-template-rows: auto auto;
    }

    .BannerActions {
      margin-block-end: var(--size-small, 0.375rem);
    }

    .BannerActions [data-primary-action="trailing"] {
      display: none;
    }

    .BannerActions [data-primary-action="leading"] {
      display: flex;
    }
  }

  @container banner (min-width: 500px) {
    .BannerContainer {
      display: grid;
      grid-template-columns: auto auto;
    }

    .BannerActions [data-primary-action="trailing"] {
      display: flex;
    }

    .BannerActions [data-primary-action="leading"] {
      display: none;
    }
  }
`;
function BannerTitle(props) {
  const {
    as: Heading = 'h2',
    className,
    children,
    ...rest
  } = props;
  return /*#__PURE__*/React.createElement(Heading, _extends({}, rest, {
    className: clsx('BannerTitle', className),
    "data-banner-title": ""
  }), children);
}
BannerTitle.displayName = "BannerTitle";
function BannerDescription({
  children,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("div", _extends({}, rest, {
    className: clsx('BannerDescription', className)
  }), children);
}
BannerDescription.displayName = "BannerDescription";
function BannerActions({
  primaryAction,
  secondaryAction
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "BannerActions"
  }, /*#__PURE__*/React.createElement("div", {
    className: "BannerActionsContainer",
    "data-primary-action": "trailing"
  }, secondaryAction !== null && secondaryAction !== void 0 ? secondaryAction : null, primaryAction !== null && primaryAction !== void 0 ? primaryAction : null), /*#__PURE__*/React.createElement("div", {
    className: "BannerActionsContainer",
    "data-primary-action": "leading"
  }, primaryAction !== null && primaryAction !== void 0 ? primaryAction : null, secondaryAction !== null && secondaryAction !== void 0 ? secondaryAction : null));
}
BannerActions.displayName = "BannerActions";
function BannerPrimaryAction({
  children,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(ButtonComponent, _extends({
    className: clsx('BannerPrimaryAction', className),
    variant: "default"
  }, rest), children);
}
BannerPrimaryAction.displayName = "BannerPrimaryAction";
function BannerSecondaryAction({
  children,
  className,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(ButtonComponent, _extends({
    className: clsx('BannerPrimaryAction', className),
    variant: "invisible"
  }, rest), children);
}
BannerSecondaryAction.displayName = "BannerSecondaryAction";

export { Banner, BannerActions, BannerDescription, BannerPrimaryAction, BannerSecondaryAction, BannerTitle };
