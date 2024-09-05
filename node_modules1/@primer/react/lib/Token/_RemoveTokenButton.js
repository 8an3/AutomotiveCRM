'use strict';

var React = require('react');
var octiconsReact = require('@primer/octicons-react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var constants = require('../constants.js');
var sx = require('../sx.js');
var TokenBase = require('./TokenBase.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = styledSystem.variant({
  prop: 'size',
  variants: {
    small: {
      height: TokenBase.tokenSizes.small,
      width: TokenBase.tokenSizes.small
    },
    medium: {
      height: TokenBase.tokenSizes.medium,
      width: TokenBase.tokenSizes.medium
    },
    large: {
      height: TokenBase.tokenSizes.large,
      width: TokenBase.tokenSizes.large
    },
    xlarge: {
      height: TokenBase.tokenSizes.xlarge,
      width: TokenBase.tokenSizes.xlarge
    }
  }
});
const getTokenButtonIconSize = size => parseInt(TokenBase.tokenSizes[size || TokenBase.defaultTokenSize], 10) * 0.75;
const StyledTokenButton = styled__default.default.span.withConfig({
  displayName: "_RemoveTokenButton__StyledTokenButton",
  componentId: "sc-urhpr1-0"
})(["background-color:transparent;font-family:inherit;color:currentColor;cursor:pointer;display:inline-flex;justify-content:center;align-items:center;user-select:none;appearance:none;text-decoration:none;padding:0;transform:", ";align-self:baseline;border:0;border-radius:999px;", " &:hover,&:focus{background-color:", ";}&:active{background-color:", ";}", " ", ""], props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`, props => {
  switch (props.size) {
    case 'large':
    case 'xlarge':
      return styled.css(["margin-left:", ";"], constants.get('space.2'));
    default:
      return styled.css(["margin-left:", ";"], constants.get('space.1'));
  }
}, constants.get('colors.neutral.muted'), constants.get('colors.neutral.subtle'), variants, sx.default);
const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = TokenBase.defaultTokenSize,
  ...rest
}) => {
  delete rest.children;
  return /*#__PURE__*/React__default.default.createElement(StyledTokenButton, _extends({
    as: isParentInteractive ? 'span' : 'button',
    tabIndex: isParentInteractive ? -1 : undefined,
    "aria-label": !isParentInteractive ? 'Remove token' : ariaLabel,
    size: size
  }, rest), /*#__PURE__*/React__default.default.createElement(octiconsReact.XIcon, {
    size: getTokenButtonIconSize(size)
  }));
};
RemoveTokenButton.displayName = "RemoveTokenButton";

module.exports = RemoveTokenButton;
