import React from 'react';
import { getBreakpointDeclarations } from '../../utils/getBreakpointDeclarations.js';
import { get } from '../../constants.js';
import { isResponsiveValue } from '../../hooks/useResponsiveValue.js';
import { DEFAULT_AVATAR_SIZE } from '../../Avatar/Avatar.js';
import { SkeletonBox } from './SkeletonBox.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const avatarSkeletonStyles = {
  '&[data-component="SkeletonAvatar"]': {
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${get('colors.avatar.border')}`,
    display: 'inline-block',
    lineHeight: get('lineHeights.condensedUltra'),
    height: 'var(--avatar-size)',
    width: 'var(--avatar-size)'
  },
  '&[data-avatar-shape="square"]': {
    borderRadius: 'clamp(4px, var(--avatar-size) - 24px, 6px)'
  }
};
const SkeletonAvatar = ({
  size = DEFAULT_AVATAR_SIZE,
  square,
  ...rest
}) => {
  const avatarSx = isResponsiveValue(size) ? {
    ...getBreakpointDeclarations(size, '--avatar-size', value => `${value || DEFAULT_AVATAR_SIZE}px`),
    ...avatarSkeletonStyles
  } : {
    '--avatar-size': `${size}px`,
    ...avatarSkeletonStyles
  };
  return /*#__PURE__*/React.createElement(SkeletonBox, _extends({
    sx: avatarSx
  }, rest, {
    "data-component": "SkeletonAvatar",
    "data-avatar-shape": square ? 'square' : undefined
  }));
};
SkeletonAvatar.displayName = "SkeletonAvatar";

export { SkeletonAvatar };
