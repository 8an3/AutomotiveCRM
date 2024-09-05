import React, { useState, useRef, Children, isValidElement, cloneElement } from 'react';
import { TabContainerElement } from '@github/tab-container-element';
import { createComponent } from '../../utils/create-component.js';
import { StyledUnderlineWrapper, StyledUnderlineItemList, UnderlineItem } from '../../internal/components/UnderlineTabbedInterface.js';
import Box from '../../Box/Box.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useResizeObserver } from '../../hooks/useResizeObserver.js';
import useIsomorphicLayoutEffect from '../../utils/useIsomorphicLayoutEffect.js';
import { useId } from '../../hooks/useId.js';
import { invariant } from '../../utils/invariant.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { defaultSxProp } from '../../utils/defaultSxProp.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TabContainerComponent = createComponent(TabContainerElement, 'tab-container');
const UnderlinePanels = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  loadingCounters,
  sx: sxProp = defaultSxProp,
  ...props
}) => {
  const [iconsVisible, setIconsVisible] = useState(true);
  const wrapperRef = useRef(null);
  const listRef = useRef(null);
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId(props.id);

  // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
  // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
  let tabIndex = 0;
  let panelIndex = 0;
  const childrenWithProps = Children.map(children, child => {
    if ( /*#__PURE__*/isValidElement(child) && child.type === Tab) {
      return /*#__PURE__*/cloneElement(child, {
        id: `${parentId}-tab-${tabIndex++}`,
        loadingCounters,
        iconsVisible
      });
    }
    if ( /*#__PURE__*/isValidElement(child) && child.type === Panel) {
      return /*#__PURE__*/cloneElement(child, {
        'aria-labelledby': `${parentId}-tab-${panelIndex++}`
      });
    }
    return child;
  });

  // `tabs` and `tabPanels` need to be refs because `child.type === {type}` will become false
  // after the elements are cloned by `childrenWithProps` on the first render
  const tabs = useRef(Children.toArray(childrenWithProps).filter(child => {
    return /*#__PURE__*/isValidElement(child) && child.type === Tab;
  }));
  const tabPanels = useRef(Children.toArray(childrenWithProps).filter(child => /*#__PURE__*/isValidElement(child) && child.type === Panel));
  const tabsHaveIcons = tabs.current.some(tab => /*#__PURE__*/React.isValidElement(tab) && tab.props.icon);

  // this is a workaround to get the list's width on the first render
  const [listWidth, setListWidth] = useState(0);
  useIsomorphicLayoutEffect(() => {
    var _listRef$current$getB, _listRef$current;
    if (!tabsHaveIcons) {
      return;
    }
    setListWidth((_listRef$current$getB = (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.getBoundingClientRect().width) !== null && _listRef$current$getB !== void 0 ? _listRef$current$getB : 0);
  }, [tabsHaveIcons]);

  // when the wrapper resizes, check if the icons should be visible
  // by comparing the wrapper width to the list width
  useResizeObserver(resizeObserverEntries => {
    if (!tabsHaveIcons) {
      return;
    }
    const wrapperWidth = resizeObserverEntries[0].contentRect.width;
    setIconsVisible(wrapperWidth > listWidth);
  }, wrapperRef);
  if (process.env.NODE_ENV !== "production") {
    // only one tab can be selected at a time
    const selectedTabs = tabs.current.filter(tab => {
      const ariaSelected = /*#__PURE__*/React.isValidElement(tab) && tab.props['aria-selected'];
      return ariaSelected === true || ariaSelected === 'true';
    });
    !(selectedTabs.length <= 1) ? process.env.NODE_ENV !== "production" ? invariant(false, 'Only one tab can be selected at a time.') : invariant(false) : void 0;

    // every tab has its panel
    !(tabs.current.length === tabPanels.current.length) ? process.env.NODE_ENV !== "production" ? invariant(false, `The number of tabs and panels must be equal. Counted ${tabs.current.length} tabs and ${tabPanels.current.length} panels.`) : invariant(false) : void 0;
  }
  return /*#__PURE__*/React.createElement(TabContainerComponent, null, /*#__PURE__*/React.createElement(StyledUnderlineWrapper, _extends({
    ref: wrapperRef,
    slot: "tablist-wrapper",
    "data-icons-visible": iconsVisible,
    sx: merge({
      width: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      '-webkit-overflow-scrolling': 'auto',
      '&[data-icons-visible="false"] [data-component="icon"]': {
        display: 'none'
      }
    }, sxProp)
  }, props), /*#__PURE__*/React.createElement(StyledUnderlineItemList, {
    ref: listRef,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    role: "tablist"
  }, tabs.current)), tabPanels.current);
};
UnderlinePanels.displayName = "UnderlinePanels";
const Tab = ({
  'aria-selected': ariaSelected,
  sx: sxProp = defaultSxProp,
  ...props
}) => /*#__PURE__*/React.createElement(UnderlineItem, _extends({
  as: "button",
  role: "tab",
  tabIndex: ariaSelected ? 0 : -1,
  "aria-selected": ariaSelected,
  sx: sxProp
}, props));
Tab.displayName = "Tab";
Tab.displayName = 'UnderlinePanels.Tab';
const Panel = props => {
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "div",
    role: "tabpanel"
  }, props));
};
Panel.displayName = "Panel";
Panel.displayName = 'UnderlinePanels.Panel';
var UnderlinePanels$1 = Object.assign(UnderlinePanels, {
  Panel,
  Tab
});

export { UnderlinePanels$1 as default };
