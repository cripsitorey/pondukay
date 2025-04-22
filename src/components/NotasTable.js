import React from 'react';
import ExpandableRow from './expandida';
import InputCell from './InputCell';

const NotasTable = ({ notas }) => {
  if (!notas?.response?.subjects) {
    return <p className="text-center text-gray-500 mt-4">No hay calificaciones disponibles.</p>;
  }

  // Filtrar las materias que tienen al menos una actividad en algún nivel
  const filteredSubjects = notas.response.subjects.filter(subject => {
    let totalActivities = 0;
    subject.courses.forEach(course => {
      course.year_summary.terms.forEach(term => {
        term.parts.forEach(part => {
          part.activity_types.forEach(activityType => {
            totalActivities += (activityType.activities?.length || 0);
          });
        });
      });
    });
    return totalActivities > 0;
  });

  return (
    <div className="space-y-8">
      <table className='w-full'>
      {filteredSubjects.map((subject, subjectIndex) => (
        <ExpandableRow key={subjectIndex} label={subject.name} garde={subject.year_summary.average}>
          <div className="p-4">
            {subject.courses.map((course, courseIndex) => (
              <div key={courseIndex}>
                {course.year_summary.terms
                  // Filtrar trimestres sin actividades
                  .filter(term => {
                    let termTotal = 0;
                    term.parts.forEach(part => {
                      part.activity_types.forEach(activityType => {
                        termTotal += (activityType.activities?.length || 0);
                      });
                    });
                    return termTotal > 0;
                  })
                  .map((term, termIndex) => (
                    <div key={termIndex} className="mb-6">
                      <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-200 mb-2">
                        Trimestre {termIndex + 1}
                      </h3>
                      {term.parts.map((part, partIndex) => (
                        <div key={partIndex} className="mb-4">
                          <h4 className="text-lg font-medium text-gray-600 dark:text-gray-300 mb-2">
                            {part.abbreviation}
                          </h4>
                          {part.activity_types
                            // Filtrar tipos de actividad sin actividades
                            .filter(
                              activityType =>
                                activityType.activities &&
                                activityType.activities.length > 0
                            )
                            .map((activityType, activityTypeIndex) => (
                              <div key={activityTypeIndex} className="mb-4">
                                <h5 className="text-md font-medium text-gray-500 dark:text-gray-400 mb-2">
                                  {activityType.name}
                                </h5>
                                <div className="overflow-x-auto">
                                  <table className="min-w-full border border-gray-200 dark:border-gray-700">
                                    <thead className="bg-gray-100 dark:bg-gray-700">
                                      <tr>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                          Actividad
                                        </th>
                                        <th className="px-4 py-2 text-left text-xs font-medium text-gray-600 dark:text-gray-300 uppercase tracking-wider">
                                          Nota
                                        </th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {activityType.activities.map((activity, activityIndex) => (
                                        <tr
                                          key={activityIndex}
                                          className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900"
                                        >
                                          <td className="px-4 py-2 text-sm text-gray-700 dark:text-gray-200">
                                            {activity.name}
                                          </td>
                                          <InputCell
                                            label=""
                                            value={activity.score ?? 'Sin nota'}
                                          />
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            ))}
                            <div>
                              <span className='text-red-700'> EXAMEN TRIMESTRE {termIndex + 1}:</span><br></br>
                              <InputCell label="" value={term.exam.value ?? 'Sin nota'}/>
                            </div>
                        </div>
                      ))}
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </ExpandableRow>
      ))}
      </table>
    </div>
  );
};

export default NotasTable;
