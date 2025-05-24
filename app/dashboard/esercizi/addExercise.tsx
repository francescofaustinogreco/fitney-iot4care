"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { X, ChevronDown } from "lucide-react";

type ExerciseFormModalProps = {
  onClose: () => void;
};

export default function AddExercise({ onClose }: ExerciseFormModalProps) {
  const [nome, setNome] = useState("");
  const [difficoltà, setDifficoltà] = useState("bassa");
  const [note, setNote] = useState("");
  const [ripetizioni, setRipetizioni] = useState("");
  const [error, setError] = useState<string | null>(null);

  const addExerciseLogic = async () => {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setError("Utente non loggato.");
      return;
    }

    try {
      await addDoc(collection(db, "exercises"), {
        nome,
        difficoltà,
        note,
        ripetizioni,
        userId: user.uid,
      });
      onClose();
    } catch (e: any) {
      setError("Errore durante il salvataggio: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white px-6 py-10 border-4 border-primary-500 rounded-sm max-w-sm w-full">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 cursor-pointer"
        >
          <X size={25} />
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">
          Aggiungi Esercizio
        </h2>

        <div className="space-y-3">
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome Esercizio"
            required
          />

          <div className="relative w-full">
            <select
              value={difficoltà}
              onChange={(e) => setDifficoltà(e.target.value)}
              className="appearance-none h-[54px] px-4 pr-10 w-full border text-lg bg-secondary-50 border-secondary-300 placeholder-secondary-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
            >
              <option value="bassa">Bassa</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none text-secondary-400" />
          </div>

          <Input
            type="text"
            value={ripetizioni}
            onChange={(e) => setRipetizioni(e.target.value)}
            placeholder="Ripetizioni"
          />

          <Input
            type="text"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Note"
          />

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={addExerciseLogic}>Salva Esercizio</Button>
        </div>
      </div>
    </div>
  );
}
