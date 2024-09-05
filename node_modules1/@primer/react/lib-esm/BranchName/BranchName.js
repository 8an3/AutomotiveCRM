import styled from 'styled-components';
import { get } from '../constants.js';
import sx from '../sx.js';

const BranchName = styled.a.withConfig({
  displayName: "BranchName",
  componentId: "sc-sg8jsy-0"
})(["display:inline-block;padding:2px 6px;font-size:var(--text-body-size-small,", ");font-family:var(--fontStack-monospace,", ");color:var(--fgColor-link,", ");background-color:var(--bgColor-accent-muted,", ");border-radius:var(--borderRadius-medium,", ");text-decoration:none;&:is(:not(a)){color:var(--fgColor-muted);}", ";"], get('fontSizes.0'), get('fonts.mono'), get('colors.accent.fg'), get('colors.accent.subtle'), get('radii.2'), sx);

export { BranchName as default };
