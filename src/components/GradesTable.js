import React, { useState, useEffect, useCallback } from 'react';
import InputCell from './InputCell';

const GradesTable = ({ notas }) => {
  const [modalData, setModalData] = useState(null);
  const [desiredAverage, setDesiredAverage] = useState(7);
  const [selectedType, setSelectedType] = useState('exam');
  const [selectedTerm, setSelectedTerm] = useState(2);
  const [calculatedValues, setCalculatedValues] = useState({});

  const handleCloseModal = useCallback(() => {
    setModalData(null);
  }, []);

  useEffect(() => {
    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        handleCloseModal();
      }
    };

    if (modalData) {
      document.addEventListener('keydown', handleEscKey);
    }

    return () => {
      document.removeEventListener('keydown', handleEscKey);
    };
  }, [modalData, handleCloseModal]);

  if (!notas?.response?.subjects) {
    return <p className="text-center text-gray-500 mt-4">No hay calificaciones disponibles.</p>;
  }

  // Filtrar materias con actividades
  const subjects = notas.response.subjects.filter(subject => {
    let hasActivities = false;
    subject.courses.forEach(course => {
      course.year_summary.terms.forEach(term => {
        if (term.parts.length > 0) hasActivities = true;
      });
    });
    return hasActivities;
  });

  // Obtener la estructura de términos y parciales del primer curso
  const getStructure = () => {
    if (!subjects.length || !subjects[0].courses.length) return { terms: [] };
    
    const firstCourse = subjects[0].courses[0];
    return {
      terms: firstCourse.year_summary.terms.map(term => ({
        name: term.name,
        average: term.average,
        weight: term.weight,
        parts: term.parts.map(part => ({
          name: part.name,
          average: part.average,
          weight: part.weight
        })),
        exam: term.exam
      }))
    };
  };

  const structure = getStructure();

  const calculateDesiredValue = (subject, termIndex, partIndex, type) => {
    const course = subject.courses[0];
    if (!course) return null;

    const terms = course.year_summary.terms;
    const selectedTerm = terms[termIndex];
    if (!selectedTerm) return null;

    // Calcular la suma ponderada de los otros términos
    let otherTermsSum = 0;
    const totalWeight = terms.length; // Cada trimestre vale 1

    terms.forEach((term, idx) => {
      if (idx !== termIndex && term.average !== null && term.average !== undefined) {
        otherTermsSum += term.average; // Cada trimestre vale 1
      }
    });

    if (type === 'exam') {
      // Para el término seleccionado, calculamos la contribución de los parciales
      const parts = selectedTerm.parts.filter(part => part.average !== null && part.average !== undefined);
      
      if (parts.length === 0) {
        // Caso 1: No hay parciales, solo consideramos el examen
        const examWeight = (selectedTerm.exam?.weight || selectedTerm.exams?.weight) / 100;
        if (!examWeight) return null;
        return (desiredAverage * totalWeight - otherTermsSum);
      } else {
        // Caso 2: Hay parciales, aplicamos la fórmula completa
        const partWeight = parts.reduce((sum, part) => sum + (part.weight / 100), 0);
        const partSum = parts.reduce((sum, part) => sum + part.average * (part.weight / 100), 0);
        const examWeight = (selectedTerm.exam?.weight || selectedTerm.exams?.weight) / 100;
        
        if (!examWeight) return null;
        return (desiredAverage * totalWeight - otherTermsSum - partSum) / examWeight;
      }
    }

    return null;
  };

  const handleCalculate = () => {
    console.log('Iniciando cálculo...');
    const newCalculatedValues = {};
    
    subjects.forEach(subject => {
      const course = subject.courses[0];
      if (!course) return;

      const term = course.year_summary.terms[selectedTerm];
      if (!term) return;

      console.log(`Procesando materia: ${subject.name}`);
      console.log(`Término seleccionado: ${term.name}`);
      console.log(`Tipo seleccionado: ${selectedType}`);

      if (selectedType === 'exam') {
        const value = calculateDesiredValue(subject, selectedTerm, null, 'exam');
        console.log(`Valor calculado para examen: ${value}`);
        if (value !== null) {
          const key = `${subject._id}-exam-${selectedTerm}`;
          newCalculatedValues[key] = value;
          console.log(`Guardando valor para ${key}: ${value}`);
        }
      } else if (selectedType === 'part') {
        term.parts.forEach((part, partIndex) => {
          const value = calculateDesiredValue(subject, selectedTerm, partIndex, 'part');
          console.log(`Valor calculado para parcial ${partIndex + 1}: ${value}`);
          if (value !== null) {
            const key = `${subject._id}-part-${selectedTerm}-${partIndex}`;
            newCalculatedValues[key] = value;
            console.log(`Guardando valor para ${key}: ${value}`);
          }
        });
      }
    });

    console.log('Valores calculados:', newCalculatedValues);
    setCalculatedValues(newCalculatedValues);
  };

  const renderGrade = (value, subject, termIndex, partIndex, type) => {
    const key = `${subject._id}-${type}-${termIndex}${partIndex !== null ? `-${partIndex}` : ''}`;
    const calculatedValue = calculatedValues[key];
    
    console.log(`Renderizando para ${key}:`, {
      value,
      calculatedValue,
      type,
      termIndex,
      partIndex
    });

    // Si hay un valor calculado, lo usamos directamente
    const displayValue = calculatedValue !== undefined ? calculatedValue.toFixed(2) :
                        (!value && value !== 0) ? '-' : (typeof value === 'number' ? value.toFixed(2) : value);
    
    const colorClass = displayValue !== '-' ? (parseFloat(displayValue) >= 7 ? 'text-green-500' : 'text-red-500') : '';
    
    return (
      <div className="flex items-center justify-center space-x-2">
        <InputCell
          value={displayValue}
          className={colorClass}
        />
        <button
          onClick={() => handleShowDetails(subject, termIndex, partIndex, type)}
          className="px-2 py-1 text-xs bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Ver
        </button>
      </div>
    );
  };

  const handleShowDetails = (subject, termIndex, partIndex, type) => {
    const course = subject.courses[0];
    if (!course) return;
    
    const term = course.year_summary.terms[termIndex];
    if (!term) return;

    let activityTypes = [];
    if (type === 'term') {
      activityTypes = term.parts.flatMap(part => part.activity_types || []);
    } else if (type === 'part' && term.parts[partIndex]) {
      activityTypes = term.parts[partIndex].activity_types || [];
    } else if (type === 'exam' && term.exam) {
      activityTypes = [{
        name: 'Examen',
        weight: term.exam.weight,
        activities: [{ name: 'Examen Final', score: term.exam.value }]
      }];
    }

    setModalData({
      subject: subject.name,
      term: term.name,
      part: type === 'term' ? '' : 
            type === 'part' ? term.parts[partIndex].name : 'Examen',
      activityTypes
    });
  };

  const getTermData = (subject, termIndex) => {
    const course = subject.courses[0];
    if (!course) return {};
    
    const term = course.year_summary.terms[termIndex];
    if (!term) return {};

    return {
      termAverage: term.average,
      parts: term.parts.map(part => part.average || '-'),
      exam: term.exam?.value || '-'
    };
  };

  return (
    <div className="space-y-4">
      <div className="overflow-x-auto scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-transparent hover:scrollbar-thumb-gray-500">
        <table className="min-w-full border-collapse border border-gray-200">
          <thead>
            <tr className="bg-gray-900 text-white">
              <th className="border border-gray-200 px-4 py-2">Período</th>
              {subjects.map((subject, index) => (
                <th key={index} className="border border-gray-200 px-4 py-2 text-sm">
                  {subject.name}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {structure.terms.map((term, termIndex) => (
              <React.Fragment key={termIndex}>
                <tr>
                  <td className="border border-gray-200 px-4 py-2 font-semibold bg-gray-900 text-white" rowSpan={term.parts.length + 2}>
                    <div className="flex flex-col">
                      <span>{term.name}</span>
                    </div>
                  </td>
                  {subjects.map((subject, index) => {
                    const data = getTermData(subject, termIndex);
                    return (
                      <td key={index} className="border border-gray-200 px-4 py-2 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Promedio del {term.name}</span>
                          {renderGrade(data.termAverage, subject, termIndex, null, 'term')}
                        </div>
                      </td>
                    );
                  })}
                </tr>
                {term.parts.map((part, partIndex) => (
                  <tr key={partIndex}>
                    {subjects.map((subject, index) => {
                      const data = getTermData(subject, termIndex);
                      return (
                        <td key={index} className="border border-gray-200 px-4 py-2 text-center">
                          <div className="flex flex-col">
                            <span className="text-xs text-gray-400 mb-1">{part.name}</span>
                            {renderGrade(data.parts[partIndex], subject, termIndex, partIndex, 'part')}
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))}
                <tr>
                  {subjects.map((subject, index) => {
                    const data = getTermData(subject, termIndex);
                    return (
                      <td key={index} className="border border-gray-200 px-4 py-2 text-center">
                        <div className="flex flex-col">
                          <span className="text-xs text-gray-400 mb-1">Examen</span>
                          {renderGrade(data.exam, subject, termIndex, null, 'exam')}
                        </div>
                      </td>
                    );
                  })}
                </tr>
              </React.Fragment>
            ))}
            <tr>
              <td className="border border-gray-200 px-4 py-2 font-semibold bg-gray-900 text-white">
                Promedio Final
              </td>
              {subjects.map((subject, index) => (
                <td key={index} className="border border-gray-200 px-4 py-2 text-center">
                  {renderGrade(subject.courses[0].year_summary.average, subject, null, null, 'final')}
                </td>
              ))}
            </tr>
          </tbody>
        </table>
      </div>

      <div className="bg-gray-900 p-4 rounded-lg">
        <h3 className="text-lg font-semibold text-white mb-4">Cálculo de Promedio Deseado</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Promedio Deseado
            </label>
            <input
              type="number"
              min="0"
              max="10"
              step="0.01"
              value={desiredAverage}
              onChange={(e) => setDesiredAverage(parseFloat(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Tipo
            </label>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="exam">Examen</option>
              <option value="part">Parcial</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Term
            </label>
            <select
              value={selectedTerm}
              onChange={(e) => setSelectedTerm(parseInt(e.target.value))}
              className="w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {structure.terms.map((term, index) => (
                <option key={index} value={index}>{term.name}</option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleCalculate}
              className="w-full px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Calcular
            </button>
          </div>
        </div>
      </div>

      {modalData && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
          onClick={handleCloseModal}
        >
          <div 
            className="bg-gray-900 text-white rounded-lg p-6 max-w-lg w-full max-h-[90vh] relative"
            onClick={e => e.stopPropagation()}
          >
            <div className="absolute top-4 right-4">
              <button
                onClick={handleCloseModal}
                className="text-gray-400 hover:text-white"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <h3 className="text-xl font-bold mb-4 border-b border-gray-700 pb-2 pr-8">
              {modalData.subject} - {modalData.term} - {modalData.part}
            </h3>
            <div className="overflow-y-auto max-h-[calc(90vh-12rem)] scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800 pr-2">
              {modalData.activityTypes && modalData.activityTypes.length > 0 ? (
                <div className="space-y-4">
                  {modalData.activityTypes.map((activityType, index) => (
                    <div key={index} className="bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2 text-blue-400">
                        {activityType.name}
                        {activityType.weight && (
                          <span className="text-sm text-gray-400 ml-2">
                            (Peso: {activityType.weight}%)
                          </span>
                        )}
                      </h4>
                      <div className="space-y-2">
                        {activityType.activities && activityType.activities.map((activity, actIndex) => (
                          <div key={actIndex} className="flex justify-between items-center">
                            <span className="text-gray-300">{activity.name}</span>
                            <InputCell
                              value={activity.score?.toFixed(2) || '-'}
                              className={activity.score >= 7 ? 'text-green-500' : 'text-red-500'}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-400">
                  No hay actividades disponibles para este período
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GradesTable; 