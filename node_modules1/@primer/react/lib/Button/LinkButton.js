'use strict';

var React = require('react');
var ButtonBase = require('./ButtonBase.js');
var defaultSxProp = require('../utils/defaultSxProp.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const LinkButton = /*#__PURE__*/React.forwardRef(({
  children,
  as: Component = 'a',
  sx = defaultSxProp.defaultSxProp,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React__default.default.createElement(ButtonBase.ButtonBase, _extends({
    as: Component
    // @ts-expect-error ButtonBase wants both Anchor and Button refs
    ,
    ref: forwardedRef,
    sx: sx
  }, props), children);
});

exports.LinkButton = LinkButton;
