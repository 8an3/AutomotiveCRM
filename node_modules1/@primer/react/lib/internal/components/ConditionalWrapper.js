'use strict';

var React = require('react');
var Box = require('../../Box/Box.js');

function _interopDefault (e) { return e && e.__esModule ? e : { default: e }; }

var React__default = /*#__PURE__*/_interopDefault(React);

const ConditionalWrapper = props => {
  const {
    if: condition,
    ...rest
  } = props;
  if (condition) return /*#__PURE__*/React__default.default.createElement(Box, rest, props.children);else return /*#__PURE__*/React__default.default.createElement(React__default.default.Fragment, null, props.children);
};

exports.ConditionalWrapper = ConditionalWrapper;
