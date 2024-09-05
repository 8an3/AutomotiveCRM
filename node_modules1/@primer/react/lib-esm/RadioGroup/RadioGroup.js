import React, { createContext } from 'react';
import CheckboxOrRadioGroup from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.js';
import CheckboxOrRadioGroupCaption from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption.js';
import CheckboxOrRadioGroupLabel from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel.js';
import CheckboxOrRadioGroupValidation from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useRenderForcingRef } from '../hooks/useRenderForcingRef.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const RadioGroupContext = /*#__PURE__*/createContext(null);
const RadioGroup = ({
  children,
  disabled,
  onChange,
  name,
  ...rest
}) => {
  const [selectedRadioValue, setSelectedRadioValue] = useRenderForcingRef(null);
  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;
    if (checked) {
      setSelectedRadioValue(value);
      return;
    }
  };
  return /*#__PURE__*/React.createElement(RadioGroupContext.Provider, {
    value: {
      disabled,
      name,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedRadioValue.current, e);
        }
      }
    }
  }, /*#__PURE__*/React.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};
RadioGroup.displayName = "RadioGroup";
var RadioGroup$1 = Object.assign(RadioGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

export { RadioGroupContext, RadioGroup$1 as default };
