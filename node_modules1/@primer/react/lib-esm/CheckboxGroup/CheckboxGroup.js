import React from 'react';
import CheckboxOrRadioGroup from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroup.js';
import CheckboxOrRadioGroupCaption from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupCaption.js';
import CheckboxOrRadioGroupLabel from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupLabel.js';
import CheckboxOrRadioGroupValidation from '../internal/components/CheckboxOrRadioGroup/CheckboxOrRadioGroupValidation.js';
import '@primer/behaviors/utils';
import '@primer/behaviors';
import { useRenderForcingRef } from '../hooks/useRenderForcingRef.js';
import '../FormControl/_FormControlContext.js';
import FormControl from '../FormControl/FormControl.js';
import Checkbox from '../Checkbox/Checkbox.js';
import { CheckboxGroupContext } from './CheckboxGroupContext.js';

function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
const CheckboxGroup = ({
  children,
  disabled,
  onChange,
  ...rest
}) => {
  const formControlComponentChildren = React.Children.toArray(children).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type === FormControl).map(formControlComponent => /*#__PURE__*/React.isValidElement(formControlComponent) ? formControlComponent.props.children : []).flat();
  const checkedCheckboxes = React.Children.toArray(formControlComponentChildren).filter(child => /*#__PURE__*/React.isValidElement(child) && child.type === Checkbox).map(checkbox => /*#__PURE__*/React.isValidElement(checkbox) && (checkbox.props.checked || checkbox.props.defaultChecked) && checkbox.props.value).filter(Boolean);
  const [selectedCheckboxValues, setSelectedCheckboxValues] = useRenderForcingRef(checkedCheckboxes);
  const updateSelectedCheckboxes = e => {
    const {
      value,
      checked
    } = e.currentTarget;
    if (checked) {
      setSelectedCheckboxValues([...(selectedCheckboxValues.current || []), value]);
      return;
    }
    setSelectedCheckboxValues((selectedCheckboxValues.current || []).filter(selectedValue => selectedValue !== value));
  };
  return /*#__PURE__*/React.createElement(CheckboxGroupContext.Provider, {
    value: {
      disabled,
      onChange: e => {
        if (onChange) {
          updateSelectedCheckboxes(e);
          onChange(selectedCheckboxValues.current || [], e);
        }
      }
    }
  }, /*#__PURE__*/React.createElement(CheckboxOrRadioGroup, _extends({
    disabled: disabled
  }, rest), children));
};
CheckboxGroup.displayName = "CheckboxGroup";
var CheckboxGroup$1 = Object.assign(CheckboxGroup, {
  Caption: CheckboxOrRadioGroupCaption,
  Label: CheckboxOrRadioGroupLabel,
  Validation: CheckboxOrRadioGroupValidation
});

export { CheckboxGroupContext, CheckboxGroup$1 as default };
