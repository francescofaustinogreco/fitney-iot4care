'use client';

import { useEffect, useState } from 'react';
import { getUserName } from '../../lib/getUserName';
import Sidebar from '../../components/Sidebar';

export default function Schede() {
  const [nome, setName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserName()
      .then((userName) => setName(userName))
      .catch((error) => {
        console.error('Errore nel recupero del nome:', error);
        setName('');
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <Sidebar />
      <div className="ml-[20%] w-full h-screen p-12">
        <h1 className="text-4xl font-bold mb-2">Ciao{nome ? `, ${nome}` : ''}! 👋</h1>
        {loading ? (
          <p>Caricamento...</p>
        ) : (
          <p>Benvenuto in Fitney</p>
        )}
      </div>
    </div>
  );
}
