import React from 'react';
import InputLabel from '../internal/components/InputLabel.js';
import { useFormControlContext } from './_FormControlContext.js';

const FormControlLabel = ({
  as,
  children,
  htmlFor,
  id,
  visuallyHidden,
  requiredIndicator = true,
  requiredText,
  sx,
  ...props
}) => {
  const {
    disabled,
    id: formControlId,
    required
  } = useFormControlContext();

  /**
   * Ensure we can pass through props correctly, since legend/span accept no defined 'htmlFor'
   */
  const labelProps = as === 'legend' || as === 'span' ? {
    as,
    id,
    visuallyHidden,
    required,
    requiredText,
    requiredIndicator,
    disabled,
    sx,
    ...props
  } : {
    as,
    id,
    visuallyHidden,
    htmlFor: htmlFor || formControlId,
    required,
    requiredText,
    requiredIndicator,
    disabled,
    sx,
    ...props
  };
  return /*#__PURE__*/React.createElement(InputLabel, labelProps, children);
};
FormControlLabel.displayName = "FormControlLabel";

export { FormControlLabel as default };
