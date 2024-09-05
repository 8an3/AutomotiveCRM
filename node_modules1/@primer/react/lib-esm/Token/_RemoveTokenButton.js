import React from 'react';
import { XIcon } from '@primer/octicons-react';
import styled, { css } from 'styled-components';
import { variant } from 'styled-system';
import { get } from '../constants.js';
import sx from '../sx.js';
import { tokenSizes, defaultTokenSize } from './TokenBase.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const variants = variant({
  prop: 'size',
  variants: {
    small: {
      height: tokenSizes.small,
      width: tokenSizes.small
    },
    medium: {
      height: tokenSizes.medium,
      width: tokenSizes.medium
    },
    large: {
      height: tokenSizes.large,
      width: tokenSizes.large
    },
    xlarge: {
      height: tokenSizes.xlarge,
      width: tokenSizes.xlarge
    }
  }
});
const getTokenButtonIconSize = size => parseInt(tokenSizes[size || defaultTokenSize], 10) * 0.75;
const StyledTokenButton = styled.span.withConfig({
  displayName: "_RemoveTokenButton__StyledTokenButton",
  componentId: "sc-urhpr1-0"
})(["background-color:transparent;font-family:inherit;color:currentColor;cursor:pointer;display:inline-flex;justify-content:center;align-items:center;user-select:none;appearance:none;text-decoration:none;padding:0;transform:", ";align-self:baseline;border:0;border-radius:999px;", " &:hover,&:focus{background-color:", ";}&:active{background-color:", ";}", " ", ""], props => `translate(${props.borderOffset}px, -${props.borderOffset}px)`, props => {
  switch (props.size) {
    case 'large':
    case 'xlarge':
      return css(["margin-left:", ";"], get('space.2'));
    default:
      return css(["margin-left:", ";"], get('space.1'));
  }
}, get('colors.neutral.muted'), get('colors.neutral.subtle'), variants, sx);
const RemoveTokenButton = ({
  'aria-label': ariaLabel,
  isParentInteractive,
  size = defaultTokenSize,
  ...rest
}) => {
  delete rest.children;
  return /*#__PURE__*/React.createElement(StyledTokenButton, _extends({
    as: isParentInteractive ? 'span' : 'button',
    tabIndex: isParentInteractive ? -1 : undefined,
    "aria-label": !isParentInteractive ? 'Remove token' : ariaLabel,
    size: size
  }, rest), /*#__PURE__*/React.createElement(XIcon, {
    size: getTokenButtonIconSize(size)
  }));
};
RemoveTokenButton.displayName = "RemoveTokenButton";

export { RemoveTokenButton as default };
