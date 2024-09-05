import { announceFromElement } from '@primer/live-region-element';
import React, { useRef, useState, useEffect } from 'react';
import Box from '../Box/Box.js';
import { useEffectOnce } from '../internal/hooks/useEffectOnce.js';
import { useEffectCallback } from '../internal/hooks/useEffectCallback.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/**
 * `Announce` is a component that will announce the text content of the
 * `children` passed in to screen readers using the given politeness level. It
 * will also announce any changes to the text content of `children`
 */
function Announce({
  announceOnShow = true,
  children,
  delayMs,
  hidden = false,
  politeness = 'polite',
  ...rest
}) {
  const ref = useRef(null);
  const [previousAnnouncementText, setPreviousAnnouncementText] = useState(null);
  const savedAnnouncement = useRef(null);
  const announce = useEffectCallback(() => {
    var _savedAnnouncement$cu;
    const {
      current: element
    } = ref;
    if (!element) {
      return;
    }
    if (hidden) {
      return;
    }
    const style = window.getComputedStyle(element);
    if (style.display === 'none') {
      return;
    }
    if (style.visibility === 'hidden') {
      return;
    }
    const textContent = getTextContent(element);
    if (textContent === previousAnnouncementText) {
      return;
    }
    (_savedAnnouncement$cu = savedAnnouncement.current) === null || _savedAnnouncement$cu === void 0 ? void 0 : _savedAnnouncement$cu.cancel();
    savedAnnouncement.current = announceFromElement(element, politeness === 'assertive' ? {
      politeness
    } : {
      politeness,
      delayMs
    });
    setPreviousAnnouncementText(textContent);
  });

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce(() => {
    if (announceOnShow) {
      announce();
    }
  });
  useEffect(() => {
    const {
      current: container
    } = ref;
    if (container === null) {
      return;
    }

    // When the text of the container changes, announce the new text
    const observer = new MutationObserver(() => {
      announce();
    });
    observer.observe(container, {
      subtree: true,
      characterData: true
    });
    return () => {
      observer.disconnect();
    };
  }, [announce]);
  useEffect(() => {
    return () => {
      if (savedAnnouncement.current !== null) {
        savedAnnouncement.current.cancel();
        savedAnnouncement.current = null;
      }
    };
  }, []);
  return /*#__PURE__*/React.createElement(Box, _extends({}, rest, {
    ref: ref
  }), children);
}
Announce.displayName = "Announce";
function getTextContent(element) {
  let value = '';
  if (element.hasAttribute('aria-label')) {
    value = element.getAttribute('aria-label');
  } else if (element.textContent) {
    value = element.textContent;
  }
  return value ? value.trim() : '';
}

export { Announce };
