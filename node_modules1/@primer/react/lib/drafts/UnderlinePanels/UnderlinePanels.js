'use strict';

var React = require('react');
var tabContainerElement = require('../../node_modules/@github/tab-container-element/dist/tab-container-element.js');
require('../../node_modules/@github/tab-container-element/dist/tab-container-element-define.js');
var createComponent = require('../../utils/create-component.js');
var UnderlineTabbedInterface = require('../../internal/components/UnderlineTabbedInterface.js');
var Box = require('../../Box/Box.js');
require('@primer/behaviors/utils');
require('@primer/behaviors');
var useResizeObserver = require('../../hooks/useResizeObserver.js');
var useIsomorphicLayoutEffect = require('../../utils/useIsomorphicLayoutEffect.js');
var useId = require('../../hooks/useId.js');
var invariant = require('../../utils/invariant.js');
require('@styled-system/css');
var merge = require('deepmerge');
var defaultSxProp = require('../../utils/defaultSxProp.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TabContainerComponent = createComponent.createComponent(tabContainerElement.TabContainerElement, 'tab-container');
const UnderlinePanels = ({
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
  children,
  loadingCounters,
  sx: sxProp = defaultSxProp.defaultSxProp,
  ...props
}) => {
  const [iconsVisible, setIconsVisible] = React.useState(true);
  const wrapperRef = React.useRef(null);
  const listRef = React.useRef(null);
  // We need to always call useId() because React Hooks must be
  // called in the exact same order in every component render
  const parentId = useId.useId(props.id);

  // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
  // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
  let tabIndex = 0;
  let panelIndex = 0;
  const childrenWithProps = React.Children.map(children, child => {
    if ( /*#__PURE__*/React.isValidElement(child) && child.type === Tab) {
      return /*#__PURE__*/React.cloneElement(child, {
        id: `${parentId}-tab-${tabIndex++}`,
        loadingCounters,
        iconsVisible
      });
    }
    if ( /*#__PURE__*/React.isValidElement(child) && child.type === Panel) {
      return /*#__PURE__*/React.cloneElement(child, {
        'aria-labelledby': `${parentId}-tab-${panelIndex++}`
      });
    }
    return child;
  });

  // `tabs` and `tabPanels` need to be refs because `child.type === {type}` will become false
  // after the elements are cloned by `childrenWithProps` on the first render
  const tabs = React.useRef(React.Children.toArray(childrenWithProps).filter(child => {
    return /*#__PURE__*/React.isValidElement(child) && child.type === Tab;
  }));
  const tabPanels = React.useRef(React.Children.toArray(childrenWithProps).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type === Panel));
  const tabsHaveIcons = tabs.current.some(tab => /*#__PURE__*/React__default.default.isValidElement(tab) && tab.props.icon);

  // this is a workaround to get the list's width on the first render
  const [listWidth, setListWidth] = React.useState(0);
  useIsomorphicLayoutEffect(() => {
    var _listRef$current$getB, _listRef$current;
    if (!tabsHaveIcons) {
      return;
    }
    setListWidth((_listRef$current$getB = (_listRef$current = listRef.current) === null || _listRef$current === void 0 ? void 0 : _listRef$current.getBoundingClientRect().width) !== null && _listRef$current$getB !== void 0 ? _listRef$current$getB : 0);
  }, [tabsHaveIcons]);

  // when the wrapper resizes, check if the icons should be visible
  // by comparing the wrapper width to the list width
  useResizeObserver.useResizeObserver(resizeObserverEntries => {
    if (!tabsHaveIcons) {
      return;
    }
    const wrapperWidth = resizeObserverEntries[0].contentRect.width;
    setIconsVisible(wrapperWidth > listWidth);
  }, wrapperRef);
  if (process.env.NODE_ENV !== "production") {
    // only one tab can be selected at a time
    const selectedTabs = tabs.current.filter(tab => {
      const ariaSelected = /*#__PURE__*/React__default.default.isValidElement(tab) && tab.props['aria-selected'];
      return ariaSelected === true || ariaSelected === 'true';
    });
    !(selectedTabs.length <= 1) ? process.env.NODE_ENV !== "production" ? invariant.invariant(false, 'Only one tab can be selected at a time.') : invariant.invariant(false) : void 0;

    // every tab has its panel
    !(tabs.current.length === tabPanels.current.length) ? process.env.NODE_ENV !== "production" ? invariant.invariant(false, `The number of tabs and panels must be equal. Counted ${tabs.current.length} tabs and ${tabPanels.current.length} panels.`) : invariant.invariant(false) : void 0;
  }
  return /*#__PURE__*/React__default.default.createElement(TabContainerComponent, null, /*#__PURE__*/React__default.default.createElement(UnderlineTabbedInterface.StyledUnderlineWrapper, _extends({
    ref: wrapperRef,
    slot: "tablist-wrapper",
    "data-icons-visible": iconsVisible,
    sx: merge__default.default({
      width: '100%',
      overflowX: 'auto',
      overflowY: 'hidden',
      '-webkit-overflow-scrolling': 'auto',
      '&[data-icons-visible="false"] [data-component="icon"]': {
        display: 'none'
      }
    }, sxProp)
  }, props), /*#__PURE__*/React__default.default.createElement(UnderlineTabbedInterface.StyledUnderlineItemList, {
    ref: listRef,
    "aria-label": ariaLabel,
    "aria-labelledby": ariaLabelledBy,
    role: "tablist"
  }, tabs.current)), tabPanels.current);
};
UnderlinePanels.displayName = "UnderlinePanels";
const Tab = ({
  'aria-selected': ariaSelected,
  sx: sxProp = defaultSxProp.defaultSxProp,
  ...props
}) => /*#__PURE__*/React__default.default.createElement(UnderlineTabbedInterface.UnderlineItem, _extends({
  as: "button",
  role: "tab",
  tabIndex: ariaSelected ? 0 : -1,
  "aria-selected": ariaSelected,
  sx: sxProp
}, props));
Tab.displayName = "Tab";
Tab.displayName = 'UnderlinePanels.Tab';
const Panel = props => {
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({
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

module.exports = UnderlinePanels$1;
