import React, { useState } from 'react';
import Row from './fila';
import InputCell from './InputCell';


const ExpandableRow = ({ notas }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const promP = notas.domin + notas.pract;
  const toggleRow = () => {
    setIsExpanded((prev) => !prev);
  };

  return (
    <>
      {/* Fila principal */}
      <Row notas={notas} onToggle={toggleRow} isExpanded={isExpanded} />

      {/* Fila desplegable */}
      {isExpanded && (
        <tr className="bg-gray-100 dark:bg-gray-800 border-b dark:border-gray-700">
        <td colSpan="6" className="px-6 py-4">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            <strong>Insumos:</strong>
          </div>
          {/* Nueva tabla para los insumos */}
          <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400 mt-2">
            <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" className="px-6 py-3">Tareas de práctica</th>
                <th scope="col" className="px-6 py-3">Tareas de dominio</th>
                <th scope="col" className="px-6 py-3">Tareas de desempeño</th>
                <th scope="col" className="px-6 py-3">Sumativa</th>
                <th scope="col" className="px-6 py-3">Total Parcial</th>
                <th scope="col" className="px-6 py-3">Calculo</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <InputCell label={notas.pespr.peso} value={notas.pract} />
                <InputCell label={notas.pesdo} value={notas.domin} />
                <InputCell label={notas.pesde} value={notas.desem} />
                <InputCell label={notas.pessu} value={notas.sumat} />
                <InputCell label="100%" value={promP} />
                <td><button className='text-blue-500'>Calcular</button></td>
              </tr>
              <tr>
                <InputCell label={ notas.pespr.nmtuit} value={notas.pespr.nmtui} />
              </tr>
            </tbody>
          </table>
        </td>
      </tr>      
      )}
    </>
  );
};

export default ExpandableRow;
