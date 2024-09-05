'use strict';

var React = require('react');
var styled = require('styled-components');
var Avatar = require('../Avatar/Avatar.js');
var constants = require('../constants.js');
var Box = require('../Box/Box.js');
var SkeletonAvatar = require('../drafts/Skeleton/SkeletonAvatar.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledAvatarPair = styled__default.default(Box).withConfig({
  displayName: "AvatarPair__StyledAvatarPair",
  componentId: "sc-1f7gzqg-0"
})(["position:relative;display:inline-flex;[data-component='Avatar']:last-child,[data-component='SkeletonAvatar']:last-child{position:absolute;right:-15%;bottom:-9%;box-shadow:", ";}[data-component='SkeletonAvatar']:last-child{box-shadow:inset ", ";}"], constants.get('shadows.avatar.childShadow'), constants.get('shadows.avatar.childShadow'));
const AvatarPair = ({
  children,
  ...rest
}) => {
  const avatars = React__default.default.Children.map(children, (child, i) => {
    if (! /*#__PURE__*/React__default.default.isValidElement(child)) {
      return child;
    }
    if (i === 0) {
      return /*#__PURE__*/React__default.default.cloneElement(child, {
        size: 40
      });
    }
    if (child.type === SkeletonAvatar.SkeletonAvatar) {
      return /*#__PURE__*/React__default.default.createElement(SkeletonAvatar.SkeletonAvatar, _extends({}, child.props, {
        size: 20
      }));
    }
    return /*#__PURE__*/React__default.default.createElement(Avatar.default, _extends({
      bg: "canvas.default"
    }, child.props, {
      size: 20
    }));
  });
  return /*#__PURE__*/React__default.default.createElement(StyledAvatarPair, rest, avatars);
};
AvatarPair.displayName = "AvatarPair";
// styled() changes this
AvatarPair.displayName = 'AvatarPair';

module.exports = AvatarPair;
