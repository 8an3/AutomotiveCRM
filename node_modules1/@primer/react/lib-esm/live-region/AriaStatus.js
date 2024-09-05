import React from 'react';
import { Announce } from './Announce.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AriaStatus({
  announceOnShow = false,
  children,
  ...rest
}) {
  return /*#__PURE__*/React.createElement(Announce, _extends({}, rest, {
    announceOnShow: announceOnShow,
    politeness: "polite"
  }), children);
}
AriaStatus.displayName = "AriaStatus";

export { AriaStatus };
