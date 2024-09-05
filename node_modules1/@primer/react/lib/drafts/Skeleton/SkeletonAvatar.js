'use strict';

var React = require('react');
var getBreakpointDeclarations = require('../../utils/getBreakpointDeclarations.js');
var constants = require('../../constants.js');
var useResponsiveValue = require('../../hooks/useResponsiveValue.js');
var Avatar = require('../../Avatar/Avatar.js');
var SkeletonBox = require('./SkeletonBox.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const avatarSkeletonStyles = {
  '&[data-component="SkeletonAvatar"]': {
    borderRadius: '50%',
    boxShadow: `0 0 0 1px ${constants.get('colors.avatar.border')}`,
    display: 'inline-block',
    lineHeight: constants.get('lineHeights.condensedUltra'),
    height: 'var(--avatar-size)',
    width: 'var(--avatar-size)'
  },
  '&[data-avatar-shape="square"]': {
    borderRadius: 'clamp(4px, var(--avatar-size) - 24px, 6px)'
  }
};
const SkeletonAvatar = ({
  size = Avatar.DEFAULT_AVATAR_SIZE,
  square,
  ...rest
}) => {
  const avatarSx = useResponsiveValue.isResponsiveValue(size) ? {
    ...getBreakpointDeclarations.getBreakpointDeclarations(size, '--avatar-size', value => `${value || Avatar.DEFAULT_AVATAR_SIZE}px`),
    ...avatarSkeletonStyles
  } : {
    '--avatar-size': `${size}px`,
    ...avatarSkeletonStyles
  };
  return /*#__PURE__*/React__default.default.createElement(SkeletonBox.SkeletonBox, _extends({
    sx: avatarSx
  }, rest, {
    "data-component": "SkeletonAvatar",
    "data-avatar-shape": square ? 'square' : undefined
  }));
};
SkeletonAvatar.displayName = "SkeletonAvatar";

exports.SkeletonAvatar = SkeletonAvatar;
