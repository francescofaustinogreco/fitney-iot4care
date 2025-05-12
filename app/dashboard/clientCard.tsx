"use client";

import { getDatabase, ref, set } from "firebase/database";
import React, { useState } from "react";

async function writeUserData(
  trainerId: string,
  nome: string,
  cognome: string,
  età: number,
  limitazioni: string
) {
  try {
    const db = getDatabase();
    await set(ref(db, "users/" + trainerId), {
      nome: nome,
      cognome: cognome,
      età: età,
      limitazioni: limitazioni,
    });
    console.log("Dati salvati con successo!");
  } catch (err: any) {
    console.error("Errore durante il salvataggio della scheda: ", err);
  }
}

export default function TrainerForm() {
  const [trainerId, setTrainerId] = useState("");
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [età, setEtà] = useState(0);
  const [limitazioni, setLimitazioni] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!trainerId || !nome || !cognome || età <= 0) {
      alert("Compila tutti i campi!");
      return;
    }
    await writeUserData(trainerId, nome, cognome, età, limitazioni);
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 max-w-md mx-auto space-y-4">
      <input
        type="text"
        placeholder="Trainer ID"
        value={trainerId}
        onChange={(e) => setTrainerId(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Nome"
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Cognome"
        value={cognome}
        onChange={(e) => setCognome(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="number"
        placeholder="Età"
        value={età}
        onChange={(e) => setEtà(Number(e.target.value))}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Limitazioni"
        value={limitazioni}
        onChange={(e) => setLimitazioni(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded">
        Crea Scheda
      </button>
    </form>
  );
}
