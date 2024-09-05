'use strict';

var liveRegionElement = require('@primer/live-region-element');
var React = require('react');
var Box = require('../Box/Box.js');
var useEffectOnce = require('../internal/hooks/useEffectOnce.js');
var useEffectCallback = require('../internal/hooks/useEffectCallback.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

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
  const ref = React.useRef(null);
  const [previousAnnouncementText, setPreviousAnnouncementText] = React.useState(null);
  const savedAnnouncement = React.useRef(null);
  const announce = useEffectCallback.useEffectCallback(() => {
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
    savedAnnouncement.current = liveRegionElement.announceFromElement(element, politeness === 'assertive' ? {
      politeness
    } : {
      politeness,
      delayMs
    });
    setPreviousAnnouncementText(textContent);
  });

  // Announce the initial message, this is wrapped in `useEffectOnce` so that it
  // does not announce twice in StrictMode
  useEffectOnce.useEffectOnce(() => {
    if (announceOnShow) {
      announce();
    }
  });
  React.useEffect(() => {
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
  React.useEffect(() => {
    return () => {
      if (savedAnnouncement.current !== null) {
        savedAnnouncement.current.cancel();
        savedAnnouncement.current = null;
      }
    };
  }, []);
  return /*#__PURE__*/React__default.default.createElement(Box, _extends({}, rest, {
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

exports.Announce = Announce;
