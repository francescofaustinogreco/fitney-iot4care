"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";
import { db } from "@/firebase";
import { X, Trash, Pencil } from "lucide-react";
import Input from "@/app/ui/input";

export default function SchedeSelection() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    note: "",
    exercises: [] as string[],
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "schedules"));
        const schedulesArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSchedules(schedulesArray);
      } catch (error) {
        console.error("Errore nel recupero delle schede:", error);
      }
    };

    fetchSchedules();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Vuoi davvero eliminare questa scheda?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "schedules", id));
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Errore durante l'eliminazione della scheda:", error);
    }
  };

  const handleEditClick = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      note: schedule.note || "",
      exercises: schedule.exercises || [],
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
    if (!editingSchedule) return;

    try {
      const docRef = doc(db, "schedules", editingSchedule.id);
      await updateDoc(docRef, {
        note: formData.note,
        exercises: formData.exercises,
      });

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id ? { ...s, ...formData } : s
        )
      );

      setModalOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error("Errore durante il salvataggio della scheda:", error);
    }
  };

  return (
    <div className="mt-4">
      <table className="min-w-full divide-y divide-secondary-200 rounded-xl shadow-md overflow-hidden">
        <thead className="bg-secondary-100">
          <tr>
            <th className="px-6 py-3 text-left text-sm font-bold">Cliente</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Esercizi</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Note</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {schedules.map((s) => (
            <tr key={s.id} className="hover:bg-secondary-50 transition">
              <td className="px-6 py-4 text-sm">{s.clientId}</td>
              <td className="px-6 py-4 text-sm">
                {Array.isArray(s.exercises) ? s.exercises.join(", ") : "-"}
              </td>
              <td className="px-6 py-4 text-sm">{s.note || "-"}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button
                  onClick={() => handleEditClick(s)}
                  className="hover:text-secondary-700 cursor-pointer"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
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
                setEditingSchedule(null);
              }}
              className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-800 cursor-pointer"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-semibold mb-6 text-center">
              Modifica Scheda
            </h2>

            <div className="space-y-3">
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
                  setEditingSchedule(null);
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