import React from 'react';
import styled from 'styled-components';
import Avatar from '../Avatar/Avatar.js';
import { get } from '../constants.js';
import Box from '../Box/Box.js';
import { SkeletonAvatar } from '../drafts/Skeleton/SkeletonAvatar.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledAvatarPair = styled(Box).withConfig({
  displayName: "AvatarPair__StyledAvatarPair",
  componentId: "sc-1f7gzqg-0"
})(["position:relative;display:inline-flex;[data-component='Avatar']:last-child,[data-component='SkeletonAvatar']:last-child{position:absolute;right:-15%;bottom:-9%;box-shadow:", ";}[data-component='SkeletonAvatar']:last-child{box-shadow:inset ", ";}"], get('shadows.avatar.childShadow'), get('shadows.avatar.childShadow'));
const AvatarPair = ({
  children,
  ...rest
}) => {
  const avatars = React.Children.map(children, (child, i) => {
    if (! /*#__PURE__*/React.isValidElement(child)) {
      return child;
    }
    if (i === 0) {
      return /*#__PURE__*/React.cloneElement(child, {
        size: 40
      });
    }
    if (child.type === SkeletonAvatar) {
      return /*#__PURE__*/React.createElement(SkeletonAvatar, _extends({}, child.props, {
        size: 20
      }));
    }
    return /*#__PURE__*/React.createElement(Avatar, _extends({
      bg: "canvas.default"
    }, child.props, {
      size: 20
    }));
  });
  return /*#__PURE__*/React.createElement(StyledAvatarPair, rest, avatars);
};
AvatarPair.displayName = "AvatarPair";
// styled() changes this
AvatarPair.displayName = 'AvatarPair';

export { AvatarPair as default };
