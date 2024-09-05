import { ChevronDownIcon } from '@primer/octicons-react';
import React, { isValidElement } from 'react';
import styled from 'styled-components';
import { ActionList } from '../ActionList/index.js';
import { ActionListContainerContext } from '../ActionList/ActionListContainerContext.js';
import Box from '../Box/Box.js';
import Octicon from '../Octicon/Octicon.js';
import sx from '../sx.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { useId } from '../hooks/useId.js';
import useIsomorphicLayoutEffect from '../utils/useIsomorphicLayoutEffect.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const getSubnavStyles = depth => {
  return {
    paddingLeft: depth > 0 ? depth + 2 : null,
    // Indent sub-items
    fontSize: depth > 0 ? 0 : null,
    // Reduce font size of sub-items
    fontWeight: depth > 0 ? 'normal' : null // Sub-items don't get bolded
  };
};

// ----------------------------------------------------------------------------
// NavList

const NavBox = styled.nav.withConfig({
  displayName: "NavList__NavBox",
  componentId: "sc-1c8ygf7-0"
})(sx);
const Root = /*#__PURE__*/React.forwardRef(({
  children,
  ...props
}, ref) => {
  return /*#__PURE__*/React.createElement(NavBox, _extends({}, props, {
    ref: ref
  }), /*#__PURE__*/React.createElement(ActionListContainerContext.Provider, {
    value: {
      container: 'NavList'
    }
  }, /*#__PURE__*/React.createElement(ActionList, null, children)));
});
Root.displayName = 'NavList';

// ----------------------------------------------------------------------------
// NavList.Item

const Item = /*#__PURE__*/React.forwardRef(({
  'aria-current': ariaCurrent,
  children,
  defaultOpen,
  sx: sxProp = defaultSxProp,
  ...props
}, ref) => {
  const {
    depth
  } = React.useContext(SubNavContext);

  // Get SubNav from children
  const subNav = React.Children.toArray(children).find(child => /*#__PURE__*/isValidElement(child) && child.type === SubNav);

  // Get children without SubNav or TrailingAction
  const childrenWithoutSubNavOrTrailingAction = React.Children.toArray(children).filter(child => /*#__PURE__*/isValidElement(child) ? child.type !== SubNav && child.type !== TrailingAction : true);
  if (! /*#__PURE__*/isValidElement(subNav) && defaultOpen)
    // eslint-disable-next-line no-console
    console.error('NavList.Item must have a NavList.SubNav to use defaultOpen.');

  // Render ItemWithSubNav if SubNav is present
  if (subNav && /*#__PURE__*/isValidElement(subNav)) {
    return /*#__PURE__*/React.createElement(ItemWithSubNav, {
      subNav: subNav,
      depth: depth,
      defaultOpen: defaultOpen,
      sx: sxProp
    }, childrenWithoutSubNavOrTrailingAction);
  }
  return /*#__PURE__*/React.createElement(ActionList.LinkItem, _extends({
    ref: ref,
    "aria-current": ariaCurrent,
    active: Boolean(ariaCurrent) && ariaCurrent !== 'false',
    sx: merge(getSubnavStyles(depth), sxProp)
  }, props), children);
});
Item.displayName = 'NavList.Item';

// ----------------------------------------------------------------------------
// ItemWithSubNav (internal)

const ItemWithSubNavContext = /*#__PURE__*/React.createContext({
  buttonId: '',
  subNavId: '',
  isOpen: false
});

// TODO: ref prop
// TODO: Animate open/close transition
function ItemWithSubNav({
  children,
  subNav,
  depth,
  defaultOpen,
  sx: sxProp = defaultSxProp
}) {
  var _ref;
  const buttonId = useId();
  const subNavId = useId();
  const [isOpen, setIsOpen] = React.useState((_ref = defaultOpen || null) !== null && _ref !== void 0 ? _ref : false);
  const subNavRef = React.useRef(null);
  const [containsCurrentItem, setContainsCurrentItem] = React.useState(false);
  useIsomorphicLayoutEffect(() => {
    if (subNavRef.current) {
      // Check if SubNav contains current item
      // valid values: page, step, location, date, time, true and false
      const currentItem = subNavRef.current.querySelector('[aria-current]:not([aria-current=false])');
      if (currentItem) {
        setContainsCurrentItem(true);
        setIsOpen(true);
      }
    }
  }, [subNav, buttonId]);
  return /*#__PURE__*/React.createElement(ItemWithSubNavContext.Provider, {
    value: {
      buttonId,
      subNavId,
      isOpen
    }
  }, /*#__PURE__*/React.createElement(Box, {
    as: "li",
    "aria-labelledby": buttonId,
    sx: {
      listStyle: 'none'
    }
  }, /*#__PURE__*/React.createElement(ActionList.Item, {
    as: "button",
    id: buttonId,
    "aria-expanded": isOpen,
    "aria-controls": subNavId
    // When the subNav is closed, how should we indicated that the subNav contains the current item?
    ,
    active: !isOpen && containsCurrentItem,
    onClick: () => setIsOpen(open => !open),
    sx: merge({
      ...getSubnavStyles(depth),
      fontWeight: containsCurrentItem ? 'bold' : null // Parent item is bold if any of it's sub-items are current
    }, sxProp)
  }, children, /*#__PURE__*/React.createElement(ActionList.TrailingVisual, null, /*#__PURE__*/React.createElement(Octicon, {
    icon: ChevronDownIcon,
    sx: {
      transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)'
    }
  }))), /*#__PURE__*/React.createElement("div", {
    ref: subNavRef
  }, subNav)));
}
ItemWithSubNav.displayName = "ItemWithSubNav"; // ----------------------------------------------------------------------------
// NavList.SubNav
const SubNavContext = /*#__PURE__*/React.createContext({
  depth: 0
});

// TODO: ref prop
// NOTE: SubNav must be a direct child of an Item
const SubNav = ({
  children,
  sx: sxProp = defaultSxProp
}) => {
  const {
    buttonId,
    subNavId,
    isOpen
  } = React.useContext(ItemWithSubNavContext);
  const {
    depth
  } = React.useContext(SubNavContext);
  if (!buttonId || !subNavId) {
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav must be a child of a NavList.Item');
  }
  if (depth > 3) {
    // TODO: write a more informative error message that directs people to rethink their IA
    // eslint-disable-next-line no-console
    console.error('NavList.SubNav only supports four levels of nesting');
    return null;
  }
  return /*#__PURE__*/React.createElement(SubNavContext.Provider, {
    value: {
      depth: depth + 1
    }
  }, /*#__PURE__*/React.createElement(Box, {
    as: "ul",
    id: subNavId,
    "aria-labelledby": buttonId,
    sx: merge({
      padding: 0,
      margin: 0,
      display: isOpen ? 'block' : 'none'
    }, sxProp)
  }, children));
};
SubNav.displayName = "SubNav";
SubNav.displayName = 'NavList.SubNav';

// ----------------------------------------------------------------------------
// NavList.LeadingVisual

const LeadingVisual = ActionList.LeadingVisual;
LeadingVisual.displayName = 'NavList.LeadingVisual';

// ----------------------------------------------------------------------------
// NavList.TrailingVisual

const TrailingVisual = ActionList.TrailingVisual;
TrailingVisual.displayName = 'NavList.TrailingVisual';

// ----------------------------------------------------------------------------
// NavList.Divider

const Divider = ActionList.Divider;
Divider.displayName = 'NavList.Divider';

// NavList.TrailingAction

const TrailingAction = ActionList.TrailingAction;
TrailingAction.displayName = 'NavList.TrailingAction';

// ----------------------------------------------------------------------------
// NavList.Group

const defaultSx = {};
// TODO: ref prop
const Group = ({
  title,
  children,
  sx: sxProp = defaultSx,
  ...props
}) => {
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(ActionList.Divider, {
    sx: {
      '&:first-child': {
        display: 'none'
      }
    }
  }), /*#__PURE__*/React.createElement(ActionList.Group, _extends({}, props, {
    sx: sxProp
  }), title ? /*#__PURE__*/React.createElement(ActionList.GroupHeading, {
    as: "h3"
  }, title) : null, children));
};
Group.displayName = 'NavList.Group';

// ----------------------------------------------------------------------------
// Export

const NavList = Object.assign(Root, {
  Item,
  SubNav,
  LeadingVisual,
  TrailingVisual,
  TrailingAction,
  Divider,
  Group
});

export { NavList };
