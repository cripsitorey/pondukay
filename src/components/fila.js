import React from 'react';
import InputCell from "./InputCell";

const Row = ({ notas, onToggle, isExpanded }) => {
  return (
    <tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700">
      <th
        scope="row"
        className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
      >
        {notas.subject}
      </th>
      <InputCell label="" value={notas.grade} />
      <InputCell label="" value={notas.trime} />
      <InputCell label="" value={notas.parci} />
      <InputCell label="" value={notas.exame} />
      <td className="px-6 py-4">
        <button
          onClick={onToggle}
          className="text-blue-600 hover:underline dark:text-blue-500"
        >
          {isExpanded ? 'Ocultar detalles' : 'Mostrar detalles'}
        </button>
      </td>
    </tr>
  );
};

export default Row;
