import React, { forwardRef, useEffect } from 'react';
import styled from 'styled-components';
import { system } from 'styled-system';
import { get } from '../constants.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useRefObjectAsForwardedRef } from '../hooks/useRefObjectAsForwardedRef.js';
import sx from '../sx.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const hoverColor = system({
  hoverColor: {
    property: 'color',
    scale: 'colors'
  }
});
const StyledLink = styled.a.withConfig({
  displayName: "Link__StyledLink",
  componentId: "sc-14289xe-0"
})(["color:", ";text-decoration:none;text-decoration:", ";[data-a11y-link-underlines='true'] &[data-inline='true']{text-decoration:underline;}&:hover{text-decoration:", ";", ";}&:is(button){display:inline-block;padding:0;font-size:inherit;white-space:nowrap;cursor:pointer;user-select:none;background-color:transparent;border:0;appearance:none;}", ";"], props => props.muted ? get('colors.fg.muted')(props) : get('colors.accent.fg')(props), props => props.underline ? 'underline' : undefined, props => props.muted ? 'none' : 'underline', props => props.hoverColor ? hoverColor : props.muted ? `color: ${get('colors.accent.fg')(props)}` : '', sx);
const Link = /*#__PURE__*/forwardRef(({
  as: Component = 'a',
  ...props
}, forwardedRef) => {
  const innerRef = React.useRef(null);
  useRefObjectAsForwardedRef(forwardedRef, innerRef);
  if (process.env.NODE_ENV !== "production") {
    /**
     * The Linter yells because it thinks this conditionally calls an effect,
     * but since this is a compile-time flag and not a runtime conditional
     * this is safe, and ensures the entire effect is kept out of prod builds
     * shaving precious bytes from the output, and avoiding mounting a noop effect
     */
    // eslint-disable-next-line react-hooks/rules-of-hooks
    useEffect(() => {
      if (innerRef.current && !(innerRef.current instanceof HTMLButtonElement) && !(innerRef.current instanceof HTMLAnchorElement)) {
        // eslint-disable-next-line no-console
        console.error('Error: Found `Link` component that renders an inaccessible element', innerRef.current, 'Please ensure `Link` always renders as <a> or <button>');
      }
    }, [innerRef]);
  }
  return /*#__PURE__*/React.createElement(StyledLink, _extends({
    as: Component,
    "data-inline": props.inline
  }, props, {
    // @ts-ignore shh
    ref: innerRef
  }));
});
Link.displayName = 'Link';

export { Link as default };
