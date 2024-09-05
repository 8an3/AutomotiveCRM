import React from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';
import sx from '../sx.js';
import { isResponsiveValue } from '../hooks/useResponsiveValue.js';
import { getBreakpointDeclarations } from '../utils/getBreakpointDeclarations.js';
import { defaultSxProp } from '../utils/defaultSxProp.js';
import merge from 'deepmerge';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const DEFAULT_AVATAR_SIZE = 20;
const StyledAvatar = styled.img.attrs(props => ({
  height: props.size,
  width: props.size
})).withConfig({
  displayName: "Avatar__StyledAvatar",
  componentId: "sc-2lv0r8-0"
})(["display:inline-block;overflow:hidden;line-height:", ";vertical-align:middle;border-radius:", ";box-shadow:0 0 0 1px ", ";height:var(--avatar-size);width:var(--avatar-size);", ""], get('lineHeights.condensedUltra'), props => props.square ? 'clamp(4px, var(--avatar-size) - 24px, 6px)' : '50%', get('colors.avatar.border'), sx);
const Avatar = /*#__PURE__*/React.forwardRef(function Avatar({
  alt = '',
  size = DEFAULT_AVATAR_SIZE,
  square = false,
  sx: sxProp = defaultSxProp,
  ...rest
}, ref) {
  const avatarSx = isResponsiveValue(size) ? merge(getBreakpointDeclarations(size, '--avatar-size', value => `${value || DEFAULT_AVATAR_SIZE}px`), sxProp) : merge({
    '--avatar-size': `${size}px`
  }, sxProp);
  return /*#__PURE__*/React.createElement(StyledAvatar, _extends({
    "data-component": "Avatar",
    ref: ref,
    alt: alt,
    size: size,
    square: square,
    sx: avatarSx
  }, rest));
});
if (process.env.NODE_ENV !== "production") {
  Avatar.displayName = 'Avatar';
}

export { DEFAULT_AVATAR_SIZE, Avatar as default };
