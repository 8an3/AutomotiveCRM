'use strict';

var React = require('react');
var Announce = require('./Announce.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
function AriaAlert({
  announceOnShow = true,
  children,
  ...rest
}) {
  return /*#__PURE__*/React__default.default.createElement(Announce.Announce, _extends({}, rest, {
    announceOnShow: announceOnShow,
    politeness: "assertive"
  }), children);
}
AriaAlert.displayName = "AriaAlert";

exports.AriaAlert = AriaAlert;
