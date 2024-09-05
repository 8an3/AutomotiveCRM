import React from 'react';
import { RelativeTimeElement } from '@github/relative-time-element';
import { createComponent } from '../utils/create-component.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RelativeTimeComponent = createComponent(RelativeTimeElement, 'relative-time');
const localeOptions = {
  month: 'short',
  day: 'numeric',
  year: 'numeric'
};
function RelativeTime({
  date,
  datetime,
  children,
  noTitle,
  ...props
}) {
  var _date;
  if (datetime) date = new Date(datetime);
  return /*#__PURE__*/React.createElement(RelativeTimeComponent, _extends({}, props, {
    date: date,
    "no-title": noTitle ? '' : undefined
  }), children || ((_date = date) === null || _date === void 0 ? void 0 : _date.toLocaleDateString('en', localeOptions)) || '');
}
RelativeTime.displayName = "RelativeTime";

export { RelativeTime as default };
