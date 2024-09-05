'use strict';

var React = require('react');
var Box = require('../Box/Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var ThemeProvider = require('../ThemeProvider.js');
var types = require('./types.js');
var styles = require('./styles.js');
var useRefObjectAsForwardedRef = require('../hooks/useRefObjectAsForwardedRef.js');
var defaultSxProp = require('../utils/defaultSxProp.js');
var VisuallyHidden = require('../internal/components/VisuallyHidden.js');
var Spinner = require('../Spinner/Spinner.js');
var CounterLabel = require('../CounterLabel/CounterLabel.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useId = require('../hooks/useId.js');
var ConditionalWrapper = require('../internal/components/ConditionalWrapper.js');
require('../live-region/Announce.js');
require('../live-region/AriaAlert.js');
var AriaStatus = require('../live-region/AriaStatus.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const iconWrapStyles = {
  display: 'flex',
  pointerEvents: 'none'
};
const renderVisual = (Visual, loading, visualName) => /*#__PURE__*/React__default.default.createElement(Box, {
  as: "span",
  "data-component": visualName,
  sx: {
    ...iconWrapStyles
  }
}, loading ? /*#__PURE__*/React__default.default.createElement(Spinner, {
  size: "small"
}) : /*#__PURE__*/React__default.default.createElement(Visual, null));
renderVisual.displayName = "renderVisual";
const ButtonBase = /*#__PURE__*/React.forwardRef(({
  children,
  as: Component = 'button',
  sx: sxProp = defaultSxProp.defaultSxProp,
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
  const innerRef = React__default.default.useRef(null);
  useRefObjectAsForwardedRef.useRefObjectAsForwardedRef(forwardedRef, innerRef);
  const {
    theme
  } = ThemeProvider.useTheme();
  const baseStyles = React.useMemo(() => {
    return merge__default.default.all([styles.getButtonStyles(theme), styles.getVariantStyles(variant, theme)]);
  }, [theme, variant]);
  const sxStyles = React.useMemo(() => {
    return merge__default.default(baseStyles, sxProp);
  }, [baseStyles, sxProp]);
  const uuid = useId.useId(id);
  const loadingAnnouncementID = `${uuid}-loading-announcement`;
  if (process.env.NODE_ENV !== "production") {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    React__default.default.useEffect(() => {
      if (innerRef.current && !(innerRef.current instanceof HTMLButtonElement) && !(innerRef.current instanceof HTMLAnchorElement)) {
        // eslint-disable-next-line no-console
        console.warn('This component should be an instanceof a semantic button or anchor');
      }
    }, [innerRef]);
  }
  return /*#__PURE__*/React__default.default.createElement(ConditionalWrapper.ConditionalWrapper
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
  }, /*#__PURE__*/React__default.default.createElement(types.StyledButton, _extends({
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
  }), Icon ? loading ? /*#__PURE__*/React__default.default.createElement(Spinner, {
    size: "small"
  }) : /*#__PURE__*/React__default.default.createElement(Icon, null) : /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(Box, {
    as: "span",
    "data-component": "buttonContent",
    sx: styles.getAlignContentSize(alignContent)
  },
  /* If there are no leading/trailing visuals/actions to replace with a loading spinner,
     render a loading spiner in place of the button content. */
  loading && !LeadingVisual && !TrailingVisual && !TrailingAction && renderVisual(Spinner, loading, 'loadingSpinner'),
  /* Render a leading visual unless the button is in a loading state.
     Then replace the leading visual with a loading spinner. */
  LeadingVisual && renderVisual(LeadingVisual, Boolean(loading), 'leadingVisual'), children && /*#__PURE__*/React__default.default.createElement("span", {
    "data-component": "text",
    id: loading ? `${uuid}-label` : undefined
  }, children),
  /* If there is a count, render a counter label unless there is a trailing visual.
     Then render the counter label as a trailing visual.
     Replace the counter label or the trailing visual with a loading spinner if:
     - the button is in a loading state
     - there is no leading visual to replace with a loading spinner
  */
  count !== undefined && !TrailingVisual ? renderVisual(() => /*#__PURE__*/React__default.default.createElement(CounterLabel, {
    "data-component": "ButtonCounter"
  }, count), Boolean(loading) && !LeadingVisual, 'trailingVisual') : TrailingVisual ? renderVisual(TrailingVisual, Boolean(loading) && !LeadingVisual, 'trailingVisual') : null),
  /* If there is a trailing action, render it unless the button is in a loading state
     and there is no leading or trailing visual to replace with a loading spinner. */
  TrailingAction && renderVisual(TrailingAction, Boolean(loading) && !LeadingVisual && !TrailingVisual, 'trailingAction'))), loading && /*#__PURE__*/React__default.default.createElement(VisuallyHidden.VisuallyHidden, null, /*#__PURE__*/React__default.default.createElement(AriaStatus.AriaStatus, {
    id: loadingAnnouncementID
  }, loadingAnnouncement)));
});

exports.ButtonBase = ButtonBase;
