import React from 'react';
import Box from '../../Box/Box.js';

const ConditionalWrapper = props => {
  const {
    if: condition,
    ...rest
  } = props;
  if (condition) return /*#__PURE__*/React.createElement(Box, rest, props.children);else return /*#__PURE__*/React.createElement(React.Fragment, null, props.children);
};

export { ConditionalWrapper };
