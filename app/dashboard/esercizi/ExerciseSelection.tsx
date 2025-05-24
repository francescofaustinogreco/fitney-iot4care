"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { X, Trash, Pencil } from "lucide-react";
import Input from "@/app/ui/input";
import { getAuth } from "firebase/auth";

type Exercise = {
  id: string;
  nome: string;
  ripetizioni: string;
  difficoltà: string;
  note: string;
  userId: string;
};

export default function ExerciseSelection() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editingExercise, setEditingExercise] = useState<Exercise | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    ripetizioni: "",
    difficoltà: "",
    note: "",
  });

  useEffect(() => {
    const fetchExercises = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Utente non loggato.");
          return;
        }

        const q = query(
          collection(db, "exercises"),
          where("userId", "==", user.uid)
        );
        const querySnapshot = await getDocs(q);

        const exercisesArray = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Exercise, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });

        setExercises(exercisesArray);
      } catch (error) {
        console.error("Errore nel recupero degli esercizi:", error);
      }
    };

    fetchExercises();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm(
      "Sei sicuro di voler eliminare questo esercizio?"
    );
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "exercises", id));
      setExercises((prev) => prev.filter((ex) => ex.id !== id));
    } catch (error) {
      console.error("Errore durante l'eliminazione:", error);
    }
  };

  const handleEditClick = (exercise: Exercise) => {
    setEditingExercise(exercise);
    setFormData({
      nome: exercise.nome,
      ripetizioni: exercise.ripetizioni,
      difficoltà: exercise.difficoltà,
      note: exercise.note,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    if (!editingExercise) return;

    try {
      const docRef = doc(db, "exercises", editingExercise.id);
      await updateDoc(docRef, {
        nome: formData.nome,
        ripetizioni: formData.ripetizioni,
        difficoltà: formData.difficoltà,
        note: formData.note,
      });

      setExercises((prev) =>
        prev.map((ex) =>
          ex.id === editingExercise.id ? { ...ex, ...formData } : ex
        )
      );

      setModalOpen(false);
      setEditingExercise(null);
    } catch (error) {
      console.error("Errore durante il salvataggio:", error);
    }
  };

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-secondary-200 rounded-xl shadow-md overflow-hidden">
        <thead className="bg-secondary-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold">Nome</th>
            <th className="px-6 py-3 text-left text-sm font-bold">
              Ripetizioni
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold">
              Difficoltà
            </th>
            <th className="px-6 py-3 text-left text-sm font-bold">Note</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {exercises.map((ex) => (
            <tr key={ex.id} className="hover:bg-secondary-50 transition">
              <td className="px-6 py-4 text-sm">{ex.nome}</td>
              <td className="px-6 py-4 text-sm">{ex.ripetizioni}</td>
              <td className="px-6 py-4 text-sm">{ex.difficoltà}</td>
              <td className="px-6 py-4 text-sm">{ex.note}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button
                  onClick={() => handleEditClick(ex)}
                  className="hover:text-secondary-700 cursor-pointer"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(ex.id)}
                  className="hover:text-red-500 cursor-pointer"
                >
                  <Trash className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <div className="fixed inset-0 bg-secondary-800/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white px-6 py-10 border-4 border-primary-500 rounded-sm max-w-sm w-full">
            <button
              onClick={() => {
                setModalOpen(false);
                setEditingExercise(null);
              }}
              className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-800 cursor-pointer"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-semibold mb-6 text-center">
              Modifica Esercizio
            </h2>

            <div className="space-y-3">
              <Input
                type="text"
                name="nome"
                value={formData.nome}
                onChange={handleFormChange}
                placeholder="Nome"
                required
              />
              <Input
                type="text"
                name="ripetizioni"
                value={formData.ripetizioni}
                onChange={handleFormChange}
                placeholder="Ripetizioni"
                required
              />
              <Input
                type="text"
                name="difficoltà"
                value={formData.difficoltà}
                onChange={handleFormChange}
                placeholder="Difficoltà"
                required
              />
              <Input
                type="text"
                name="note"
                value={formData.note}
                onChange={handleFormChange}
                placeholder="Note"
              />
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingExercise(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-sm hover:bg-gray-300 text-base font-semibold transition cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded-sm hover:bg-primary-600 text-base font-semibold transition cursor-pointer"
              >
                Salva
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
