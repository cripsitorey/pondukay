import { useState } from 'react';
import Image from 'next/image';
import HowToUse from '@/components/HowToUse';
import GradesTable from '../components/GradesTable';

export default function Home() {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [notas, setNotas] = useState(null); // Puede ser objeto o array
  const [students, setStudents] = useState([]); // Lista de estudiantes para cuentas de padre
  const [selectedStudent, setSelectedStudent] = useState(null); // Estudiante seleccionado
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch('/api/scrape-idukay', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });
      const data = await response.json();
      
      setNotas(data.notas);

      if (Array.isArray(data.notas)) {
        // Cuenta de padre
        const studentList = data.notas.map((entry, index) => ({
          id: index,
          name: entry.student,
          data: entry,
        }));
        setStudents(studentList);
        setSelectedStudent(studentList[0]); // Seleccionar el primer estudiante
      } else {
        // Cuenta de estudiante
        setStudents([]);
        setSelectedStudent(null);
      }
    } catch (error) {
      console.error('Error fetching notas:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleStudentChange = (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    setSelectedStudent(students[selectedIndex]);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calificaciones IDUKAY</h1>
      <h2 className="text-xl font-bold mb-4">Bienvenido {credentials.username}</h2>
      <h2 className="text-xl font-bold mb-4 bg-red-600">PARA CUENTAS DE PADRE SOLO FUNCIONA EL PRIMER ESTUDIANTE</h2>
      {!notas && <HowToUse />}
      <Image src="/logo.png" alt="Logo" className="w-16 h-16" width={100} height={100} />
      {loading && <p>Cargando...</p>}
      {!notas && (
        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="email"
            placeholder="Correo electrónico"
            value={credentials.username}
            onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
            required
            className="w-full p-2 border rounded text-black"
          />
          <input
            type="password"
            placeholder="Contraseña"
            value={credentials.password}
            onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
            required
            className="w-full p-2 border rounded text-black"
          />
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Iniciar Sesión
          </button>
        </form>
      )}
      {students.length > 0 && (
        <div className="my-4">
          <label htmlFor="studentSelector" className="block text-sm font-medium text-gray-700">
            Selecciona un estudiante:
          </label>
          <select
            id="studentSelector"
            value={students.findIndex((s) => s === selectedStudent)}
            onChange={handleStudentChange}
            className="w-full p-2 border rounded text-black"
          >
            {students.map((student, index) => (
              <option key={student.id} value={index} className='text-black'>
                {student.name}
              </option>
            ))}
          </select>
        </div>
      )}
      {notas && !Array.isArray(notas) && <GradesTable notas={notas} />}
      {selectedStudent && <GradesTable notas={selectedStudent.data.resulto} />}
    </div>
  );
}
