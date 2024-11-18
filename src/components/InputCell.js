import React from "react";

const InputCell = ({ label, value }) => (
    <td className="px-6 py-4">
      <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
        {label}
        <input
          defaultValue={parseFloat(value)}
          className="block w-4/12 px-3 py-2 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-xs focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
        />
      </label>
    </td>
  );
  
export default InputCell