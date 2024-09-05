'use strict';

var React = require('react');
var Box = require('../Box/Box.js');
require('@styled-system/css');
var merge = require('deepmerge');
var _VisuallyHidden = require('../_VisuallyHidden.js');
var defaultSxProp = require('../utils/defaultSxProp.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var merge__default = /*#__PURE__*/_interopDefault(merge);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CounterLabel = /*#__PURE__*/React.forwardRef(({
  scheme = 'secondary',
  sx = defaultSxProp.defaultSxProp,
  children,
  ...props
}, forwardedRef) => {
  return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, /*#__PURE__*/React__default.default.createElement(Box, _extends({
    "aria-hidden": "true",
    sx: merge__default.default({
      display: 'inline-block',
      padding: '2px 5px',
      fontSize: 0,
      fontWeight: 'bold',
      lineHeight: 'condensedUltra',
      borderRadius: '20px',
      backgroundColor: scheme === 'primary' ? 'neutral.emphasis' : 'neutral.muted',
      border: 'var(--borderWidth-thin,max(1px, 0.0625rem)) solid var(--counter-borderColor,var(--color-counter-border))',
      color: scheme === 'primary' ? 'fg.onEmphasis' : 'fg.default',
      '&:empty': {
        display: 'none'
      }
    }, sx)
  }, props, {
    as: "span",
    ref: forwardedRef
  }), children), /*#__PURE__*/React__default.default.createElement(_VisuallyHidden, null, "\xA0(", children, ")"));
});
CounterLabel.displayName = 'CounterLabel';

module.exports = CounterLabel;
