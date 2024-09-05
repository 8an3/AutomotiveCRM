import React from 'react';
import { useId } from '../hooks/useId.js';
import Box from '../Box/Box.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { ListContext } from './shared.js';
import Heading from '../Heading/Heading.js';
import { useSlots } from '../hooks/useSlots.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import { invariant } from '../utils/invariant.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const GroupContext = /*#__PURE__*/React.createContext({
  groupHeadingId: undefined,
  selectionVariant: undefined
});
const Group = ({
  title,
  variant = 'subtle',
  auxiliaryText,
  selectionVariant,
  role,
  sx = {},
  ...props
}) => {
  var _slots$groupHeading;
  const id = useId();
  const {
    role: listRole
  } = React.useContext(ListContext);
  const [slots, childrenWithoutSlots] = useSlots(props.children, {
    groupHeading: GroupHeading
  });
  let groupHeadingId = undefined;

  // ActionList.GroupHeading
  if (slots.groupHeading) {
    var _slots$groupHeading$p;
    // If there is an id prop passed in the ActionList.GroupHeading, use it otherwise use the generated id.
    groupHeadingId = (_slots$groupHeading$p = slots.groupHeading.props.id) !== null && _slots$groupHeading$p !== void 0 ? _slots$groupHeading$p : id;
  }
  // Supports the deprecated `title` prop
  if (title) {
    groupHeadingId = id;
  }
  return /*#__PURE__*/React.createElement(Box, _extends({
    as: "li",
    role: listRole ? 'none' : undefined,
    sx: {
      '&:not(:first-child)': {
        marginTop: 2
      },
      listStyle: 'none',
      // hide the ::marker inserted by browser's stylesheet
      ...sx
    }
  }, props), /*#__PURE__*/React.createElement(GroupContext.Provider, {
    value: {
      selectionVariant,
      groupHeadingId
    }
  }, title && !slots.groupHeading ?
  /*#__PURE__*/
  // Escape hatch: supports old API <ActionList.Group title="group title"> in a non breaking way
  React.createElement(GroupHeading, {
    variant: variant,
    auxiliaryText: auxiliaryText,
    _internalBackwardCompatibleTitle: title
  }) : null, !title && slots.groupHeading ? /*#__PURE__*/React.cloneElement(slots.groupHeading) : null, /*#__PURE__*/React.createElement(Box, {
    as: "ul",
    sx: {
      paddingInlineStart: 0
    }
    // if listRole is set (listbox or menu), we don't label the list with the groupHeadingId
    // because the heading is hidden from the accessibility tree and only used for presentation role.
    // We will instead use aria-label to label the list. See a line below.
    ,
    "aria-labelledby": listRole ? undefined : groupHeadingId,
    "aria-label": listRole ? title !== null && title !== void 0 ? title : (_slots$groupHeading = slots.groupHeading) === null || _slots$groupHeading === void 0 ? void 0 : _slots$groupHeading.props.children : undefined,
    role: role || listRole && 'group'
  }, slots.groupHeading ? childrenWithoutSlots : props.children)));
};
Group.displayName = "Group";
/**
 * Heading of  a `Group`.
 *
 * As default, the role of ActionList is "list" and therefore group heading is rendered as a proper heading tag.
 * If the role is "listbox" or "menu" (ActionMenu), the group heading is rendered as a div with presentation role and it is
 * hidden from the accessibility tree due to the limitation of listbox children. https://w3c.github.io/aria/#listbox
 * groups under menu or listbox are labelled by `aria-label`
 */
const GroupHeading = ({
  as,
  variant,
  // We are not recommending this prop to be used, it should only be used internally for incremental rollout.
  _internalBackwardCompatibleTitle,
  auxiliaryText,
  children,
  sx = defaultSxProp,
  ...props
}) => {
  const {
    variant: listVariant,
    role: listRole
  } = React.useContext(ListContext);
  const {
    groupHeadingId
  } = React.useContext(GroupContext);
  // for list role, the headings are proper heading tags, for menu and listbox, they are just representational and divs
  const missingAsForList = (listRole === undefined || listRole === 'list') && children !== undefined && as === undefined;
  const unnecessaryAsForListboxOrMenu = listRole !== undefined && listRole !== 'list' && children !== undefined && as !== undefined;
  !
  // 'as' prop is required for list roles. <GroupHeading as="h2">...</GroupHeading>
  !missingAsForList ? process.env.NODE_ENV !== "production" ? invariant(false, `You are setting a heading for a list, that requires a heading level. Please use 'as' prop to set a proper heading level.`) : invariant(false) : void 0;
  !
  // 'as' prop on listbox or menu roles are not needed since they are rendered as divs and they could be misleading.
  !unnecessaryAsForListboxOrMenu ? process.env.NODE_ENV !== "production" ? invariant(false, `Looks like you are trying to set a heading level to a ${listRole} role. Group headings for ${listRole} type action lists are for representational purposes, and rendered as divs. Therefore they don't need a heading level.`) : invariant(false) : void 0;
  const styles = {
    paddingY: '6px',
    paddingX: listVariant === 'full' ? 2 : 3,
    fontSize: 0,
    fontWeight: 'bold',
    color: 'fg.muted',
    ...(variant === 'filled' && {
      backgroundColor: 'canvas.subtle',
      marginX: 0,
      marginBottom: 2,
      borderTop: '1px solid',
      borderBottom: '1px solid',
      borderColor: 'neutral.muted'
    })
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, listRole && listRole !== 'list' ? /*#__PURE__*/React.createElement(Box, _extends({
    sx: styles,
    role: "presentation",
    "aria-hidden": "true"
  }, props), /*#__PURE__*/React.createElement("span", {
    id: groupHeadingId
  }, _internalBackwardCompatibleTitle !== null && _internalBackwardCompatibleTitle !== void 0 ? _internalBackwardCompatibleTitle : children), auxiliaryText && /*#__PURE__*/React.createElement("span", null, auxiliaryText)) :
  /*#__PURE__*/
  // for explicit (role="list" is passed as prop) and implicit list roles (ActionList ins rendered as list by default), group titles are proper heading tags.
  React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Heading, _extends({
    as: as || 'h3',
    id: groupHeadingId,
    sx: merge(styles, sx)
  }, props), _internalBackwardCompatibleTitle !== null && _internalBackwardCompatibleTitle !== void 0 ? _internalBackwardCompatibleTitle : children), auxiliaryText && /*#__PURE__*/React.createElement("span", null, auxiliaryText)));
};

export { Group, GroupContext, GroupHeading };
