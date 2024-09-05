'use strict';

var React = require('react');
var Link = require('../Link/Link.js');
require('@styled-system/css');
var merge = require('deepmerge');
var Item = require('./Item.js');
var Box = require('../Box/Box.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// adopted from React.AnchorHTMLAttributes

// LinkItem does not support selected, loading, variants, etc.

const LinkItem = /*#__PURE__*/React__default.default.forwardRef(({
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
  return /*#__PURE__*/React__default.default.createElement(Item.Item, {
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
      return inactiveText ? /*#__PURE__*/React__default.default.createElement(Box, _extends({
        sx: merge__default.default(styles, sx)
      }, rest), children) : /*#__PURE__*/React__default.default.createElement(Link, _extends({
        as: Component,
        sx: merge__default.default(styles, sx)
      }, rest, props, {
        onClick: clickHandler,
        ref: forwardedRef
      }), children);
    }
  }, props.children);
});

exports.LinkItem = LinkItem;
