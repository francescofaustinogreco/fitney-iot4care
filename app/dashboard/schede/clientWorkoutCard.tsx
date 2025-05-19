import { useEffect, useState } from "react";
import { collection, getDocs, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

type Props = {
  onClose: () => void;
};

export default function AddSchedule({ onClose }: Props) {
  const [clients, setClients] = useState<any[]>([]);
  const [exercises, setExercises] = useState<any[]>([]);
  const [selectedClient, setSelectedClient] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<string[]>([]);
  const [note, setNote] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const clientsSnap = await getDocs(collection(db, "clients"));
      const exercisesSnap = await getDocs(collection(db, "exercises"));

      setClients(clientsSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      setExercises(exercisesSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    };

    fetchData();
  }, []);

  const handleExerciseToggle = (id: string) => {
    setSelectedExercises(prev =>
      prev.includes(id) ? prev.filter(e => e !== id) : [...prev, id]
    );
  };

  const createSchedule = async () => {
    try {
      await addDoc(collection(db, "schedules"), {
        clientId: selectedClient,
        exercises: selectedExercises,
        note,
      });
      onClose();
      window.location.reload(); 
    } catch (e: any) {
      console.log(e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Nuova Scheda</h2>

        <label className="block mb-2">Seleziona Cliente</label>
        <select
          value={selectedClient}
          onChange={(e) => setSelectedClient(e.target.value)}
          className="border p-2 mb-4 w-full"
        >
          <option value="">-- Seleziona --</option>
          {clients.map((client) => (
            <option key={client.id} value={client.id}>
              {client.nome} {client.cognome}
            </option>
          ))}
        </select>

        <label className="block mb-2">Esercizi</label>
        <div className="max-h-40 overflow-y-scroll border p-2 mb-4">
          {exercises.map((exercise) => (
            <label key={exercise.id} className="block">
              <input
                type="checkbox"
                value={exercise.id}
                checked={selectedExercises.includes(exercise.id)}
                onChange={() => handleExerciseToggle(exercise.id)}
                className="mr-2"
              />
              {exercise.nome} ({exercise.ripetizioni})
            </label>
          ))}
        </div>

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 mb-4 w-full"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-500">
            Annulla
          </button>
          <button
            onClick={createSchedule}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Crea Scheda
          </button>
        </div>
      </div>
    </div>
  );
}
