import React, { useCallback, useEffect } from 'react';
import Overlay from '../Overlay/Overlay.js';
import { useFocusTrap } from '../hooks/useFocusTrap.js';
import { useFocusZone } from '../hooks/useFocusZone.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import '@primer/behaviors/utils';
import { useAnchoredPosition } from '../hooks/useAnchoredPosition.js';
import { useRenderForcingRef } from '../hooks/useRenderForcingRef.js';
import { useId } from '../hooks/useId.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * An `AnchoredOverlay` provides an anchor that will open a floating overlay positioned relative to the anchor.
 * The overlay can be opened and navigated using keyboard or mouse.
 */
const AnchoredOverlay = ({
  renderAnchor,
  anchorRef: externalAnchorRef,
  anchorId: externalAnchorId,
  children,
  open,
  onOpen,
  onClose,
  height,
  width,
  overlayProps,
  focusTrapSettings,
  focusZoneSettings,
  side = 'outside-bottom',
  align = 'start',
  alignmentOffset,
  anchorOffset,
  className
}) => {
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const [overlayRef, updateOverlayRef] = useRenderForcingRef();
  const anchorId = useId(externalAnchorId);
  const onClickOutside = useCallback(() => onClose === null || onClose === void 0 ? void 0 : onClose('click-outside'), [onClose]);
  const onEscape = useCallback(() => onClose === null || onClose === void 0 ? void 0 : onClose('escape'), [onClose]);
  const onAnchorKeyDown = useCallback(event => {
    if (!event.defaultPrevented) {
      if (!open && ['ArrowDown', 'ArrowUp', ' ', 'Enter'].includes(event.key)) {
        onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-key-press', event);
        event.preventDefault();
      }
    }
  }, [open, onOpen]);
  const onAnchorClick = useCallback(event => {
    if (event.defaultPrevented || event.button !== 0) {
      return;
    }
    if (!open) {
      onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-click');
    } else {
      onClose === null || onClose === void 0 ? void 0 : onClose('anchor-click');
    }
  }, [open, onOpen, onClose]);
  const {
    position
  } = useAnchoredPosition({
    anchorElementRef: anchorRef,
    floatingElementRef: overlayRef,
    side,
    align,
    alignmentOffset,
    anchorOffset
  }, [overlayRef.current]);
  useEffect(() => {
    // ensure overlay ref gets cleared when closed, so position can reset between closing/re-opening
    if (!open && overlayRef.current) {
      updateOverlayRef(null);
    }
  }, [open, overlayRef, updateOverlayRef]);
  useFocusZone({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusZoneSettings
  });
  useFocusTrap({
    containerRef: overlayRef,
    disabled: !open || !position,
    ...focusTrapSettings
  });
  return /*#__PURE__*/React.createElement(React.Fragment, null, renderAnchor && renderAnchor({
    ref: anchorRef,
    id: anchorId,
    'aria-haspopup': 'true',
    'aria-expanded': open,
    tabIndex: 0,
    onClick: onAnchorClick,
    onKeyDown: onAnchorKeyDown
  }), open ? /*#__PURE__*/React.createElement(Overlay, _extends({
    returnFocusRef: anchorRef,
    onClickOutside: onClickOutside,
    ignoreClickRefs: [anchorRef],
    onEscape: onEscape,
    ref: updateOverlayRef,
    role: "none",
    visibility: position ? 'visible' : 'hidden',
    height: height,
    width: width,
    top: (position === null || position === void 0 ? void 0 : position.top) || 0,
    left: (position === null || position === void 0 ? void 0 : position.left) || 0,
    anchorSide: position === null || position === void 0 ? void 0 : position.anchorSide,
    className: className
  }, overlayProps), children) : null);
};
AnchoredOverlay.displayName = 'AnchoredOverlay';

export { AnchoredOverlay };
