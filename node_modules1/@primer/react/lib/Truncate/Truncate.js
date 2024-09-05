'use strict';

var React = require('react');
var styled = require('styled-components');
var styledSystem = require('styled-system');
var sx = require('../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);
var styled__default = /*#__PURE__*/_interopDefault(styled);

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const StyledTruncate = styled__default.default.div.withConfig({
  displayName: "Truncate__StyledTruncate",
  componentId: "sc-23o1d2-0"
})(["display:", ";overflow:hidden;text-overflow:ellipsis;vertical-align:", ";white-space:nowrap;", " ", " ", ";"], props => props.inline ? 'inline-block' : 'inherit', props => props.inline ? 'top' : 'initial', styledSystem.maxWidth, props => props.expandable ? `&:hover { max-width: 10000px; }` : '', sx.default);
const Truncate = /*#__PURE__*/React__default.default.forwardRef(function Truncate({
  as,
  expandable = false,
  inline = false,
  maxWidth = 125,
  ...rest
}, ref) {
  return /*#__PURE__*/React__default.default.createElement(StyledTruncate, _extends({
    ref: ref,
    as: as,
    expandable: expandable,
    inline: inline,
    maxWidth: maxWidth
  }, rest));
});
if (process.env.NODE_ENV !== "production") {
  Truncate.displayName = 'Truncate';
}

module.exports = Truncate;
