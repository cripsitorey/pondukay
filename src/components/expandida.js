import React, { useState } from 'react';
import Row from './fila';
import InputCell from './InputCell';

const ExpandableRow = ({ label, children, garde }) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleRow = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700 w-screen">
        <td colSpan="5" className="px-6 py-4 cursor-pointer">
          <div className="flex justify-between items-center">
            <span className="font-bold text-gray-900 dark:text-white">{label}</span>
            <div className='flex'>
              <InputCell label="" value={garde}/>
              <span className="text-blue-500"  onClick={toggleRow}>{isExpanded ? '▲' : '▼'}</span>
            </div>
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
