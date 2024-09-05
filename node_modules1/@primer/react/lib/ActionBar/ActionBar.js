'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var index = require('../ActionList/index.js');
var useIsomorphicLayoutEffect = require('../utils/useIsomorphicLayoutEffect.js');
var styled = require('styled-components');
var sx = require('../sx.js');
var useOnEscapePress = require('../hooks/useOnEscapePress.js');
var useResizeObserver = require('../hooks/useResizeObserver.js');
var useOnOutsideClick = require('../hooks/useOnOutsideClick.js');
var IconButton = require('../Button/IconButton.js');
require('../Button/ButtonBase.js');
require('../utils/defaultSxProp.js');
require('../Button/Button.js');
var Box = require('../Box/Box.js');
var ActionMenu = require('../ActionMenu/ActionMenu.js');
var useFocusZone = require('../hooks/useFocusZone.js');
var behaviors = require('@primer/behaviors');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ActionBarContext = /*#__PURE__*/React__default.default.createContext({
  size: 'medium',
  setChildrenWidth: () => null
});

/*
small (28px), medium (32px), large (40px)
*/

const NavigationList = styled__default.default.div.withConfig({
  displayName: "ActionBar__NavigationList",
  componentId: "sc-ygrb3t-0"
})(["", ";"], sx.default);
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
  return React__default.default.Children.toArray(children).filter(child => {
    return /*#__PURE__*/React__default.default.isValidElement(child);
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
    for (const [index$1, child] of childArray.entries()) {
      if (index$1 < numberOfListItems) {
        items.push(child);
        //if the last item is a divider
      } else if (childWidthArray[index$1].text === 'divider') {
        if (index$1 === numberOfListItems - 1 || index$1 === numberOfListItems) {
          continue;
        } else {
          const divider = /*#__PURE__*/React__default.default.createElement(index.ActionList.Divider, {
            key: index$1
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
  const [childWidthArray, setChildWidthArray] = React.useState([]);
  const setChildrenWidth = React.useCallback(size => {
    setChildWidthArray(arr => {
      const newArr = [...arr, size];
      return newArr;
    });
  }, []);
  const navRef = React.useRef(null);
  const listRef = React.useRef(null);
  const moreMenuRef = React.useRef(null);
  const moreMenuBtnRef = React.useRef(null);
  const containerRef = React__default.default.useRef(null);
  const validChildren = getValidChildren(children);
  // Responsive props object manages which items are in the list and which items are in the menu.
  const [responsiveProps, setResponsiveProps] = React.useState({
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
  const updateListAndMenu = React.useCallback(props => {
    setResponsiveProps(props);
  }, []);
  useResizeObserver.useResizeObserver(resizeObserverEntries => {
    var _moreMenuRef$current$, _moreMenuRef$current;
    const navWidth = resizeObserverEntries[0].contentRect.width;
    const moreMenuWidth = (_moreMenuRef$current$ = (_moreMenuRef$current = moreMenuRef.current) === null || _moreMenuRef$current === void 0 ? void 0 : _moreMenuRef$current.getBoundingClientRect().width) !== null && _moreMenuRef$current$ !== void 0 ? _moreMenuRef$current$ : 0;
    navWidth !== 0 && overflowEffect(navWidth, moreMenuWidth, validChildren, childWidthArray, updateListAndMenu);
  }, navRef);
  const [isWidgetOpen, setIsWidgetOpen] = React.useState(false);
  const closeOverlay = React__default.default.useCallback(() => {
    setIsWidgetOpen(false);
  }, [setIsWidgetOpen]);
  const focusOnMoreMenuBtn = React__default.default.useCallback(() => {
    var _moreMenuBtnRef$curre;
    (_moreMenuBtnRef$curre = moreMenuBtnRef.current) === null || _moreMenuBtnRef$curre === void 0 ? void 0 : _moreMenuBtnRef$curre.focus();
  }, []);
  useOnEscapePress.useOnEscapePress(event => {
    if (isWidgetOpen) {
      event.preventDefault();
      closeOverlay();
      focusOnMoreMenuBtn();
    }
  }, [isWidgetOpen]);
  useOnOutsideClick.useOnOutsideClick({
    onClickOutside: closeOverlay,
    containerRef,
    ignoreClickRefs: [moreMenuBtnRef]
  });
  useFocusZone.useFocusZone({
    containerRef: listRef,
    bindKeys: behaviors.FocusKeys.ArrowHorizontal | behaviors.FocusKeys.HomeAndEnd,
    focusOutBehavior: 'wrap'
  });
  return /*#__PURE__*/React__default.default.createElement(ActionBarContext.Provider, {
    value: {
      size,
      setChildrenWidth
    }
  }, /*#__PURE__*/React__default.default.createElement(Box, {
    ref: navRef,
    sx: navStyles
  }, /*#__PURE__*/React__default.default.createElement(NavigationList, {
    sx: listStyles,
    ref: listRef,
    role: "toolbar"
  }, listItems, menuItems.length > 0 && /*#__PURE__*/React__default.default.createElement(ActionMenu.ActionMenu, null, /*#__PURE__*/React__default.default.createElement(ActionMenu.ActionMenu.Anchor, null, /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, {
    sx: moreBtnStyles,
    "aria-label": `More ${ariaLabel} items`,
    icon: octiconsReact.KebabHorizontalIcon
  })), /*#__PURE__*/React__default.default.createElement(ActionMenu.ActionMenu.Overlay, null, /*#__PURE__*/React__default.default.createElement(index.ActionList, null, menuItems.map((menuItem, index$1) => {
    if (menuItem.type === index.ActionList.Divider) {
      return /*#__PURE__*/React__default.default.createElement(index.ActionList.Divider, {
        key: index$1
      });
    } else {
      const {
        children: menuItemChildren,
        //'aria-current': ariaCurrent,
        onClick,
        icon: Icon,
        'aria-label': ariaLabel
      } = menuItem.props;
      return /*#__PURE__*/React__default.default.createElement(index.ActionList.LinkItem, {
        key: menuItemChildren,
        sx: menuItemStyles,
        onClick: event => {
          closeOverlay();
          focusOnMoreMenuBtn();
          typeof onClick === 'function' && onClick(event);
        }
      }, Icon ? /*#__PURE__*/React__default.default.createElement(index.ActionList.LeadingVisual, null, /*#__PURE__*/React__default.default.createElement(Icon, null)) : null, ariaLabel);
    }
  })))))));
};
ActionBar.displayName = "ActionBar";
const ActionBarIconButton = /*#__PURE__*/React.forwardRef((props, forwardedRef) => {
  const backupRef = React.useRef(null);
  const ref = forwardedRef !== null && forwardedRef !== void 0 ? forwardedRef : backupRef;
  const {
    size,
    setChildrenWidth
  } = React__default.default.useContext(ActionBarContext);
  useIsomorphicLayoutEffect(() => {
    const text = props['aria-label'] ? props['aria-label'] : '';
    const domRect = ref.current.getBoundingClientRect();
    setChildrenWidth({
      text,
      width: domRect.width
    });
  }, [ref, setChildrenWidth]);
  return /*#__PURE__*/React__default.default.createElement(IconButton.IconButton, _extends({
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
  const ref = React.useRef(null);
  const {
    size,
    setChildrenWidth
  } = React__default.default.useContext(ActionBarContext);
  useIsomorphicLayoutEffect(() => {
    const text = 'divider';
    const domRect = ref.current.getBoundingClientRect();
    setChildrenWidth({
      text,
      width: domRect.width
    });
  }, [ref, setChildrenWidth]);
  return /*#__PURE__*/React__default.default.createElement(Box, {
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

exports.ActionBar = ActionBar;
exports.ActionBarIconButton = ActionBarIconButton;
exports.VerticalDivider = VerticalDivider;
