

import React, { useRef, useEffect } from 'react';
import { NumericTextBoxComponent } from '@syncfusion/ej2-react-inputs';
import { ChangeEventArgs } from '@syncfusion/ej2-inputs';

interface DecimalInputProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  placeholder: string;
}

const DecimalInput = React.memo(({ value, onChange, min, max, placeholder }: DecimalInputProps) => {
  const numericRef = useRef<NumericTextBoxComponent>(null);

  useEffect(() => {
    if (numericRef.current) {
      numericRef.current.value = value;
    }
  }, [value]);

  return (
    <NumericTextBoxComponent
      ref={numericRef}
      value={value}
      min={min}
      max={max}
      step={1}
      decimals={0}
      format="n0"
      showSpinButton={true}
      width="100%"
      cssClass="e-outline"
      change={(args: ChangeEventArgs) => {
        if (args.value !== null && args.value !== undefined) {
          onChange(Number(args.value));
        }
      }}
      placeholder={placeholder}
      floatLabelType="Auto"
    />
  );
});

DecimalInput.displayName = 'DecimalInput';

export default DecimalInput;