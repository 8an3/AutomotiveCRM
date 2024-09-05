import React, { useState, useCallback, useRef, forwardRef } from 'react';
import { KebabHorizontalIcon } from '@primer/octicons-react';
import { ActionList } from '../ActionList/index.js';
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect.js';
import styled from 'styled-components';
import sx from '../sx.js';
import { useOnEscapePress } from '../hooks/useOnEscapePress.js';
import { useResizeObserver } from '../hooks/useResizeObserver.js';
import { useOnOutsideClick } from '../hooks/useOnOutsideClick.js';
import { IconButton } from '../Button/IconButton.js';
import '../Button/ButtonBase.js';
import '../utils/defaultSxProp.js';
import '../Button/Button.js';
import Box from '../Box/Box.js';
import { ActionMenu } from '../ActionMenu/ActionMenu.js';
import { useFocusZone } from '../hooks/useFocusZone.js';
import { FocusKeys } from '@primer/behaviors';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ActionBarContext = /*#__PURE__*/React.createContext({
  size: 'medium',
  setChildrenWidth: () => null
});

/*
small (28px), medium (32px), large (40px)
*/

const NavigationList = styled.div.withConfig({
  displayName: "ActionBar__NavigationList",
  componentId: "sc-ygrb3t-0"
})(["", ";"], sx);
const GAP = 8;
const listStyles = {
  display: 'flex',
  minWidth: 0,
  listStyle: 'none',
  whiteSpace: 'nowrap',
  paddingY: 0,
  paddingX: 0,
  margin: 0,
  marginBottom: '-1px',
  alignItems: 'center',
  gap: `${GAP}px`,
  position: 'relative'
};
const MORE_BTN_WIDTH = 86;
const navStyles = {
  display: 'flex',
  paddingX: 3,
  justifyContent: 'flex-end',
  align: 'row',
  alignItems: 'center',
  maxHeight: '32px'
};
const menuItemStyles = {
  textDecoration: 'none'
};
const moreBtnStyles = {
  //set margin 0 here because safari puts extra margin around the button, rest is to reset style to make it look like a list element
  margin: 0,
  border: 0,
  background: 'transparent',
  fontWeight: 'normal',
  boxShadow: 'none',
  paddingY: 1,
  paddingX: 2
};
const getValidChildren = children => {
  return React.Children.toArray(children).filter(child => {
    return /*#__PURE__*/React.isValidElement(child);
  });
};
const calculatePossibleItems = (childWidthArray, navWidth, moreMenuWidth = 0) => {
  const widthToFit = navWidth - moreMenuWidth;
  let breakpoint = childWidthArray.length; // assume all items will fit
  let sumsOfChildWidth = 0;
  for (const [index, childWidth] of childWidthArray.entries()) {
    sumsOfChildWidth = sumsOfChildWidth + childWidth.width; // + GAP
    if (sumsOfChildWidth > widthToFit) {
      breakpoint = index;
      break;
    } else {
      continue;
    }
  }
  return breakpoint;
};
const overflowEffect = (navWidth, moreMenuWidth, childArray, childWidthArray, updateListAndMenu) => {
  if (childWidthArray.length === 0) {
    updateListAndMenu({
      items: childArray,
      menuItems: []
    });
  }
  const numberOfItemsPossible = calculatePossibleItems(childWidthArray, navWidth);
  const numberOfItemsPossibleWithMoreMenu = calculatePossibleItems(childWidthArray, navWidth, moreMenuWidth || MORE_BTN_WIDTH);
  const items = [];
  const menuItems = [];

  // First, we check if we can fit all the items with their icons
  if (childArray.length > numberOfItemsPossible) {
    /* Below is an accessibility requirement. Never show only one item in the overflow menu.
     * If there is only one item left to display in the overflow menu according to the calculation,
     * we need to pull another item from the list into the overflow menu.
     */
    const numberOfItemsInMenu = childArray.length - numberOfItemsPossibleWithMoreMenu;
    const numberOfListItems = numberOfItemsInMenu === 1 ? numberOfItemsPossibleWithMoreMenu - 1 : numberOfItemsPossibleWithMoreMenu;
    for (const [index, child] of childArray.entries()) {
      if (index < numberOfListItems) {
        items.push(child);
        //if the last item is a divider
      } else if (childWidthArray[index].text === 'divider') {
        if (index === numberOfListItems - 1 || index === numberOfListItems) {
          continue;
        } else {
          const divider = /*#__PURE__*/React.createElement(ActionList.Divider, {
            key: index
          });
          menuItems.push(divider);
        }
      } else {
        menuItems.push(child);
      }
    }
    updateListAndMenu({
      items,
      menuItems
    });
  }
};
const ActionBar = props => {
  const {
    size = 'medium',
    children,
    'aria-label': ariaLabel
  } = props;
  const [childWidthArray, setChildWidthArray] = useState([]);
  const setChildrenWidth = useCallback(size => {
    setChildWidthArray(arr => {
      const newArr = [...arr, size];
      return newArr;
    });
  }, []);
  const navRef = useRef(null);
  const listRef = useRef(null);
  const moreMenuRef = useRef(null);
  const moreMenuBtnRef = useRef(null);
  const containerRef = React.useRef(null);
  const validChildren = getValidChildren(children);
  // Responsive props object manages which items are in the list and which items are in the menu.
  const [responsiveProps, setResponsiveProps] = useState({
    items: validChildren,
    menuItems: []
  });

  // Make sure to have the fresh props data for list items when children are changed (keeping aria-current up-to-date)
  const listItems = responsiveProps.items.map(item => {
    var _validChildren$find;
    return (_validChildren$find = validChildren.find(child => child.key === item.key)) !== null && _validChildren$find !== void 0 ? _validChildren$find : item;
  });

  // Make sure to have the fresh props data for menu items when children are changed (keeping aria-current up-to-date)
  const menuItems = responsiveProps.menuItems.map(menuItem => {
    var _validChildren$find2;
    return (_validChildren$find2 = validChildren.find(child => child.key === menuItem.key)) !== null && _validChildren$find2 !== void 0 ? _validChildren$find2 : menuItem;
  });
  const updateListAndMenu = useCallback(props => {
    setResponsiveProps(props);
  }, []);
  useResizeObserver(resizeObserverEntries => {
    var _moreMenuRef$current$, _moreMenuRef$current;
    const navWidth = resizeObserverEntries[0].contentRect.width;
    const moreMenuWidth = (_moreMenuRef$current$ = (_moreMenuRef$current = moreMenuRef.current) === null || _moreMenuRef$current === void 0 ? void 0 : _moreMenuRef$current.getBoundingClientRect().width) !== null && _moreMenuRef$current$ !== void 0 ? _moreMenuRef$current$ : 0;
    navWidth !== 0 && overflowEffect(navWidth, moreMenuWidth, validChildren, childWidthArray, updateListAndMenu);
  }, navRef);
  const [isWidgetOpen, setIsWidgetOpen] = useState(false);
  const closeOverlay = React.useCallback(() => {
    setIsWidgetOpen(false);
  }, [setIsWidgetOpen]);
  const focusOnMoreMenuBtn = React.useCallback(() => {
    var _moreMenuBtnRef$curre;
    (_moreMenuBtnRef$curre = moreMenuBtnRef.current) === null || _moreMenuBtnRef$curre === void 0 ? void 0 : _moreMenuBtnRef$curre.focus();
  }, []);
  useOnEscapePress(event => {
    if (isWidgetOpen) {
      event.preventDefault();
      closeOverlay();
      focusOnMoreMenuBtn();
    }
  }, [isWidgetOpen]);
  useOnOutsideClick({
    onClickOutside: closeOverlay,
    containerRef,
    ignoreClickRefs: [moreMenuBtnRef]
  });
  useFocusZone({
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowHorizontal | FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap'
  });
  return /*#__PURE__*/React.createElement(ActionBarContext.Provider, {
    value: {
      size,
      setChildrenWidth
    }
  }, /*#__PURE__*/React.createElement(Box, {
    ref: navRef,
    sx: navStyles
  }, /*#__PURE__*/React.createElement(NavigationList, {
    sx: listStyles,
    ref: listRef,
    role: "toolbar"
  }, listItems, menuItems.length > 0 && /*#__PURE__*/React.createElement(ActionMenu, null, /*#__PURE__*/React.createElement(ActionMenu.Anchor, null, /*#__PURE__*/React.createElement(IconButton, {
    sx: moreBtnStyles,
    "aria-label": `More ${ariaLabel} items`,
    icon: KebabHorizontalIcon
  })), /*#__PURE__*/React.createElement(ActionMenu.Overlay, null, /*#__PURE__*/React.createElement(ActionList, null, menuItems.map((menuItem, index) => {
    if (menuItem.type === ActionList.Divider) {
      return /*#__PURE__*/React.createElement(ActionList.Divider, {
        key: index
      });
    } else {
      const {
        children: menuItemChildren,
        //'aria-current': ariaCurrent,
        onClick,
        icon: Icon,
        'aria-label': ariaLabel
      } = menuItem.props;
      return /*#__PURE__*/React.createElement(ActionList.LinkItem, {
        key: menuItemChildren,
        sx: menuItemStyles,
        onClick: event => {
          closeOverlay();
          focusOnMoreMenuBtn();
          typeof onClick === 'function' && onClick(event);
        }
      }, Icon ? /*#__PURE__*/React.createElement(ActionList.LeadingVisual, null, /*#__PURE__*/React.createElement(Icon, null)) : null, ariaLabel);
    }
  })))))));
};
ActionBar.displayName = "ActionBar";
const ActionBarIconButton = /*#__PURE__*/forwardRef((props, forwardedRef) => {
  const backupRef = useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const {
    size,
    setChildrenWidth
  } = React.useContext(ActionBarContext);
  useIsomorphicLayoutEffect(() => {
    const text = props['aria-label'] ? props['aria-label'] : '';
    const domRect = ref.current.getBoundingClientRect();
    setChildrenWidth({
      text,
      width: domRect.width
    });
  }, [ref, setChildrenWidth]);
  return /*#__PURE__*/React.createElement(IconButton, _extends({
    ref: ref,
    size: size
  }, props, {
    variant: "invisible"
  }));
});
const sizeToHeight = {
  small: '24px',
  medium: '28px',
  large: '32px'
};
const VerticalDivider = () => {
  const ref = useRef(null);
  const {
    size,
    setChildrenWidth
  } = React.useContext(ActionBarContext);
  useIsomorphicLayoutEffect(() => {
    const text = 'divider';
    const domRect = ref.current.getBoundingClientRect();
    setChildrenWidth({
      text,
      width: domRect.width
    });
  }, [ref, setChildrenWidth]);
  return /*#__PURE__*/React.createElement(Box, {
    ref: ref,
    "data-component": "ActionBar.VerticalDivider",
    "aria-hidden": "true",
    sx: {
      display: 'inline-block',
      borderLeft: '1px solid',
      borderColor: 'actionListItem.inlineDivider',
      height: sizeToHeight[size],
      mx: 2
    }
  });
};
VerticalDivider.displayName = "VerticalDivider";

export { ActionBar, ActionBarIconButton, VerticalDivider };
