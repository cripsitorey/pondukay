import React from "react";

const InputCell = ({ value, className = '' }) => {
  const displayValue = value === '-' ? '' : value;
  
  return (
    <input
      type="number"
      step="0.01"
      defaultValue={displayValue}
      className={`w-16 px-2 py-1 text-center border rounded ${className} bg-transparent focus:outline-none focus:ring-1 focus:ring-blue-500 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none`}
      placeholder="-"
    />
  );
};

export default InputCell