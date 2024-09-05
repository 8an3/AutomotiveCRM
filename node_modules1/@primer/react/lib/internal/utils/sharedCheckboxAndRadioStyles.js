'use strict';

var styled = require('styled-components');
var constants = require('../../constants.js');

const sharedCheckboxAndRadioStyles = styled.css(["appearance:none;border-color:", ";border-style:solid;border-width:", ";cursor:pointer;display:grid;height:var(--base-size-16,16px);margin:0;margin-top:0.125rem;place-content:center;position:relative;width:var(--base-size-16,16px);&:disabled{background-color:", ";border-color:var(--control-borderColor-disabled,", ");}"], constants.get('colors.neutral.emphasis'), constants.get('borderWidths.1'), constants.get('colors.input.disabledBg'), constants.get('colors.border.default'));

exports.sharedCheckboxAndRadioStyles = sharedCheckboxAndRadioStyles;
