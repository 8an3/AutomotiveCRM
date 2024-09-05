import { css } from 'styled-components';
import { get } from '../../constants.js';

const sharedCheckboxAndRadioStyles = css(["appearance:none;border-color:", ";border-style:solid;border-width:", ";cursor:pointer;display:grid;height:var(--base-size-16,16px);margin:0;margin-top:0.125rem;place-content:center;position:relative;width:var(--base-size-16,16px);&:disabled{background-color:", ";border-color:var(--control-borderColor-disabled,", ");}"], get('colors.neutral.emphasis'), get('borderWidths.1'), get('colors.input.disabledBg'), get('colors.border.default'));

export { sharedCheckboxAndRadioStyles };
