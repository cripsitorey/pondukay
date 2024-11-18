import React from 'react';
import ExpandableRow from './expandida';

const NotasTable = ({ notas }) => {
  const filteredGrades = notas
    .filter(({ grade }) =>
      [grade].every(
        (value) => !isNaN(value) && value !== ""
      )
    )
    .map((nota) => ({
      ...nota,
      grade: nota.grade,
      trime: nota.trime,
      parci: nota.parci,
      exame: nota.exame,
      pract: nota.pract,
      domin: nota.domin,
      desem: nota.desem,
      sumat: nota.sumat
    }));

  return (
    <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
      <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">Materia</th>
            <th scope="col" className="px-6 py-3">Promedio</th>
            <th scope="col" className="px-6 py-3">Trimestre</th>
            <th scope="col" className="px-6 py-3">Parcial</th>
            <th scope="col" className="px-6 py-3">Examen</th>
            <th scope="col" className="px-6 py-3">Insumos</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((notas, index) => (
            <ExpandableRow key={index} notas={notas} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default NotasTable;
