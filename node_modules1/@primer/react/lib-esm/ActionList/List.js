import React from 'react';
import styled from 'styled-components';
import sx from '../sx.js';
import { ActionListContainerContext } from './ActionListContainerContext.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { useSlots } from '../hooks/useSlots.js';
import { Heading } from './Heading.js';
import { useId } from '../hooks/useId.js';
import { ListContext } from './shared.js';
import { useProvidedRefOrCreate } from '../hooks/useProvidedRefOrCreate.js';
import '@primer/behaviors/utils';
import { FocusKeys } from '@primer/behaviors';
import { useFocusZone } from '../hooks/useFocusZone.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const ListBox = styled.ul.withConfig({
  displayName: "List__ListBox",
  componentId: "sc-1x7olzq-0"
})(sx);
const List = /*#__PURE__*/React.forwardRef(({
  variant = 'inset',
  selectionVariant,
  showDividers = false,
  role,
  sx: sxProp = defaultSxProp,
  ...props
}, forwardedRef) => {
  var _slots$heading$props$;
  const styles = {
    margin: 0,
    paddingInlineStart: 0,
    // reset ul styles
    paddingY: variant === 'inset' ? 2 : 0
  };
  const [slots, childrenWithoutSlots] = useSlots(props.children, {
    heading: Heading
  });
  const headingId = useId();

  /** if list is inside a Menu, it will get a role from the Menu */
  const {
    listRole,
    listLabelledBy,
    selectionVariant: containerSelectionVariant,
    // TODO: Remove after DropdownMenu2 deprecation
    enableFocusZone
  } = React.useContext(ActionListContainerContext);
  const ariaLabelledBy = slots.heading ? (_slots$heading$props$ = slots.heading.props.id) !== null && _slots$heading$props$ !== void 0 ? _slots$heading$props$ : headingId : listLabelledBy;
  const listRef = useProvidedRefOrCreate(forwardedRef);
  useFocusZone({
    disabled: !enableFocusZone,
    containerRef: listRef,
    bindKeys: FocusKeys.ArrowVertical | FocusKeys.HomeAndEnd | FocusKeys.PageUpDown
  });
  return /*#__PURE__*/React.createElement(ListContext.Provider, {
    value: {
      variant,
      selectionVariant: selectionVariant || containerSelectionVariant,
      showDividers,
      role: role || listRole,
      headingId
    }
  }, slots.heading, /*#__PURE__*/React.createElement(ListBox, _extends({
    sx: merge(styles, sxProp),
    role: role || listRole,
    "aria-labelledby": ariaLabelledBy
  }, props, {
    ref: listRef
  }), childrenWithoutSlots));
});
List.displayName = 'ActionList';

export { List };
