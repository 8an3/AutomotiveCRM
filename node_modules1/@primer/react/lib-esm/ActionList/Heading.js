import React, { forwardRef } from 'react';
import '@styled-system/css';
import merge from 'deepmerge';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import Heading$1 from '../Heading/Heading.js';
import { ListContext } from './shared.js';
import VisuallyHidden from '../_VisuallyHidden.js';
import { ActionListContainerContext } from './ActionListContainerContext.js';
import { invariant } from '../utils/invariant.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const Heading = /*#__PURE__*/forwardRef(({
  as,
  children,
  sx = defaultSxProp,
  visuallyHidden = false,
  ...props
}, forwardedRef) => {
  var _props$id;
  const innerRef = React.useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, innerRef);
  const {
    headingId: headingId,
    variant: listVariant
  } = React.useContext(ListContext);
  const {
    container
  } = React.useContext(ActionListContainerContext);

  // Semantic <menu>s don't have a place for headers within them, they should be aria-labelledby the menu button's name.
  !(container !== 'ActionMenu') ? process.env.NODE_ENV !== "production" ? invariant(false, `ActionList.Heading shouldn't be used within an ActionMenu container. Menus are labelled by the menu button's name.`) : invariant(false) : void 0;
  const styles = {
    marginBottom: 2,
    marginX: listVariant === 'full' ? 2 : 3
  };
  return /*#__PURE__*/React.createElement(VisuallyHidden, {
    isVisible: !visuallyHidden
  }, /*#__PURE__*/React.createElement(Heading$1, _extends({
    as: as,
    ref: innerRef
    // use custom id if it is provided. Otherwise, use the id from the context
    ,
    id: (_props$id = props.id) !== null && _props$id !== void 0 ? _props$id : headingId,
    sx: merge(styles, sx)
  }, props), children));
});
Heading.displayName = 'ActionList.Heading';

export { Heading };
