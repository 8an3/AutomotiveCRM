'use strict';

var styled = require('styled-components');
var sx = require('../../sx.js');
var constants = require('../../constants.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var styled__default = /*#__PURE__*/_interopDefault(styled);

const shimmer = styled.keyframes(["from{mask-position:200%;}to{mask-position:0%;}"]);
const SkeletonBox = styled__default.default.div.withConfig({
  displayName: "SkeletonBox",
  componentId: "sc-4sdz0n-0"
})(["animation:", ";display:block;background-color:var(--bgColor-muted,", ");border-radius:3px;height:", ";width:", ";@media (prefers-reduced-motion:no-preference){mask-image:linear-gradient(75deg,#000 30%,rgba(0,0,0,0.65) 80%);mask-size:200%;animation:", ";animation-duration:1s;animation-iteration-count:infinite;}@media (forced-colors:active){outline:1px solid transparent;outline-offset:-1px;}", ";"], shimmer, constants.get('colors.canvas.subtle'), props => props.height || '1rem', props => props.width, shimmer, sx.default);

exports.SkeletonBox = SkeletonBox;
