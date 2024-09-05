import React, { forwardRef, useMemo } from 'react';
import Box from '../Box/Box.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { useTheme } from '../ThemeProvider.js';
import { StyledButton } from './types.js';
import { getButtonStyles, getVariantStyles, getAlignContentSize } from './styles.js';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { VisuallyHidden } from '../internal/components/VisuallyHidden.js';
import StyledSpinner from '../Spinner/Spinner.js';
import CounterLabel from '../CounterLabel/CounterLabel.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useId } from '../hooks/useId.js';
import { ConditionalWrapper } from '../internal/components/ConditionalWrapper.js';
import '../live-region/Announce.js';
import '../live-region/AriaAlert.js';
import { AriaStatus } from '../live-region/AriaStatus.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const iconWrapStyles = {
  display: 'flex',
  pointerEvents: 'none'
};
const renderVisual = (Visual, loading, visualName) => /*#__PURE__*/React.createElement(Box, {
  as: "span",
  "data-component": visualName,
  sx: {
    ...iconWrapStyles
  }
}, loading ? /*#__PURE__*/React.createElement(StyledSpinner, {
  size: "small"
}) : /*#__PURE__*/React.createElement(Visual, null));
renderVisual.displayName = "renderVisual";
const ButtonBase = /*#__PURE__*/forwardRef(({
  children,
  as: Component = 'button',
  sx: sxProp = defaultSxProp,
  ...props
}, forwardedRef) => {
  const {
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual,
    trailingAction: TrailingAction,
    ['aria-describedby']: ariaDescribedBy,
    ['aria-labelledby']: ariaLabelledBy,
    count,
    icon: Icon,
    id,
    variant = 'default',
    size = 'medium',
    alignContent = 'center',
    block = false,
    loading,
    loadingAnnouncement = 'Loading',
    inactive,
    onClick,
    labelWrap,
    ...rest
  } = props;
  const innerRef = React.useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, innerRef);
  const {
    theme
  } = useTheme();
  const baseStyles = useMemo(() => {
    return merge.all([getButtonStyles(theme), getVariantStyles(variant, theme)]);
  }, [theme, variant]);
  const sxStyles = useMemo(() => {
    return merge(baseStyles, sxProp);
  }, [baseStyles, sxProp]);
  const uuid = useId(id);
  const loadingAnnouncementID = `${uuid}-loading-announcement`;
  if (process.env.NODE_ENV !== "production") {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React.useEffect(() => {
      if (innerRef.current && !(innerRef.current instanceof HTMLButtonElement) && !(innerRef.current instanceof HTMLAnchorElement)) {
        // eslint-disable-next-line no-console
        console.warn('This component should be an instanceof a semantic button or anchor');
      }
    }, [innerRef]);
  }
  return /*#__PURE__*/React.createElement(ConditionalWrapper
  // If anything is passsed to `loading`, we need the wrapper:
  // If we just checked for `loading` as a boolean, the wrapper wouldn't be rendered
  // when `loading` is `false`.
  // Then, the component re-renders in a way that the button will lose focus when switching between loading states.
  , {
    if: typeof loading !== 'undefined',
    sx: {
      display: block ? 'block' : 'inline-block'
    },
    "data-loading-wrapper": true
  }, /*#__PURE__*/React.createElement(StyledButton, _extends({
    as: Component,
    sx: sxStyles,
    "aria-disabled": loading ? true : undefined
  }, rest, {
    ref: innerRef,
    "data-block": block ? 'block' : null,
    "data-inactive": inactive ? true : undefined,
    "data-loading": Boolean(loading),
    "data-no-visuals": !LeadingVisual && !TrailingVisual && !TrailingAction ? true : undefined,
    "data-size": size === 'small' || size === 'large' ? size : undefined,
    "data-label-wrap": labelWrap,
    "aria-describedby": [loadingAnnouncementID, ariaDescribedBy].filter(descriptionID => Boolean(descriptionID)).join(' ')
    // aria-labelledby is needed because the accessible name becomes unset when the button is in a loading state.
    // We only set it when the button is in a loading state because it will supercede the aria-label when the screen
    // reader announces the button name.
    ,
    "aria-labelledby": loading ? [`${uuid}-label`, ariaLabelledBy].filter(labelID => Boolean(labelID)).join(' ') : ariaLabelledBy,
    id: id,
    onClick: loading ? undefined : onClick
  }), Icon ? loading ? /*#__PURE__*/React.createElement(StyledSpinner, {
    size: "small"
  }) : /*#__PURE__*/React.createElement(Icon, null) : /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Box, {
    as: "span",
    "data-component": "buttonContent",
    sx: getAlignContentSize(alignContent)
  },
  /* If there are no leading/trailing visuals/actions to replace with a loading spinner,
     render a loading spiner in place of the button content. */
  loading && !LeadingVisual && !TrailingVisual && !TrailingAction && renderVisual(StyledSpinner, loading, 'loadingSpinner'),
  /* Render a leading visual unless the button is in a loading state.
     Then replace the leading visual with a loading spinner. */
  LeadingVisual && renderVisual(LeadingVisual, Boolean(loading), 'leadingVisual'), children && /*#__PURE__*/React.createElement("span", {
    "data-component": "text",
    id: loading ? `${uuid}-label` : undefined
  }, children),
  /* If there is a count, render a counter label unless there is a trailing visual.
     Then render the counter label as a trailing visual.
     Replace the counter label or the trailing visual with a loading spinner if:
     - the button is in a loading state
     - there is no leading visual to replace with a loading spinner
  */
  count !== undefined && !TrailingVisual ? renderVisual(() => /*#__PURE__*/React.createElement(CounterLabel, {
    "data-component": "ButtonCounter"
  }, count), Boolean(loading) && !LeadingVisual, 'trailingVisual') : TrailingVisual ? renderVisual(TrailingVisual, Boolean(loading) && !LeadingVisual, 'trailingVisual') : null),
  /* If there is a trailing action, render it unless the button is in a loading state
     and there is no leading or trailing visual to replace with a loading spinner. */
  TrailingAction && renderVisual(TrailingAction, Boolean(loading) && !LeadingVisual && !TrailingVisual, 'trailingAction'))), loading && /*#__PURE__*/React.createElement(VisuallyHidden, null, /*#__PURE__*/React.createElement(AriaStatus, {
    id: loadingAnnouncementID
  }, loadingAnnouncement)));
});

export { ButtonBase };
