import React from 'react';
import Link from '../Link/Link.js';
import '@styled-system/css';
import merge from 'deepmerge';
import { Item } from './Item.js';
import Box from '../Box/Box.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// adopted from React.AnchorHTMLAttributes

// LinkItem does not support selected, loading, variants, etc.

const LinkItem = /*#__PURE__*/React.forwardRef(({
  sx = {},
  active,
  inactiveText,
  as: Component,
  ...props
}, forwardedRef) => {
  const styles = {
    // occupy full size of Item
    paddingX: 2,
    paddingY: '6px',
    // custom value off the scale
    display: 'flex',
    flexGrow: 1,
    // full width
    borderRadius: 2,
    // inherit Item styles
    color: 'inherit',
    '&:hover': {
      color: 'inherit',
      textDecoration: 'none'
    }
  };
  return /*#__PURE__*/React.createElement(Item, {
    active: active,
    sx: {
      paddingY: 0,
      paddingX: 0
    },
    inactiveText: inactiveText,
    "data-inactive": inactiveText ? true : undefined,
    _PrivateItemWrapper: ({
      children,
      onClick,
      ...rest
    }) => {
      const clickHandler = event => {
        onClick && onClick(event);
        props.onClick && props.onClick(event);
      };
      return inactiveText ? /*#__PURE__*/React.createElement(Box, _extends({
        sx: merge(styles, sx)
      }, rest), children) : /*#__PURE__*/React.createElement(Link, _extends({
        as: Component,
        sx: merge(styles, sx)
      }, rest, props, {
        onClick: clickHandler,
        ref: forwardedRef
      }), children);
    }
  }, props.children);
});

export { LinkItem };
