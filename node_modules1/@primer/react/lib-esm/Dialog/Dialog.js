import React, { useRef, useCallback, useState, useEffect } from 'react';
import styled from 'styled-components';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import { ButtonComponent } from '../Button/Button.js';
import '../TooltipV2/Tooltip.js';
import '../Tooltip/Tooltip.js';
import Box from '../Box/Box.js';
import { get } from '../constants.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import { useOnEscapePress } from '../hooks/useOnEscapePress.js';
import '@primer/behaviors/utils';
import { FocusKeys } from '@primer/behaviors';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import { useId } from '../hooks/useId.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import sx from '../sx.js';
import Octicon from '../Octicon/Octicon.js';
import { XIcon } from '@primer/octicons-react';
import { useFocusZone } from '../hooks/useFocusZone.js';
import { Portal } from '../Portal/Portal.js';
import { ScrollableRegion } from '../ScrollableRegion/ScrollableRegion.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

/* Dialog Version 2 */

/**
 * Props that characterize a button to be rendered into the footer of
 * a Dialog.
 */

/**
 * Props to customize the rendering of the Dialog.
 */

/**
 * Props that are passed to a component that serves as a dialog header
 */

const Backdrop = styled('div').withConfig({
  displayName: "Dialog__Backdrop",
  componentId: "sc-uaxjsn-0"
})(["position:fixed;top:0;left:0;bottom:0;right:0;display:flex;align-items:center;justify-content:center;background-color:", ";animation:dialog-backdrop-appear 200ms ", ";&[data-position-regular='center']{align-items:center;justify-content:center;}&[data-position-regular='left']{align-items:center;justify-content:flex-start;}&[data-position-regular='right']{align-items:center;justify-content:flex-end;}.DialogOverflowWrapper{flex-grow:1;}@media (max-width:767px){&[data-position-narrow='center']{align-items:center;justify-content:center;}&[data-position-narrow='bottom']{align-items:end;justify-content:center;}}@keyframes dialog-backdrop-appear{0%{opacity:0;}100%{opacity:1;}}"], get('colors.primer.canvas.backdrop'), get('animation.easeOutCubic'));
const heightMap = {
  small: '480px',
  large: '640px',
  auto: 'auto'
};
const widthMap = {
  small: '296px',
  medium: '320px',
  large: '480px',
  xlarge: '640px'
};
const StyledDialog = styled.div.withConfig({
  displayName: "Dialog__StyledDialog",
  componentId: "sc-uaxjsn-1"
})(["display:flex;flex-direction:column;background-color:", ";box-shadow:", ";width:", ";height:", ";min-width:296px;max-width:calc(100dvw - 64px);max-height:calc(100dvh - 64px);border-radius:12px;opacity:1;@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-scaleFade 0.2s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}&[data-position-regular='center']{border-radius:var(--borderRadius-large,0.75rem);@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-scaleFade 0.2s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}}&[data-position-regular='left']{height:100dvh;max-height:unset;border-radius:var(--borderRadius-large,0.75rem);border-top-left-radius:0;border-bottom-left-radius:0;@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-slideInRight 0.25s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}}&[data-position-regular='right']{height:100dvh;max-height:unset;border-radius:var(--borderRadius-large,0.75rem);border-top-right-radius:0;border-bottom-right-radius:0;@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-slideInLeft 0.25s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}}@media (max-width:767px){&[data-position-narrow='center']{border-radius:var(--borderRadius-large,0.75rem);width:", ";height:", ";}&[data-position-narrow='bottom']{width:100dvw;height:auto;max-width:100dvw;max-height:calc(100dvh - 64px);border-radius:var(--borderRadius-large,0.75rem);border-bottom-right-radius:0;border-bottom-left-radius:0;@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-slideUp 0.25s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}}&[data-position-narrow='fullscreen']{width:100%;max-width:100dvw;height:100%;max-height:100dvh;border-radius:unset !important;flex-grow:1;@media screen and (prefers-reduced-motion:no-preference){animation:Overlay--motion-scaleFade 0.2s cubic-bezier(0.33,1,0.68,1) 0s 1 normal none running;}}}@keyframes Overlay--motion-scaleFade{0%{opacity:0;transform:scale(0.5);}100%{opacity:1;transform:scale(1);}}@keyframes Overlay--motion-slideUp{from{transform:translateY(100%);}}@keyframes Overlay--motion-slideInRight{from{transform:translateX(-100%);}}@keyframes Overlay--motion-slideInLeft{from{transform:translateX(100%);}}", ";"], get('colors.canvas.overlay'), get('shadows.overlay.shadow'), props => {
  var _props$width;
  return widthMap[(_props$width = props.width) !== null && _props$width !== void 0 ? _props$width : 'xlarge'];
}, props => {
  var _props$height;
  return heightMap[(_props$height = props.height) !== null && _props$height !== void 0 ? _props$height : 'auto'];
}, props => {
  var _props$width2;
  return widthMap[(_props$width2 = props.width) !== null && _props$width2 !== void 0 ? _props$width2 : 'xlarge'];
}, props => {
  var _props$height2;
  return heightMap[(_props$height2 = props.height) !== null && _props$height2 !== void 0 ? _props$height2 : 'auto'];
}, sx);
const DefaultHeader = ({
  dialogLabelId,
  title,
  subtitle,
  dialogDescriptionId,
  onClose
}) => {
  const onCloseClick = useCallback(() => {
    onClose('close-button');
  }, [onClose]);
  return /*#__PURE__*/React.createElement(Dialog.Header, null, /*#__PURE__*/React.createElement(Box, {
    display: "flex"
  }, /*#__PURE__*/React.createElement(Box, {
    display: "flex",
    px: 2,
    py: "6px",
    flexDirection: "column",
    flexGrow: 1
  }, /*#__PURE__*/React.createElement(Dialog.Title, {
    id: dialogLabelId
  }, title !== null && title !== void 0 ? title : 'Dialog'), subtitle && /*#__PURE__*/React.createElement(Dialog.Subtitle, {
    id: dialogDescriptionId
  }, subtitle)), /*#__PURE__*/React.createElement(Dialog.CloseButton, {
    onClose: onCloseClick
  })));
};
DefaultHeader.displayName = "DefaultHeader";
const DefaultBody = ({
  children
}) => {
  return /*#__PURE__*/React.createElement(Dialog.Body, null, children);
};
DefaultBody.displayName = "DefaultBody";
const DefaultFooter = ({
  footerButtons
}) => {
  const {
    containerRef: footerRef
  } = useFocusZone({
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.Tab,
    focusInStrategy: 'closest'
  });
  return footerButtons ? /*#__PURE__*/React.createElement(Dialog.Footer, {
    ref: footerRef
  }, /*#__PURE__*/React.createElement(Dialog.Buttons, {
    buttons: footerButtons
  })) : null;
};
const defaultPosition = {
  narrow: 'center',
  regular: 'center'
};
const _Dialog = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
  const {
    title = 'Dialog',
    subtitle = '',
    renderHeader,
    renderBody,
    renderFooter,
    onClose,
    role = 'dialog',
    width = 'xlarge',
    height = 'auto',
    footerButtons = [],
    position = defaultPosition,
    returnFocusRef,
    initialFocusRef,
    sx
  } = props;
  const dialogLabelId = useId();
  const dialogDescriptionId = useId();
  const autoFocusedFooterButtonRef = useRef(null);
  for (const footerButton of footerButtons) {
    if (footerButton.autoFocus) {
      footerButton.ref = autoFocusedFooterButtonRef;
    }
  }
  const defaultedProps = {
    ...props,
    title,
    subtitle,
    role,
    dialogLabelId,
    dialogDescriptionId
  };
  const onBackdropClick = useCallback(e => {
    if (e.target === e.currentTarget) {
      onClose('escape');
    }
  }, [onClose]);
  const dialogRef = useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, dialogRef);
  const backdropRef = useRef(null);
  useFocusTrap({
    containerRef: dialogRef,
    initialFocusRef: initialFocusRef !== null && initialFocusRef !== void 0 ? initialFocusRef : autoFocusedFooterButtonRef,
    restoreFocusOnCleanUp: returnFocusRef !== null && returnFocusRef !== void 0 && returnFocusRef.current ? false : true,
    returnFocusRef
  });
  useOnEscapePress(event => {
    onClose('escape');
    event.preventDefault();
  }, [onClose]);
  React.useEffect(() => {
    const bodyOverflowStyle = document.body.style.overflow || '';
    // If the body is already set to overflow: hidden, it likely means
    // that there is already a modal open. In that case, we should bail
    // so we don't re-enable scroll after the second dialog is closed.
    if (bodyOverflowStyle === 'hidden') {
      return;
    }
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = bodyOverflowStyle;
    };
  }, []);
  const header = (renderHeader !== null && renderHeader !== void 0 ? renderHeader : DefaultHeader)(defaultedProps);
  const body = (renderBody !== null && renderBody !== void 0 ? renderBody : DefaultBody)(defaultedProps);
  const footer = (renderFooter !== null && renderFooter !== void 0 ? renderFooter : DefaultFooter)(defaultedProps);
  const positionDataAttributes = typeof position === 'string' ? {
    'data-position-regular': position
  } : Object.fromEntries(Object.entries(position).map(([key, value]) => {
    return [`data-position-${key}`, value];
  }));
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Portal, null, /*#__PURE__*/React.createElement(Backdrop, _extends({
    ref: backdropRef
  }, positionDataAttributes, {
    onClick: onBackdropClick
  }), /*#__PURE__*/React.createElement(StyledDialog, _extends({
    width: width,
    height: height,
    ref: dialogRef,
    role: role,
    "aria-labelledby": dialogLabelId,
    "aria-describedby": dialogDescriptionId,
    "aria-modal": true
  }, positionDataAttributes, {
    sx: sx
  }), header, /*#__PURE__*/React.createElement(ScrollableRegion, {
    "aria-labelledby": dialogLabelId,
    className: "DialogOverflowWrapper"
  }, body), footer))));
});
_Dialog.displayName = 'Dialog';
const Header = styled.div.withConfig({
  displayName: "Dialog__Header",
  componentId: "sc-uaxjsn-2"
})(["box-shadow:0 1px 0 ", ";padding:", ";z-index:1;flex-shrink:0;", ";"], get('colors.border.default'), get('space.2'), sx);
const Title = styled.h1.withConfig({
  displayName: "Dialog__Title",
  componentId: "sc-uaxjsn-3"
})(["font-size:", ";font-weight:", ";margin:0;", ";"], get('fontSizes.1'), get('fontWeights.bold'), sx);
const Subtitle = styled.h2.withConfig({
  displayName: "Dialog__Subtitle",
  componentId: "sc-uaxjsn-4"
})(["font-size:", ";color:", ";margin:0;margin-top:", ";font-weight:normal;", ";"], get('fontSizes.0'), get('colors.fg.muted'), get('space.1'), sx);
const Body = styled.div.withConfig({
  displayName: "Dialog__Body",
  componentId: "sc-uaxjsn-5"
})(["flex-grow:1;overflow:auto;padding:", ";", ";"], get('space.3'), sx);
const Footer = styled.div.withConfig({
  displayName: "Dialog__Footer",
  componentId: "sc-uaxjsn-6"
})(["box-shadow:0 -1px 0 ", ";padding:", ";display:flex;flex-flow:wrap;justify-content:flex-end;gap:", ";z-index:1;flex-shrink:0;", ";"], get('colors.border.default'), get('space.3'), get('space.2'), sx);
const Buttons = ({
  buttons
}) => {
  var _buttons$find;
  const autoFocusRef = useProvidedRefOrCreate((_buttons$find = buttons.find(button => button.autoFocus)) === null || _buttons$find === void 0 ? void 0 : _buttons$find.ref);
  let autoFocusCount = 0;
  const [hasRendered, setHasRendered] = useState(0);
  useEffect(() => {
    // hack to work around dialogs originating from other focus traps.
    if (hasRendered === 1) {
      var _autoFocusRef$current;
      (_autoFocusRef$current = autoFocusRef.current) === null || _autoFocusRef$current === void 0 ? void 0 : _autoFocusRef$current.focus();
    } else {
      setHasRendered(hasRendered + 1);
    }
  }, [autoFocusRef, hasRendered]);
  return /*#__PURE__*/React.createElement(React.Fragment, null, buttons.map((dialogButtonProps, index) => {
    const {
      content,
      buttonType = 'default',
      autoFocus = false,
      ...buttonProps
    } = dialogButtonProps;
    return /*#__PURE__*/React.createElement(ButtonComponent, _extends({
      key: index
    }, buttonProps, {
      // 'normal' value is equivalent to 'default', this is used for backwards compatibility
      variant: buttonType === 'normal' ? 'default' : buttonType,
      ref: autoFocus && autoFocusCount === 0 ? (autoFocusCount++, autoFocusRef) : null
    }), content);
  }));
};
const DialogCloseButton = styled(ButtonComponent).withConfig({
  displayName: "Dialog__DialogCloseButton",
  componentId: "sc-uaxjsn-7"
})(["border-radius:4px;background:transparent;border:0;vertical-align:middle;color:", ";padding:", ";align-self:flex-start;line-height:normal;box-shadow:none;"], get('colors.fg.muted'), get('space.2'));
const CloseButton = ({
  onClose
}) => {
  return /*#__PURE__*/React.createElement(DialogCloseButton, {
    "aria-label": "Close",
    onClick: onClose
  }, /*#__PURE__*/React.createElement(Octicon, {
    icon: XIcon
  }));
};
CloseButton.displayName = "CloseButton";
/**
 * A dialog is a type of overlay that can be used for confirming actions, asking
 * for disambiguation, and presenting small forms. They generally allow the user
 * to focus on a quick task without having to navigate to a different page.
 *
 * Dialogs appear in the page after a direct user interaction. Don't show dialogs
 * on page load or as system alerts.
 *
 * Dialogs appear centered in the page, with a visible backdrop that dims the rest
 * of the window for focus.
 *
 * All dialogs have a title and a close button.
 *
 * Dialogs are modal. Dialogs can be dismissed by clicking on the close button,
 * pressing the escape key, or by interacting with another button in the dialog.
 * To avoid losing information and missing important messages, clicking outside
 * of the dialog will not close it.
 *
 * The sub components provided (e.g. Header, Title, etc.) are available for custom
 * renderers only. They are not intended to be used otherwise.
 */
const Dialog = Object.assign(_Dialog, {
  Header,
  Title,
  Subtitle,
  Body,
  Footer,
  Buttons,
  CloseButton
});

export { Dialog };
