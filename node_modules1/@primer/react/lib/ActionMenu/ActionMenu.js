'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var AnchoredOverlay = require('../AnchoredOverlay/AnchoredOverlay.js');
var useProvidedRefOrCreate = require('../hooks/useProvidedRefOrCreate.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useProvidedStateOrCreate = require('../hooks/useProvidedStateOrCreate.js');
var useMenuKeyboardNavigation = require('../hooks/useMenuKeyboardNavigation.js');
var useId = require('../hooks/useId.js');
var Divider = require('../ActionList/Divider.js');
var ActionListContainerContext = require('../ActionList/ActionListContainerContext.js');
require('../Button/ButtonBase.js');
require('../utils/defaultSxProp.js');
var Button = require('../Button/Button.js');
var Tooltip = require('../TooltipV2/Tooltip.js');
require('../Tooltip/Tooltip.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const MenuContext = /*#__PURE__*/React__default.default.createContext({
  renderAnchor: null,
  open: false
});
const Menu = ({
  anchorRef: externalAnchorRef,
  open,
  onOpenChange,
  children
}) => {
  const parentMenuContext = React.useContext(MenuContext);
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate.useProvidedStateOrCreate(open, onOpenChange, false);
  const onOpen = React__default.default.useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = React__default.default.useCallback(gesture => {
    var _parentMenuContext$on;
    setCombinedOpenState(false);

    // Close the parent stack when an item is selected or the user tabs out of the menu entirely
    switch (gesture) {
      case 'tab':
      case 'item-select':
        (_parentMenuContext$on = parentMenuContext.onClose) === null || _parentMenuContext$on === void 0 ? void 0 : _parentMenuContext$on.call(parentMenuContext, gesture);
    }
  }, [setCombinedOpenState, parentMenuContext]);
  const menuButtonChild = React__default.default.Children.toArray(children).find(child => /*#__PURE__*/React__default.default.isValidElement(child) && (child.type === MenuButton || child.type === Anchor));
  const menuButtonChildId = /*#__PURE__*/React__default.default.isValidElement(menuButtonChild) ? menuButtonChild.props.id : undefined;
  const anchorRef = useProvidedRefOrCreate.useProvidedRefOrCreate(externalAnchorRef);
  const anchorId = useId.useId(menuButtonChildId);
  let renderAnchor = null;
  // 🚨 Hack for good API!
  // we strip out Anchor from children and pass it to AnchoredOverlay to render
  // with additional props for accessibility
  // 🚨 Accounting for Tooltip wrapping ActionMenu.Button or being a direct child of ActionMenu.Anchor.
  const contents = React__default.default.Children.map(children, child => {
    // Is ActionMenu.Button wrapped with Tooltip? If this is the case, our anchor is the tooltip's trigger (ActionMenu.Button's grandchild)
    if (child.type === Tooltip.Tooltip) {
      // tooltip trigger
      const anchorChildren = child.props.children;
      if (anchorChildren.type === MenuButton) {
        renderAnchor = anchorProps => {
          // We need to attach the anchor props to the tooltip trigger (ActionMenu.Button's grandchild) not the tooltip itself.
          const triggerButton = /*#__PURE__*/React__default.default.cloneElement(anchorChildren, {
            ...anchorProps
          });
          return /*#__PURE__*/React__default.default.cloneElement(child, {
            children: triggerButton,
            ref: anchorRef
          });
        };
      }
      return null;
    } else if (child.type === Anchor) {
      const anchorChildren = child.props.children;
      const isWrappedWithTooltip = anchorChildren !== undefined ? anchorChildren.type === Tooltip.Tooltip : false;
      if (isWrappedWithTooltip) {
        if (anchorChildren.props.children !== null) {
          renderAnchor = anchorProps => {
            // ActionMenu.Anchor's children can be wrapped with Tooltip. If this is the case, our anchor is the tooltip's trigger
            const tooltipTrigger = anchorChildren.props.children;
            // We need to attach the anchor props to the tooltip trigger not the tooltip itself.
            const tooltipTriggerEl = /*#__PURE__*/React__default.default.cloneElement(tooltipTrigger, {
              ...anchorProps
            });
            const tooltip = /*#__PURE__*/React__default.default.cloneElement(anchorChildren, {
              children: tooltipTriggerEl
            });
            return /*#__PURE__*/React__default.default.cloneElement(child, {
              children: tooltip,
              ref: anchorRef
            });
          };
        }
      } else {
        renderAnchor = anchorProps => /*#__PURE__*/React__default.default.cloneElement(child, anchorProps);
      }
      return null;
    } else if (child.type === MenuButton) {
      renderAnchor = anchorProps => /*#__PURE__*/React__default.default.cloneElement(child, anchorProps);
      return null;
    } else {
      return child;
    }
  });
  return /*#__PURE__*/React__default.default.createElement(MenuContext.Provider, {
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
const Anchor = /*#__PURE__*/React__default.default.forwardRef(({
  children,
  ...anchorProps
}, anchorRef) => {
  const {
    onOpen,
    isSubmenu
  } = React__default.default.useContext(MenuContext);
  const openSubmenuOnRightArrow = React.useCallback(event => {
    var _children$props$onKey, _children$props;
    (_children$props$onKey = (_children$props = children.props).onKeyDown) === null || _children$props$onKey === void 0 ? void 0 : _children$props$onKey.call(_children$props, event);
    if (isSubmenu && event.key === 'ArrowRight' && !event.defaultPrevented) onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-key-press');
  }, [children, isSubmenu, onOpen]);

  // Add right chevron icon to submenu anchors rendered using `ActionList.Item`
  const parentActionListContext = React.useContext(ActionListContainerContext.ActionListContainerContext);
  const thisActionListContext = React.useMemo(() => isSubmenu ? {
    ...parentActionListContext,
    defaultTrailingVisual: /*#__PURE__*/React__default.default.createElement(octiconsReact.ChevronRightIcon, null),
    // Default behavior is to close after selecting; we want to open the submenu instead
    afterSelect: () => onOpen === null || onOpen === void 0 ? void 0 : onOpen('anchor-click')
  } : parentActionListContext, [isSubmenu, onOpen, parentActionListContext]);
  return /*#__PURE__*/React__default.default.createElement(ActionListContainerContext.ActionListContainerContext.Provider, {
    value: thisActionListContext
  }, /*#__PURE__*/React__default.default.cloneElement(children, {
    ...anchorProps,
    ref: anchorRef,
    onKeyDown: openSubmenuOnRightArrow
  }));
});

/** this component is syntactical sugar 🍭 */

const MenuButton = /*#__PURE__*/React__default.default.forwardRef(({
  ...props
}, anchorRef) => {
  return /*#__PURE__*/React__default.default.createElement(Anchor, {
    ref: anchorRef
  }, /*#__PURE__*/React__default.default.createElement(Button.ButtonComponent, _extends({
    type: "button",
    trailingAction: octiconsReact.TriangleDownIcon
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
  } = React__default.default.useContext(MenuContext);
  const containerRef = React__default.default.useRef(null);
  useMenuKeyboardNavigation.useMenuKeyboardNavigation(open, onClose, containerRef, anchorRef, isSubmenu);

  // If the menu anchor is an icon button, we need to label the menu by tooltip that also labelled the anchor.
  const [anchorAriaLabelledby, setAnchorAriaLabelledby] = React.useState(null);
  React.useEffect(() => {
    if (anchorRef.current) {
      const ariaLabelledby = anchorRef.current.getAttribute('aria-labelledby');
      if (ariaLabelledby) {
        setAnchorAriaLabelledby(ariaLabelledby);
      }
    }
  }, [anchorRef]);
  return /*#__PURE__*/React__default.default.createElement(AnchoredOverlay.AnchoredOverlay, {
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
  }, /*#__PURE__*/React__default.default.createElement("div", {
    ref: containerRef
  }, /*#__PURE__*/React__default.default.createElement(ActionListContainerContext.ActionListContainerContext.Provider, {
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
  Divider: Divider.Divider
});

exports.ActionMenu = ActionMenu;
