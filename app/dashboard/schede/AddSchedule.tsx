"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, addDoc, query, where } from "firebase/firestore";
import { db, auth } from "@/firebase";
import { onAuthStateChanged, User } from "firebase/auth";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { X } from "lucide-react";
import { getAuth } from "firebase/auth";

type Props = {
  onClose: () => void;
};

export default function AddSchedule({ onClose }: Props) {
  const [user, setUser] = useState<User | null>(null);
  const [clients, setClients] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [note, setNote] = useState("");
  const [day, setDay] = useState("");

  // Prendi l'utente autenticato
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });
    return () => unsubscribe();
  }, []);

  // Carica gli esercizi associati all'utente autenticato
  useEffect(() => {
    if (!user) return;

    const fetchExercises = async () => {
      try {
        const q = query(
          collection(db, "exercises"),
          where("userId", "==", user.uid)
        );
        const exercisesSnap = await getDocs(q);
        setExercises(exercisesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Errore durante il recupero esercizi:", error);
      }
    };

    fetchExercises();
  }, [user]);

  // Carica i clienti associati al personal trainer autenticato
  useEffect(() => {
    if (!user) return;

    const fetchClients = async () => {
      try {
        const q = query(
          collection(db, "clients"),
          where("trainerId", "==", user.uid)
        );
        const clientsSnap = await getDocs(q);
        setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (error) {
        console.error("Errore durante il recupero clienti:", error);
      }
    };

    fetchClients();
  }, [user]);

  const handleExerciseToggle = (id: string) => {
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const createSchedule = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      alert("Devi essere loggato per creare una scheda.");
      return;
    }

    try {
      await addDoc(collection(db, "schedules"), {
        clientId: selectedClient,
        exercises: selectedExercises,
        note,
        day,
        trainerId: user.uid,
      });
      onClose();
      window.location.reload();
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-secondary-800/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white px-6 py-10 border-4 border-primary-500 rounded-sm max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-800 cursor-pointer"
          aria-label="Chiudi"
        >
          <X size={20} />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">Nuova Scheda</h2>

        <div className="space-y-4">
          <label className="text-sm font-medium text-secondary-700">Seleziona Cliente</label>
          <select
            value={selectedClient}
            onChange={e => setSelectedClient(e.target.value)}
            className="appearance-none h-[54px] px-4 pr-10 w-full border text-lg bg-secondary-50 border-secondary-300 placeholder-secondary-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
          >
            <option value="">-- Seleziona --</option>
            {clients.map(client => (
              <option key={client.id} value={client.id}>
                {client.nome} {client.cognome}
              </option>
            ))}
          </select>

          <label className="text-sm font-medium text-secondary-700">Giorno della settimana</label>
          <select
            value={day}
            onChange={e => setDay(e.target.value)}
            className="appearance-none h-[54px] px-4 pr-10 w-full border text-lg bg-secondary-50 border-secondary-300 placeholder-secondary-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
          >
            <option value="">-- Seleziona --</option>
            <option value="Lunedì">Lunedì</option>
            <option value="Martedì">Martedì</option>
            <option value="Mercoledì">Mercoledì</option>
            <option value="Giovedì">Giovedì</option>
            <option value="Venerdì">Venerdì</option>
            <option value="Sabato">Sabato</option>
            <option value="Domenica">Domenica</option>
          </select>

          <label className="text-sm font-medium text-secondary-700">Esercizi</label>
          <div className="max-h-40 overflow-y-auto border bg-secondary-50 border-secondary-300 rounded px-3 py-2 space-y-2 text-lg">
            {exercises.map(exercise => (
              <label key={exercise.id} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  value={exercise.id}
                  checked={selectedExercises.includes(exercise.id)}
                  onChange={() => handleExerciseToggle(exercise.id)}
                  className="accent-primary-500"
                />
                <span>{exercise.nome}</span>
              </label>
            ))}
          </div>

          <Input
            type="text"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Note"
          />
        </div>

        <div className="mt-6 flex justify-end space-x-4">
          <Button onClick={createSchedule}>Crea Scheda</Button>
        </div>
      </div>
    </div>
  );
}
