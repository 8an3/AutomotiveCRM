import React, { forwardRef, useRef } from 'react';
import styled from 'styled-components';
import { IconButton } from './Button/IconButton.js';
import './Button/ButtonBase.js';
import './utils/defaultSxProp.js';
import './Button/Button.js';
import { get } from './constants.js';
import Box from './Box/Box.js';
import useDialog from './hooks/useDialog.js';
import sx from './sx.js';
import Text from './Text/Text.js';
import { useRefObjectAsForwardedRef } from './hooks/useRefObjectAsForwardedRef.js';
import { XIcon } from '@primer/octicons-react';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// Dialog v1
const noop = () => null;
const DialogBase = styled.div.withConfig({
  displayName: "Dialog__DialogBase",
  componentId: "sc-13rdxb7-0"
})(["box-shadow:", ";border-radius:", ";position:fixed;top:0;left:50%;transform:translateX(-50%);max-height:80vh;z-index:999;margin:10vh auto;background-color:", ";width:", ";outline:none;@media screen and (max-width:750px){width:100dvw;margin:0;border-radius:0;height:100dvh;}", ";"], get('shadows.shadow.large'), get('radii.2'), get('colors.canvas.default'), props => props.narrow ? '320px' : props.wide ? '640px' : '440px', sx);
const DialogHeaderBase = styled(Box).withConfig({
  displayName: "Dialog__DialogHeaderBase",
  componentId: "sc-13rdxb7-1"
})(["border-radius:", " ", " 0px 0px;border-bottom:1px solid ", ";display:flex;@media screen and (max-width:750px){border-radius:0px;}", ";"], get('radii.2'), get('radii.2'), get('colors.border.default'), sx);
function DialogHeader({
  theme,
  children,
  backgroundColor = 'canvas.subtle',
  ...rest
}) {
  if (React.Children.toArray(children).every(ch => typeof ch === 'string')) {
    children = /*#__PURE__*/React.createElement(Text, {
      fontSize: 1,
      fontWeight: "bold"
    }, children);
  }
  return /*#__PURE__*/React.createElement(DialogHeaderBase, _extends({
    theme: theme,
    p: 3,
    backgroundColor: backgroundColor
  }, rest), children);
}
DialogHeader.displayName = "DialogHeader";
const Overlay = styled.span.withConfig({
  displayName: "Dialog__Overlay",
  componentId: "sc-13rdxb7-2"
})(["&:before{position:fixed;top:0;right:0;bottom:0;left:0;display:block;cursor:default;content:' ';background:transparent;z-index:99;background:", ";}"], get('colors.primer.canvas.backdrop'));
const Dialog = /*#__PURE__*/forwardRef(({
  children,
  onDismiss = noop,
  isOpen,
  initialFocusRef,
  returnFocusRef,
  ...props
}, forwardedRef) => {
  const overlayRef = useRef(null);
  const modalRef = useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, modalRef);
  const closeButtonRef = useRef(null);
  const onCloseClick = () => {
    onDismiss();
    if (returnFocusRef && returnFocusRef.current) {
      returnFocusRef.current.focus();
    }
  };
  const {
    getDialogProps
  } = useDialog({
    modalRef,
    onDismiss: onCloseClick,
    isOpen,
    initialFocusRef,
    closeButtonRef,
    returnFocusRef,
    overlayRef
  });
  return isOpen ? /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Overlay, {
    ref: overlayRef
  }), /*#__PURE__*/React.createElement(DialogBase, _extends({
    tabIndex: -1,
    ref: modalRef,
    role: "dialog",
    "aria-modal": "true"
  }, props, getDialogProps()), /*#__PURE__*/React.createElement(IconButton, {
    icon: XIcon,
    ref: closeButtonRef,
    onClick: onCloseClick,
    sx: {
      position: 'absolute',
      top: '8px',
      right: '16px'
    },
    "aria-label": "Close",
    variant: "invisible"
  }), children)) : null;
});
DialogHeader.propTypes = {
  ...Box.propTypes
};
DialogHeader.displayName = 'Dialog.Header';
Dialog.displayName = 'Dialog';
var Dialog$1 = Object.assign(Dialog, {
  Header: DialogHeader
});

export { Dialog$1 as default };
