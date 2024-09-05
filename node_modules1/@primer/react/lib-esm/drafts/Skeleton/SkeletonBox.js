import styled, { keyframes } from 'styled-components';
import sx from '../../sx.js';
import { get } from '../../constants.js';

const shimmer = keyframes(["from{mask-position:200%;}to{mask-position:0%;}"]);
const SkeletonBox = styled.div.withConfig({
  displayName: "SkeletonBox",
  componentId: "sc-4sdz0n-0"
})(["animation:", ";display:block;background-color:var(--bgColor-muted,", ");border-radius:3px;height:", ";width:", ";@media (prefers-reduced-motion:no-preference){mask-image:linear-gradient(75deg,#000 30%,rgba(0,0,0,0.65) 80%);mask-size:200%;animation:", ";animation-duration:1s;animation-iteration-count:infinite;}@media (forced-colors:active){outline:1px solid transparent;outline-offset:-1px;}", ";"], shimmer, get('colors.canvas.subtle'), props => props.height || '1rem', props => props.width, shimmer, sx);

export { SkeletonBox };
