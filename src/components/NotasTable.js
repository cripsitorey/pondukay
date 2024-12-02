import React from 'react';
import ExpandableRow from './expandida';
import InputCell from './InputCell';

const NotasTable = ({ notas }) => {
  if (Array.isArray(notas)) {
    // Cuenta de padre: revisamos si hay estudiantes en la lista
    if (notas.length === 0) {
      return <p>No hay estudiantes disponibles.</p>;
    }
  } else if (!notas?.response?.subjects) {
    // Cuenta de estudiante: revisamos si hay materias disponibles
    return <p>No hay calificaciones disponibles.</p>;
  } else {
    return (
      <div className="relative overflow-x-auto shadow-md sm:rounded-lg">
        <table className="w-full text-sm text-left text-gray-500 dark:text-gray-400">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
            <tr>
              <th scope="col" className="px-6 py-3">Materia</th>
              <th scope="col" className="px-6 py-3">Trimestre</th>
              <th scope="col" className="px-6 py-3">Tipo de Actividad</th>
              <th scope="col" className="px-6 py-3">Actividad</th>
              <th scope="col" className="px-6 py-3">Nota</th>
            </tr>
          </thead>
          <tbody>
            {notas.response.subjects.map((subject, subjectIndex) => (
              <ExpandableRow key={subjectIndex} label={subject.name}>
                {subject.courses.map((course, courseIndex) => (
                  <React.Fragment key={courseIndex}>
                    {course.year_summary.terms.map((term, termIndex) => (
                      <ExpandableRow key={termIndex} label={`Trimestre ${term.name}`}>
                        {term.parts.map((part, partIndex) => (
                          <ExpandableRow key={partIndex} label={part.name}>
                            {part.activity_types.map((activityType, activityTypeIndex) => (
                              <ExpandableRow key={activityTypeIndex} label={activityType.name}>
                                {activityType.activities.map((activity, activityIndex) => (
                                  <tr key={activityIndex} className="border-b dark:border-gray-700">
                                    <td className="px-6 py-4" />
                                    <td />
                                    <td />
                                    <InputCell label={activity.name} value={activity.score ?? 'Sin nota'} />
                                  </tr>
                                ))}
                              </ExpandableRow>
                            ))}
                          </ExpandableRow>
                        ))}
                      </ExpandableRow>
                    ))}
                  </React.Fragment>
                ))}
              </ExpandableRow>
            ))}
          </tbody>
        </table>
      </div>
    );
  }
};

export default NotasTable;
