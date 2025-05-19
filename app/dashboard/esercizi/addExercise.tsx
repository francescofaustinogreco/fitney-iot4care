import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/firebase";

type clientFormModal = {
    onClose: () => void;
}

export default function AddExercise({onClose}: clientFormModal){
    const [nome, setNome] = useState("");
    const [ripetizioni, setRipetizioni] = useState("");
    const [reps, setReps] = useState("");
    const [difficoltà, setDifficoltà] = useState("");
    const [note, setNote] = useState("");

    const addExerciseLogic = async () => {
        try{
            await addDoc(collection(db, "exercises"),{
                nome,
                ripetizioni,
                reps,
                difficoltà,
                note,
            });
            window.location.reload();
            onClose();
        }catch(e: any){
            console.log(e.message);
        }
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Aggiungi Esercizio</h2>

        <input
          type="text"
          placeholder="Nome Esercizio"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          placeholder="Reps"
          value={reps}
          onChange={(e) => setReps(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          placeholder="Ripetizioni"
          value={ripetizioni}
          onChange={(e) => setRipetizioni(e.target.value)}
          className="border p-2 mb-2 w-full"
        />


        <input
          type="text"
          placeholder="Difficoltà"
          value={difficoltà}
          onChange={(e) => setDifficoltà(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          placeholder="Note"
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-500">
            Annulla
          </button>
          <button
            onClick={addExerciseLogic}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salva Cliente
          </button>
        </div>
      </div>
    </div>
  );
}