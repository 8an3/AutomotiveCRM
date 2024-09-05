import React from 'react';
import styled from 'styled-components';
import Box from '../Box/Box.js';
import { useId } from '../hooks/useId.js';
import { useSlots } from '../hooks/useSlots.js';
import sx from '../sx.js';
import { useTheme } from '../ThemeProvider.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { ActionListContainerContext } from './ActionListContainerContext.js';
import { Description } from './Description.js';
import { GroupContext } from './Group.js';
import { Selection } from './Selection.js';
import { LeadingVisual, TrailingVisual, VisualOrIndicator } from './Visuals.js';
import { ListContext, getVariantStyles, TEXT_ROW_HEIGHT, ItemContext } from './shared.js';
import { TrailingAction } from './TrailingAction.js';
import { ConditionalWrapper } from '../internal/components/ConditionalWrapper.js';
import { invariant } from '../utils/invariant.js';
import '../FeatureFlags/FeatureFlags.js';
import { useFeatureFlag } from '../FeatureFlags/useFeatureFlag.js';
import VisuallyHidden from '../_VisuallyHidden.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LiBox = styled.li.withConfig({
  displayName: "Item__LiBox",
  componentId: "sc-yeql7o-0"
})(sx);
const Item = /*#__PURE__*/React.forwardRef(({
  variant = 'default',
  disabled = false,
  inactiveText,
  selected = undefined,
  active = false,
  onSelect: onSelectUser,
  sx: sxProp = defaultSxProp,
  id,
  role,
  loading,
  _PrivateItemWrapper,
  ...props
}, forwardedRef) => {
  var _slots$trailingVisual;
  const [slots, childrenWithoutSlots] = useSlots(props.children, {
    leadingVisual: LeadingVisual,
    trailingVisual: TrailingVisual,
    trailingAction: TrailingAction,
    blockDescription: [Description, props => props.variant === 'block'],
    inlineDescription: [Description, props => props.variant !== 'block']
  });
  const {
    container,
    afterSelect,
    selectionAttribute,
    defaultTrailingVisual
  } = React.useContext(ActionListContainerContext);
  const buttonSemanticsFeatureFlag = useFeatureFlag('primer_react_action_list_item_as_button');

  // Be sure to avoid rendering the container unless there is a default
  const wrappedDefaultTrailingVisual = defaultTrailingVisual ? /*#__PURE__*/React.createElement(TrailingVisual, null, defaultTrailingVisual) : null;
  const trailingVisual = (_slots$trailingVisual = slots.trailingVisual) !== null && _slots$trailingVisual !== void 0 ? _slots$trailingVisual : wrappedDefaultTrailingVisual;
  const {
    variant: listVariant,
    role: listRole,
    showDividers,
    selectionVariant: listSelectionVariant
  } = React.useContext(ListContext);
  const {
    selectionVariant: groupSelectionVariant
  } = React.useContext(GroupContext);
  const inactive = Boolean(inactiveText);
  const showInactiveIndicator = inactive && container === undefined;
  const onSelect = React.useCallback((event, afterSelect) => {
    if (typeof onSelectUser === 'function') onSelectUser(event);
    if (event.defaultPrevented) return;
    if (typeof afterSelect === 'function') afterSelect(event);
  }, [onSelectUser]);
  const selectionVariant = groupSelectionVariant ? groupSelectionVariant : listSelectionVariant;

  /** Infer item role based on the container */
  let inferredItemRole;
  if (container === 'ActionMenu') {
    if (selectionVariant === 'single') inferredItemRole = 'menuitemradio';else if (selectionVariant === 'multiple') inferredItemRole = 'menuitemcheckbox';else inferredItemRole = 'menuitem';
  } else if (container === 'SelectPanel' && listRole === 'listbox') {
    if (selectionVariant !== undefined) inferredItemRole = 'option';
  }
  const itemRole = role || inferredItemRole;
  const menuContext = container === 'ActionMenu' || container === 'SelectPanel';
  if (slots.trailingAction) {
    !!menuContext ? process.env.NODE_ENV !== "production" ? invariant(false, `ActionList.TrailingAction can not be used within a ${container}.`) : invariant(false) : void 0;
  }

  /** Infer the proper selection attribute based on the item's role */
  let inferredSelectionAttribute;
  if (itemRole === 'menuitemradio' || itemRole === 'menuitemcheckbox') inferredSelectionAttribute = 'aria-checked';else if (itemRole === 'option') inferredSelectionAttribute = 'aria-selected';
  const itemSelectionAttribute = selectionAttribute || inferredSelectionAttribute;
  // Ensures ActionList.Item retains list item semantics if a valid ARIA role is applied, or if item is inactive
  const listSemantics = listRole === 'listbox' || listRole === 'menu' || inactive || container === 'NavList';
  const buttonSemantics = !listSemantics && !_PrivateItemWrapper && buttonSemanticsFeatureFlag;
  const {
    theme
  } = useTheme();
  const activeStyles = {
    fontWeight: 'bold',
    bg: 'actionListItem.default.selectedBg',
    '&::after': {
      position: 'absolute',
      top: 'calc(50% - 12px)',
      left: -2,
      width: '4px',
      height: '24px',
      content: '""',
      bg: 'accent.fg',
      borderRadius: 2
    }
  };
  const hoverStyles = {
    '@media (hover: hover) and (pointer: fine)': {
      ':hover:not([aria-disabled]):not([data-inactive])': {
        backgroundColor: `actionListItem.${variant}.hoverBg`,
        color: getVariantStyles(variant, disabled, inactive).hoverColor,
        boxShadow: `inset 0 0 0 max(1px, 0.0625rem) ${theme === null || theme === void 0 ? void 0 : theme.colors.actionListItem.default.activeBorder}`
      },
      '&:focus-visible, > a.focus-visible, &:focus.focus-visible': {
        outline: 'none',
        border: `2 solid`,
        boxShadow: `0 0 0 2px ${theme === null || theme === void 0 ? void 0 : theme.colors.accent.emphasis}`
      },
      ':active:not([aria-disabled]):not([data-inactive])': {
        backgroundColor: `actionListItem.${variant}.activeBg`,
        color: getVariantStyles(variant, disabled, inactive).hoverColor
      }
    }
  };
  const listItemStyles = {
    display: 'flex',
    // show between 2 items
    ':not(:first-of-type)': {
      '--divider-color': theme === null || theme === void 0 ? void 0 : theme.colors.actionListItem.inlineDivider
    },
    width: buttonSemantics && listVariant !== 'full' ? 'calc(100% - 16px)' : '100%',
    marginX: buttonSemantics && listVariant !== 'full' ? '2' : '0',
    borderRadius: 2,
    ...(buttonSemantics ? hoverStyles : {})
  };
  const styles = {
    position: 'relative',
    display: 'flex',
    paddingX: 2,
    fontSize: 1,
    paddingY: '6px',
    // custom value off the scale
    lineHeight: TEXT_ROW_HEIGHT,
    minHeight: 5,
    marginX: listVariant === 'inset' && !buttonSemantics ? 2 : 0,
    borderRadius: 2,
    transition: 'background 33.333ms linear',
    color: getVariantStyles(variant, disabled, inactive || loading).color,
    cursor: 'pointer',
    '&[data-loading]': {
      cursor: 'default'
    },
    '&[aria-disabled], &[data-inactive]': {
      cursor: 'not-allowed',
      '[data-component="ActionList.Checkbox"]': {
        cursor: 'not-allowed',
        bg: selected ? 'fg.muted' : 'var(--color-input-disabled-bg, rgba(175, 184, 193, 0.2))',
        borderColor: selected ? 'fg.muted' : 'var(--color-input-disabled-bg, rgba(175, 184, 193, 0.2))'
      }
    },
    // Button reset styles (to support as="button")
    appearance: 'none',
    background: 'unset',
    border: 'unset',
    width: listVariant === 'inset' && !buttonSemantics ? 'calc(100% - 16px)' : '100%',
    fontFamily: 'unset',
    textAlign: 'unset',
    marginY: 'unset',
    '@media (forced-colors: active)': {
      ':focus, &:focus-visible, > a.focus-visible': {
        // Support for Windows high contrast https://sarahmhigley.com/writing/whcm-quick-tips
        outline: 'solid 1px transparent !important'
      }
    },
    /** Divider styles */
    '[data-component="ActionList.Item--DividerContainer"]': {
      position: 'relative'
    },
    '[data-component="ActionList.Item--DividerContainer"]::before': {
      content: '" "',
      display: 'block',
      position: 'absolute',
      width: '100%',
      top: '-7px',
      border: '0 solid',
      borderTopWidth: showDividers ? `1px` : '0',
      borderColor: 'var(--divider-color, transparent)'
    },
    // show between 2 items
    ':not(:first-of-type)': {
      '--divider-color': theme === null || theme === void 0 ? void 0 : theme.colors.actionListItem.inlineDivider
    },
    // hide divider after dividers & group header, with higher importance!
    '[data-component="ActionList.Divider"] + &': {
      '--divider-color': 'transparent !important'
    },
    // hide border on current and previous item
    '&:hover:not([aria-disabled]):not([data-inactive]):not([data-loading]), &[data-focus-visible-added]:not([aria-disabled]):not([data-inactive])': {
      '--divider-color': 'transparent'
    },
    '&:hover:not([aria-disabled]):not([data-inactive]):not([data-loading]) + &, &[data-focus-visible-added] + li': {
      '--divider-color': 'transparent'
    },
    ...(active ? activeStyles : {}),
    ...(!buttonSemantics ? hoverStyles : {})
  };
  const clickHandler = React.useCallback(event => {
    if (disabled || inactive || loading) return;
    onSelect(event, afterSelect);
  }, [onSelect, disabled, inactive, afterSelect, loading]);
  const keyPressHandler = React.useCallback(event => {
    if (disabled || inactive || loading) return;
    if ([' ', 'Enter'].includes(event.key)) {
      if (event.key === ' ') {
        event.preventDefault(); // prevent scrolling on Space
        // immediately reset defaultPrevented once it's job is done
        // so as to not disturb the functions that use that event after this
        event.defaultPrevented = false;
      }
      onSelect(event, afterSelect);
    }
  }, [onSelect, disabled, loading, inactive, afterSelect]);
  const itemId = useId(id);
  const labelId = `${itemId}--label`;
  const inlineDescriptionId = `${itemId}--inline-description`;
  const blockDescriptionId = `${itemId}--block-description`;
  const inactiveWarningId = inactive && !showInactiveIndicator ? `${itemId}--warning-message` : undefined;
  const ButtonItemWrapper = /*#__PURE__*/React.forwardRef(({
    as: Component = 'button',
    children,
    ...props
  }, forwardedRef) => {
    return /*#__PURE__*/React.createElement(Box, _extends({
      as: Component,
      sx: merge(styles, sxProp),
      ref: forwardedRef
    }, props), children);
  });
  let DefaultItemWrapper = React.Fragment;
  if (buttonSemanticsFeatureFlag) {
    DefaultItemWrapper = listSemantics ? React.Fragment : ButtonItemWrapper;
  }
  const ItemWrapper = _PrivateItemWrapper || DefaultItemWrapper;

  // only apply aria-selected and aria-checked to selectable items
  const selectableRoles = ['menuitemradio', 'menuitemcheckbox', 'option'];
  const includeSelectionAttribute = itemSelectionAttribute && itemRole && selectableRoles.includes(itemRole);
  const menuItemProps = {
    onClick: clickHandler,
    onKeyPress: !buttonSemantics ? keyPressHandler : undefined,
    'aria-disabled': disabled ? true : undefined,
    'data-inactive': inactive ? true : undefined,
    'data-loading': loading && !inactive ? true : undefined,
    tabIndex: disabled || showInactiveIndicator ? undefined : 0,
    'aria-labelledby': `${labelId} ${slots.inlineDescription ? inlineDescriptionId : ''}`,
    'aria-describedby': slots.blockDescription ? [blockDescriptionId, inactiveWarningId].join(' ') : inactiveWarningId,
    ...(includeSelectionAttribute && {
      [itemSelectionAttribute]: selected
    }),
    role: itemRole,
    id: itemId
  };
  let containerProps;
  let wrapperProps;
  if (buttonSemanticsFeatureFlag) {
    containerProps = _PrivateItemWrapper ? {
      role: itemRole ? 'none' : undefined,
      ...props
    } :
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    listSemantics && {
      ...menuItemProps,
      ...props,
      ref: forwardedRef
    } || {};
    wrapperProps = _PrivateItemWrapper ? menuItemProps : !listSemantics && {
      ...menuItemProps,
      ...props,
      styles: merge(styles, sxProp),
      ref: forwardedRef
    };
  } else {
    containerProps = _PrivateItemWrapper ? {
      role: itemRole ? 'none' : undefined
    } : {
      ...menuItemProps,
      ...props
    };
    wrapperProps = _PrivateItemWrapper ? menuItemProps : {};
  }
  return /*#__PURE__*/React.createElement(ItemContext.Provider, {
    value: {
      variant,
      disabled,
      inactive: Boolean(inactiveText),
      inlineDescriptionId,
      blockDescriptionId
    }
  }, /*#__PURE__*/React.createElement(LiBox, _extends({
    ref: !buttonSemanticsFeatureFlag || listSemantics ? forwardedRef : null,
    sx: buttonSemanticsFeatureFlag ? merge(listSemantics || _PrivateItemWrapper ? styles : listItemStyles, listSemantics || _PrivateItemWrapper ? sxProp : {}) : merge(styles, sxProp),
    "data-variant": variant === 'danger' ? variant : undefined
  }, containerProps), /*#__PURE__*/React.createElement(ItemWrapper, wrapperProps, /*#__PURE__*/React.createElement(Selection, {
    selected: selected
  }), /*#__PURE__*/React.createElement(VisualOrIndicator, {
    inactiveText: showInactiveIndicator ? inactiveText : undefined,
    itemHasLeadingVisual: Boolean(slots.leadingVisual),
    labelId: labelId,
    loading: loading,
    position: "leading"
  }, slots.leadingVisual), /*#__PURE__*/React.createElement(Box, {
    "data-component": "ActionList.Item--DividerContainer",
    sx: {
      display: 'flex',
      flexDirection: 'column',
      flexGrow: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(ConditionalWrapper
  // we need a flex container if:
  // - there is a trailing visual
  // - OR there is a loading or inactive indicator
  // - AND no leading visual to replace with an indicator
  , {
    if: Boolean(trailingVisual || (showInactiveIndicator || loading) && !slots.leadingVisual),
    sx: {
      display: 'flex',
      flexGrow: 1
    }
  }, /*#__PURE__*/React.createElement(ConditionalWrapper, {
    if: !!slots.inlineDescription,
    sx: {
      display: 'flex',
      flexGrow: 1,
      alignItems: 'baseline',
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement(Box, {
    as: "span",
    id: labelId,
    sx: {
      flexGrow: slots.inlineDescription ? 0 : 1,
      fontWeight: slots.inlineDescription || slots.blockDescription || active ? 'bold' : 'normal',
      marginBlockEnd: slots.blockDescription ? '4px' : undefined,
      wordBreak: 'break-word'
    }
  }, childrenWithoutSlots, loading === true && /*#__PURE__*/React.createElement(VisuallyHidden, null, "Loading")), slots.inlineDescription), /*#__PURE__*/React.createElement(VisualOrIndicator, {
    inactiveText: showInactiveIndicator ? inactiveText : undefined,
    itemHasLeadingVisual: Boolean(slots.leadingVisual),
    labelId: labelId,
    loading: loading,
    position: "trailing"
  }, trailingVisual)),
  // If the item is inactive, but it's not in an overlay (e.g. ActionMenu, SelectPanel),
  // render the inactive warning message directly in the item.
  inactive && container ? /*#__PURE__*/React.createElement(Box, {
    as: "span",
    sx: {
      fontSize: 0,
      lineHeight: '16px',
      color: 'attention.fg'
    },
    id: inactiveWarningId
  }, inactiveText) : null, slots.blockDescription)), !inactive && !loading && !menuContext && Boolean(slots.trailingAction) && slots.trailingAction));
});
Item.displayName = 'ActionList.Item';

export { Item };
