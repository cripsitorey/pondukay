import React, { useState } from 'react';
import Row from './fila';
import InputCell from './InputCell';

const ExpandableRow = ({ label, children }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleRow = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
        <td colSpan="5" className="px-6 py-4 cursor-pointer" onClick={toggleRow}>
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">{label}</span>
            <span className="text-blue-500">{isExpanded ? '▲' : '▼'}</span>
          </div>
        </td>
      </tr>
      {isExpanded && (
        <tr>
          <td colSpan="5">
            <div className="p-4">{children}</div>
          </td>
        </tr>
      )}
    </>
  );
};

export default ExpandableRow;
