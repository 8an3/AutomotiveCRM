'use strict';

var styled = require('styled-components');
var constants = require('../constants.js');
var sx = require('../sx.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var styled__default = /*#__PURE__*/_interopDefault(styled);

const BranchName = styled__default.default.a.withConfig({
  displayName: "BranchName",
  componentId: "sc-sg8jsy-0"
})(["display:inline-block;padding:2px 6px;font-size:var(--text-body-size-small,", ");font-family:var(--fontStack-monospace,", ");color:var(--fgColor-link,", ");background-color:var(--bgColor-accent-muted,", ");border-radius:var(--borderRadius-medium,", ");text-decoration:none;&:is(:not(a)){color:var(--fgColor-muted);}", ";"], constants.get('fontSizes.0'), constants.get('fonts.mono'), constants.get('colors.accent.fg'), constants.get('colors.accent.subtle'), constants.get('radii.2'), sx.default);

module.exports = BranchName;
