'use strict';

var React = require('react');
var styled = require('styled-components');
var sx = require('../sx.js');
var ActionListContainerContext = require('./ActionListContainerContext.js');
var defaultSxProp = require('../utils/defaultSxProp.js');
var useSlots = require('../hooks/useSlots.js');
var Heading = require('./Heading.js');
var useId = require('../hooks/useId.js');
var shared = require('./shared.js');
var useProvidedRefOrCreate = require('../hooks/useProvidedRefOrCreate.js');
require('@primer/behaviors/utils');
var behaviors = require('@primer/behaviors');
var useFocusZone = require('../hooks/useFocusZone.js');
var merge = require('deepmerge');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ListBox = styled__default.default.ul.withConfig({
  displayName: "List__ListBox",
  componentId: "sc-1x7olzq-0"
})(sx.default);
const List = /*#__PURE__*/React__default.default.forwardRef(({
  variant = 'inset',
  selectionVariant,
  showDividers = false,
  role,
  sx: sxProp = defaultSxProp.defaultSxProp,
  ...props
}, forwardedRef) => {
  var _slots$heading$props$;
  const styles = {
    margin: 0,
    paddingInlineStart: 0,
    // reset ul styles
    paddingY: variant === 'inset' ? 2 : 0
  };
  const [slots, childrenWithoutSlots] = useSlots.useSlots(props.children, {
    heading: Heading.Heading
  });
  const headingId = useId.useId();

  /** if list is inside a Menu, it will get a role from the Menu */
  const {
    listRole,
    listLabelledBy,
    selectionVariant: containerSelectionVariant,
    // TODO: Remove after DropdownMenu2 deprecation
    enableFocusZone
  } = React__default.default.useContext(ActionListContainerContext.ActionListContainerContext);
  const ariaLabelledBy = slots.heading ? (_slots$heading$props$ = slots.heading.props.id) !== null && _slots$heading$props$ !== void 0 ? _slots$heading$props$ : headingId : listLabelledBy;
  const listRef = useProvidedRefOrCreate.useProvidedRefOrCreate(forwardedRef);
  useFocusZone.useFocusZone({
    disabled: !enableFocusZone,
    containerRef: listRef,
    bindKeys: behaviors.FocusKeys.ArrowVertical | behaviors.FocusKeys.HomeAndEnd | behaviors.FocusKeys.PageUpDown
  });
  return /*#__PURE__*/React__default.default.createElement(shared.ListContext.Provider, {
    value: {
      variant,
      selectionVariant: selectionVariant || containerSelectionVariant,
      showDividers,
      role: role || listRole,
      headingId
    }
  }, slots.heading, /*#__PURE__*/React__default.default.createElement(ListBox, _extends({
    sx: merge__default.default(styles, sxProp),
    role: role || listRole,
    "aria-labelledby": ariaLabelledBy
  }, props, {
    ref: listRef
  }), childrenWithoutSlots));
});
List.displayName = 'ActionList';

exports.List = List;
