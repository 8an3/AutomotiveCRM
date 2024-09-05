'use strict';

var clsx = require('clsx');
var React = require('react');
var styled = require('styled-components');
var constants = require('../../constants.js');
var tabContainerElement = require('../../node_modules/@github/tab-container-element/dist/tab-container-element.js');
require('../../node_modules/@github/tab-container-element/dist/tab-container-element-define.js');
var createComponent = require('../../utils/create-component.js');
var sx = require('../../sx.js');
var getGlobalFocusStyles = require('../../internal/utils/getGlobalFocusStyles.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var clsx__default = /*#__PURE__*/_interopDefault(clsx);
var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const TAB_CLASS = 'TabPanel-tab';
const tabContainerComponent = createComponent.createComponent(tabContainerElement.TabContainerElement, 'tab-container');
const TabContainer = styled__default.default(tabContainerComponent).withConfig({
  displayName: "TabPanels__TabContainer",
  componentId: "sc-vjfsxc-0"
})(["& > :not([role='tabpanel']){display:inline-block;}&::part(tablist-wrapper){margin-top:0;margin-bottom:16px;border-bottom:1px solid ", ";}&:not(:defined) [role='tabpanel']{margin-top:17px;display:none;}&:not(:defined) [role='tab']:nth-of-type(1)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(1),&:not(:defined) [role='tab']:nth-of-type(2)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(2),&:not(:defined) [role='tab']:nth-of-type(3)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(3),&:not(:defined) [role='tab']:nth-of-type(4)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(4),&:not(:defined) [role='tab']:nth-of-type(5)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(5),&:not(:defined) [role='tab']:nth-of-type(6)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(6),&:not(:defined) [role='tab']:nth-of-type(7)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(7),&:not(:defined) [role='tab']:nth-of-type(8)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(8),&:not(:defined) [role='tab']:nth-of-type(9)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(9),&:not(:defined) [role='tab']:nth-of-type(10)[aria-selected='true'] ~ [role='tabpanel']:nth-of-type(10){display:block;}&:not(:defined):not(:has([aria-selected='true'])) [role='tabpanel']:first-of-type{display:block;}&:not(:has([aria-selected='true'])) [role='tab'] ~ [role='tab']{color:", ";background-color:transparent;border:1px solid transparent;}&:not(:has([aria-selected='true'])) [role='tab'],& [role='tab'][aria-selected='true']{color:", ";border-color:", ";border-top-right-radius:", ";border-top-left-radius:", ";background-color:", ";}&:not(:defined):not(:has([aria-selected='true'])) [role='tab'] ~ [role='tab'],&:not(:defined):has([aria-selected='true']) [role='tab']:not([aria-selected='true']){padding:8px 16px;border-bottom:1px solid ", ";}&:not(:defined) :not([role='tabpanel']){vertical-align:top;}", ";"], constants.get('colors.border.default'), constants.get('colors.fg.muted'), constants.get('colors.fg.default'), constants.get('colors.border.default'), constants.get('radii.2'), constants.get('radii.2'), constants.get('colors.canvas.default'), constants.get('colors.border.default'), sx.default);
function TabPanels({
  children,
  defaultTabIndex,
  ...props
}) {
  var _props$id;
  // We need to always call React.useId() because
  // React Hooks must be called in the exact same order in every component render
  const defaultId = React__default.default.useId();
  const parentId = (_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : defaultId;
  if (defaultTabIndex !== undefined) {
    // Add 'dafault-tab' to props
    props['default-tab'] = defaultTabIndex;
  }

  // Loop through the chidren, if it's a tab, then add id="{id}-tab-{index}"
  // If it's a panel, then add aria-labelledby="{id}-tab-{index}"
  let tabIndex = 0;
  let panelIndex = 0;
  const childrenWithProps = React__default.default.Children.map(children, child => {
    if ( /*#__PURE__*/React__default.default.isValidElement(child) && child.type === Tab) {
      if (props.selectedTabIndex === tabIndex) {
        return /*#__PURE__*/React__default.default.cloneElement(child, {
          id: `${parentId}-tab-${tabIndex++}`,
          selected: true
        });
      }
      return /*#__PURE__*/React__default.default.cloneElement(child, {
        id: `${parentId}-tab-${tabIndex++}`
      });
    }
    if ( /*#__PURE__*/React__default.default.isValidElement(child) && child.type === Panel) {
      return /*#__PURE__*/React__default.default.cloneElement(child, {
        'aria-labelledby': `${parentId}-tab-${panelIndex++}`
      });
    }
    return child;
  });
  return /*#__PURE__*/React__default.default.createElement(TabContainer, _extends({}, props, {
    id: parentId
  }), childrenWithProps);
}
TabPanels.displayName = "TabPanels";
const Tab = styled__default.default.button.attrs(props => ({
  className: clsx__default.default(TAB_CLASS, props.className),
  role: 'tab',
  'aria-selected': !!props.selected,
  suppressHydrationWarning: true
})).withConfig({
  displayName: "TabPanels__Tab",
  componentId: "sc-vjfsxc-1"
})(["padding:8px 16px 9px 16px;font-size:", ";line-height:23px;color:", ";text-decoration:none;background-color:transparent;border:1px solid transparent;border-bottom:0;margin-bottom:-1px;cursor:pointer;", ";&:hover,&:focus{color:", ";text-decoration:none;}&:hover{transition-duration:0.1s;transition-property:color;}", ";"], constants.get('fontSizes.1'), constants.get('colors.fg.muted'), getGlobalFocusStyles('-6px'), constants.get('colors.fg.default'), sx.default);
Tab.displayName = 'TabPanels.Tab';
const Panel = styled__default.default.div.attrs(() => ({
  role: 'tabpanel',
  suppressHydrationWarning: true
})).withConfig({
  displayName: "TabPanels__Panel",
  componentId: "sc-vjfsxc-2"
})(["", ";"], sx.default);
Panel.displayName = 'TabPanels.Panel';
var TabPanels$1 = Object.assign(TabPanels, {
  Panel,
  Tab
});

module.exports = TabPanels$1;
