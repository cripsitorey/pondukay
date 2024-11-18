import { useState, useEffect } from 'react';
import NotasTable from '../components/NotasTable';

export default function Home() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchNotas = async () => {
      setLoading(true);
      try {
        const response = await fetch('/api/scrape-idukay', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username: 'emiliocuenca@saintdominicschool.edu.ec', password: '20070612' }),
        });
        const data = await response.json();
        setNotas(data.notas);
      } catch (error) {
        console.error('Error fetching notas:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNotas();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calificaciones</h1>
      {loading ? <p>Cargando...</p> : <NotasTable notas={notas} />}
    </div>
  );
}
