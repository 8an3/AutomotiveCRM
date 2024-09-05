import { List } from './ActionList/List.js';
import { Item } from './ActionList/Item.js';
import { Divider } from './ActionList/Divider.js';
import Button from './Button/Button.js';
import './Button/ButtonDanger.js';
import './Button/ButtonOutline.js';
import './Button/ButtonPrimary.js';
import './Button/ButtonInvisible.js';
import './Button/ButtonTableList.js';
import './Button/ButtonClose.js';
import React, { useCallback, useMemo } from 'react';
import { AnchoredOverlay } from '../AnchoredOverlay/AnchoredOverlay.js';
import { useProvidedStateOrCreate } from '../hooks/useProvidedStateOrCreate.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ActionMenuItem = props => /*#__PURE__*/React.createElement(Item, _extends({
  role: "menuitem"
}, props));
ActionMenuItem.displayName = "ActionMenuItem";
ActionMenuItem.displayName = 'ActionMenu.Item';
const ActionMenuBase = ({
  anchorContent,
  renderAnchor = props => /*#__PURE__*/React.createElement(Button, props),
  anchorRef: externalAnchorRef,
  onAction,
  open,
  setOpen,
  overlayProps,
  items,
  ...listProps
}) => {
  const [combinedOpenState, setCombinedOpenState] = useProvidedStateOrCreate(open, setOpen, false);
  const anchorRef = useProvidedRefOrCreate(externalAnchorRef);
  const onOpen = useCallback(() => setCombinedOpenState(true), [setCombinedOpenState]);
  const onClose = useCallback(() => setCombinedOpenState(false), [setCombinedOpenState]);
  const renderMenuAnchor = useMemo(() => {
    if (renderAnchor === null) {
      return null;
    }
    return props => {
      return renderAnchor({
        'aria-label': 'menu',
        children: anchorContent,
        ...props
      });
    };
  }, [anchorContent, renderAnchor]);
  const itemsToRender = useMemo(() => {
    return items.map(item => {
      return {
        ...item,
        role: 'menuitem',
        onAction: (props, event) => {
          var _item$onAction;
          const actionCallback = (_item$onAction = item.onAction) !== null && _item$onAction !== void 0 ? _item$onAction : onAction;
          actionCallback === null || actionCallback === void 0 ? void 0 : actionCallback(props, event);
          if (!event.defaultPrevented) {
            onClose();
          }
        }
      };
    });
  }, [items, onAction, onClose]);
  return /*#__PURE__*/React.createElement(AnchoredOverlay, {
    renderAnchor: renderMenuAnchor,
    anchorRef: anchorRef,
    open: combinedOpenState,
    onOpen: onOpen,
    onClose: onClose,
    overlayProps: overlayProps
  }, /*#__PURE__*/React.createElement(List, _extends({}, listProps, {
    role: "menu",
    items: itemsToRender
  })));
};
ActionMenuBase.displayName = "ActionMenuBase";
ActionMenuBase.displayName = 'ActionMenu';

/**
 * @deprecated Use ActionMenu with composable API instead. See https://primer.style/react/ActionMenu for more details.
 */
const ActionMenu = Object.assign(ActionMenuBase, {
  Divider,
  Item: ActionMenuItem
});

export { ActionMenu };
