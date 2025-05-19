"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Trash } from "lucide-react";

type Exercise = {
  id: string;
  nome: string;
  difficoltà: "bassa" | "media" | "alta";
  note?: string;
};

export default function ExerciseSelection() {
  const [exercises, setExercises] = useState<Exercise[]>([]);

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "exercises"));
        const exercisesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as Exercise[];
        setExercises(exercisesArray);
      } catch (error) {
        console.error("Errore nel recupero degli esercizi:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Sei sicuro di voler eliminare questo esercizio?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "exercises", id));
      setExercises((prev) => prev.filter((exercise) => exercise.id !== id));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-secondary-200 rounded-xl shadow-md overflow-hidden">
        <thead className="bg-secondary-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold">Nome</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Difficoltà</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Note</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {exercises.map((exercise) => (
            <tr key={exercise.id} className="hover:bg-secondary-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exercise.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 capitalize">
                {exercise.difficoltà}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {exercise.note || "-"}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => handleDelete(exercise.id)}
                  className="hover:text-red-600 transition"
                  aria-label="Elimina esercizio"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
