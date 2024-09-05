'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var sx = require('../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const tokenSizes = {
  small: '16px',
  medium: '20px',
  large: '24px',
  xlarge: '32px'
};
const defaultTokenSize = 'medium';
const isTokenInteractive = ({
  as = 'span',
  onClick,
  onFocus,
  tabIndex = -1,
  disabled
}) => {
  if (disabled) {
    return false;
  }
  return Boolean(onFocus || onClick || tabIndex > -1 || ['a', 'button'].includes(as));
};
const xlargeVariantStyles = {
  fontSize: 1,
  height: tokenSizes.xlarge,
  lineHeight: tokenSizes.xlarge,
  paddingLeft: 3,
  paddingRight: 3,
  paddingTop: 0,
  paddingBottom: 0
};
const variants = styledSystem.variant({
  prop: 'size',
  variants: {
    small: {
      fontSize: 0,
      height: tokenSizes.small,
      // without setting lineHeight to match height, the "x" appears vertically mis-aligned
      lineHeight: tokenSizes.small,
      paddingLeft: 1,
      paddingRight: 1
    },
    medium: {
      fontSize: 0,
      height: tokenSizes.medium,
      lineHeight: tokenSizes.medium,
      paddingLeft: 2,
      paddingRight: 2
    },
    large: {
      fontSize: 0,
      height: tokenSizes.large,
      lineHeight: tokenSizes.large,
      paddingLeft: 2,
      paddingRight: 2
    },
    xlarge: xlargeVariantStyles
  }
});
const StyledTokenBase = styled__default.default.span.withConfig({
  displayName: "TokenBase__StyledTokenBase",
  componentId: "sc-1ju9l7y-0"
})(["align-items:center;border-radius:999px;cursor:", ";display:inline-flex;font-weight:", ";font-family:inherit;text-decoration:none;position:relative;white-space:nowrap;", " ", ""], props => isTokenInteractive(props) ? 'pointer' : 'auto', constants.get('fontWeights.bold'), variants, sx.default);
const TokenBase = /*#__PURE__*/React__default.default.forwardRef(({
  onRemove,
  onKeyDown,
  id,
  size = defaultTokenSize,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React__default.default.createElement(StyledTokenBase, _extends({
    onKeyDown: event => {
      onKeyDown && onKeyDown(event);
      if ((event.key === 'Backspace' || event.key === 'Delete') && onRemove) {
        onRemove();
      }
    },
    id: id === null || id === void 0 ? void 0 : id.toString(),
    size: size
  }, rest, {
    // @ts-expect-error TokenBase wants Anchor, Button, and Span refs
    ref: forwardedRef
  }));
});

exports.default = TokenBase;
exports.defaultTokenSize = defaultTokenSize;
exports.isTokenInteractive = isTokenInteractive;
exports.tokenSizes = tokenSizes;
