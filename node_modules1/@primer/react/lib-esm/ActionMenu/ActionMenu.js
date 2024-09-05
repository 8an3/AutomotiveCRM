import React, { useContext, useCallback, useMemo, useState, useEffect } from 'react';
import { ChevronRightIcon, TriangleDownIcon } from '@primer/octicons-react';
import { AnchoredOverlay } from '../AnchoredOverlay/AnchoredOverlay.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useProvidedStateOrCreate } from '../hooks/useProvidedStateOrCreate.js';
import { useMenuKeyboardNavigation } from '../hooks/useMenuKeyboardNavigation.js';
import { useId } from '../hooks/useId.js';
import { Divider } from '../ActionList/Divider.js';
import { ActionListContainerContext } from '../ActionList/ActionListContainerContext.js';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import { ButtonComponent } from '../Button/Button.js';
import { Tooltip } from '../TooltipV2/Tooltip.js';
import '../Tooltip/Tooltip.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MenuContext = /*#__PURE__*/React.createContext({
  renderAnchor: null,
  open: false
});
const Menu = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children
}) => {
  const parentMenuContext = useContext(MenuContext);
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, onOpenChange, false);
  const onOpen = React.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = React.useCallback(gesture => {
    var _parentMenuContext$on;
    setCombinedOpenState(false);

    // Close the parent stack when an item is selected or the user tabs out of the menu entirely
    switch (gesture) {
      case 'tab':
      case 'item-select':
        (_parentMenuContext$on = parentMenuContext.onClose) === null || _parentMenuContext$on === void 0 ? void 0 : _parentMenuContext$on.call(parentMenuContext, gesture);
    }
  }, [setCombinedOpenState, parentMenuContext]);
  const menuButtonChild = React.Children.toArray(children).find(child => /*#__PURE__*/React.isValidElement(child) && (child.type === MenuButton || child.type === Anchor));
  const menuButtonChildId = /*#__PURE__*/React.isValidElement(menuButtonChild) ? menuButtonChild.props.id : undefined;
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const anchorId = useId(menuButtonChildId);
  let renderAnchor = null;
  // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility
  // 🚨 Accounting for Tooltip wrapping ActionMenu.Button or being a direct child of ActionMenu.Anchor.
  const contents = React.Children.map(children, child => {
    // Is ActionMenu.Button wrapped with Tooltip? If this is the case, our anchor is the tooltip's trigger (ActionMenu.Button's grandchild)
    if (child.type === Tooltip) {
      // tooltip trigger
      const anchorChildren = child.props.children;
      if (anchorChildren.type === MenuButton) {
        renderAnchor = anchorProps => {
          // We need to attach the anchor props to the tooltip trigger (ActionMenu.Button's grandchild) not the tooltip itself.
          const triggerButton = /*#__PURE__*/React.cloneElement(anchorChildren, {
            ...anchorProps
          });
          return /*#__PURE__*/React.cloneElement(child, {
            children: triggerButton,
            ref: anchorRef
          });
        };
      }
      return null;
    } else if (child.type === Anchor) {
      const anchorChildren = child.props.children;
      const isWrappedWithTooltip = anchorChildren !== undefined ? anchorChildren.type === Tooltip : false;
      if (isWrappedWithTooltip) {
        if (anchorChildren.props.children !== null) {
          renderAnchor = anchorProps => {
            // ActionMenu.Anchor's children can be wrapped with Tooltip. If this is the case, our anchor is the tooltip's trigger
            const tooltipTrigger = anchorChildren.props.children;
            // We need to attach the anchor props to the tooltip trigger not the tooltip itself.
            const tooltipTriggerEl = /*#__PURE__*/React.cloneElement(tooltipTrigger, {
              ...anchorProps
            });
            const tooltip = /*#__PURE__*/React.cloneElement(anchorChildren, {
              children: tooltipTriggerEl
            });
            return /*#__PURE__*/React.cloneElement(child, {
              children: tooltip,
              ref: anchorRef
            });
          };
        }
      } else {
        renderAnchor = anchorProps => /*#__PURE__*/React.cloneElement(child, anchorProps);
      }
      return null;
    } else if (child.type === MenuButton) {
      renderAnchor = anchorProps => /*#__PURE__*/React.cloneElement(child, anchorProps);
      return null;
    } else {
      return child;
    }
  });
  return /*#__PURE__*/React.createElement(MenuContext.Provider, {
    value: {
      anchorRef,
      renderAnchor,
      anchorId,
      open: combinedOpenState,
      onOpen,
      onClose,
      // will be undefined for the outermost level, then false for the top menu, then true inside that
      isSubmenu: parentMenuContext.isSubmenu !== undefined
    }
  }, contents);
};
Menu.displayName = "Menu";
const Anchor = /*#__PURE__*/React.forwardRef(({
  children,
  ...anchorProps
}, anchorRef) => {
  const {
    onOpen,
    isSubmenu
  } = React.useContext(MenuContext);
  const openSubmenuOnRightArrow = useCallback(event => {
    var _children$props$onKey, _children$props;
    (_children$props$onKey = (_children$props = children.props).onKeyDown) === null || _children$props$onKey === void 0 ? void 0 : _children$props$onKey.call(_children$props, event);
    if (isSubmenu && event.key === 'ArrowRight' && !event.defaultPrevented) onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-key-press');
  }, [children, isSubmenu, onOpen]);

  // Add right chevron icon to submenu anchors rendered using `ActionList.Item`
  const parentActionListContext = useContext(ActionListContainerContext);
  const thisActionListContext = useMemo(() => isSubmenu ? {
    ...parentActionListContext,
    defaultTrailingVisual: /*#__PURE__*/React.createElement(ChevronRightIcon, null),
    // Default behavior is to close after selecting; we want to open the submenu instead
    afterSelect: () => onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-click')
  } : parentActionListContext, [isSubmenu, onOpen, parentActionListContext]);
  return /*#__PURE__*/React.createElement(ActionListContainerContext.Provider, {
    value: thisActionListContext
  }, /*#__PURE__*/React.cloneElement(children, {
    ...anchorProps,
    ref: anchorRef,
    onKeyDown: openSubmenuOnRightArrow
  }));
});

/** this component is syntactical sugar 🍭 */

const MenuButton = /*#__PURE__*/React.forwardRef(({
  ...props
}, anchorRef) => {
  return /*#__PURE__*/React.createElement(Anchor, {
    ref: anchorRef
  }, /*#__PURE__*/React.createElement(ButtonComponent, _extends({
    type: "button",
    trailingAction: TriangleDownIcon
  }, props)));
});
const Overlay = ({
  children,
  align = 'start',
  side,
  'aria-labelledby': ariaLabelledby,
  ...overlayProps
}) => {
  // we typecast anchorRef as required instead of optional
  // because we know that we're setting it in context in Menu
  const {
    anchorRef,
    renderAnchor,
    anchorId,
    open,
    onOpen,
    onClose,
    isSubmenu = false
  } = React.useContext(MenuContext);
  const containerRef = React.useRef(null);
  useMenuKeyboardNavigation(open, onClose, containerRef, anchorRef, isSubmenu);

  // If the menu anchor is an icon button, we need to label the menu by tooltip that also labelled the anchor.
  const [anchorAriaLabelledby, setAnchorAriaLabelledby] = useState(null);
  useEffect(() => {
    if (anchorRef.current) {
      const ariaLabelledby = anchorRef.current.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        setAnchorAriaLabelledby(ariaLabelledby);
      }
    }
  }, [anchorRef]);
  return /*#__PURE__*/React.createElement(AnchoredOverlay, {
    anchorRef: anchorRef,
    renderAnchor: renderAnchor,
    anchorId: anchorId,
    open: open,
    onOpen: onOpen,
    onClose: onClose,
    align: align,
    side: side !== null && side !== void 0 ? side : isSubmenu ? 'outside-right' : 'outside-bottom',
    overlayProps: overlayProps,
    focusZoneSettings: {
      focusOutBehavior: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", {
    ref: containerRef
  }, /*#__PURE__*/React.createElement(ActionListContainerContext.Provider, {
    value: {
      container: 'ActionMenu',
      listRole: 'menu',
      // If there is a custom aria-labelledby, use that. Otherwise, if exists, use the id that labels the anchor such as tooltip. If none of them exist, use anchor id.
      listLabelledBy: ariaLabelledby || anchorAriaLabelledby || anchorId,
      selectionAttribute: 'aria-checked',
      // Should this be here?
      afterSelect: () => onClose === null || onClose === void 0 ? void 0 : onClose('item-select')
    }
  }, children)));
};
Overlay.displayName = "Overlay";
Menu.displayName = 'ActionMenu';
const ActionMenu = Object.assign(Menu, {
  Button: MenuButton,
  Anchor,
  Overlay,
  Divider
});

export { ActionMenu };
