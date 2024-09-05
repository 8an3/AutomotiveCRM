import React, { forwardRef } from 'react';
import styled from 'styled-components';
import { get } from '../constants.js';
import { tokenSizes, defaultTokenSize } from './TokenBase.js';
import Token from './Token.js';
import Avatar from '../Avatar/Avatar.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }

// TODO: update props to only accept 'large' and 'xlarge' on the next breaking change

const AvatarContainer = styled.span.withConfig({
  displayName: "AvatarToken__AvatarContainer",
  componentId: "sc-62sih1-0"
})(["--spacing:calc(", " * 2);display:block;height:", ";width:", ";"], get('space.1'), props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`, props => `calc(${tokenSizes[props.avatarSize]} - var(--spacing))`);
const AvatarToken = /*#__PURE__*/forwardRef(({
  avatarSrc,
  id,
  size = defaultTokenSize,
  ...rest
}, forwardedRef) => {
  return /*#__PURE__*/React.createElement(Token, _extends({
    leadingVisual: () => /*#__PURE__*/React.createElement(AvatarContainer, {
      avatarSize: size
    }, /*#__PURE__*/React.createElement(Avatar, {
      src: avatarSrc,
      size: parseInt(tokenSizes[size], 10),
      sx: {
        width: '100%',
        height: '100%'
      }
    })),
    size: size,
    id: id === null || id === void 0 ? void 0 : id.toString(),
    sx: {
      paddingLeft: get('space.1')
    }
  }, rest, {
    ref: forwardedRef
  }));
});
AvatarToken.displayName = 'AvatarToken';

export { AvatarToken as default };
