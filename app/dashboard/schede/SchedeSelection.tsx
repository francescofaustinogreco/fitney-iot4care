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
import { getAuth } from "firebase/auth";

export default function SchedeSelection() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [clientsMap, setClientsMap] = useState<{ [id: string]: string }>({});
  const [exerciseMap, setExerciseMap] = useState<{ [id: string]: string }>({});
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    note: "",
    exercises: [] as string[],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Utente non loggato!");
          return;
        }
        const trainer = user?.uid;

        const schedulesSnapshot = await getDocs(collection(db, "schedules"));
        const clientsSnapshot = await getDocs(collection(db, "clients"));
        const exerciseSnapshot = await getDocs(collection(db, "exercises"));

        const clientsData: { [id: string]: string } = {};
        clientsSnapshot.forEach((doc) => {
          const data = doc.data();
          clientsData[doc.id] = `${data.nome} ${data.cognome}`;
        });
        setClientsMap(clientsData);

        const exerciseData: { [id: string]: string } = {};
        exerciseSnapshot.forEach((doc) => {
          const data = doc.data();
          exerciseData[doc.id] = data.nome;
        });
        setExerciseMap(exerciseData);

        const schedulesArray = schedulesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .filter((s: any) => s.trainerId === trainer);

        setSchedules(schedulesArray);
      } catch (error) {
        console.error("Errore nel recupero dei dati:", error);
      }
    };

    fetchData();
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

  const handleExerciseToggle = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      exercises: prev.exercises.includes(id)
        ? prev.exercises.filter((e) => e !== id)
        : [...prev.exercises, id],
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
      <div className="grid grid-cols-4 gap-4">
        {schedules.map((s) => (
          <div
            key={s.id}
            onClick={() => {
              setSelectedSchedule(s);
              setViewModalOpen(true);
            }}
            className="cursor-pointer max-w-sm p-6 bg-red-500 border border-gray-200 rounded-lg shadow-sm dark:bg-gray-800 dark:border-gray-700"
          >
            <h5 className="mb-2 text-lg font-bold tracking-tight text-gray-900 dark:text-white truncate">
              {clientsMap[s.clientId] || s.clientId}
            </h5>
            <p className="mb-3 font-normal text-gray-700 dark:text-gray-400 truncate">
              {Array.isArray(s.exercises)
                ? s.exercises.map((id: string) => exerciseMap[id] || id).join(", ")
                : "-"}
            </p>
          </div>
        ))}
      </div>

      {viewModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-sm shadow-md border-2 border-primary-500 w-full max-w-md dark:bg-gray-800 dark:border-gray-700">
            <button
              onClick={() => {
                setViewModalOpen(false);
                setSelectedSchedule(null);
              }}
              className="absolute top-3 right-3 text-slate-500 hover:text-slate-800 dark:text-gray-400 dark:hover:text-white cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">
              Dettagli Scheda
            </h2>

            <p className="text-sm text-gray-700 dark:text-gray-300 mb-2">
              <strong>Cliente:</strong>{" "}
              {clientsMap[selectedSchedule.clientId] || selectedSchedule.clientId}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              <strong>Esercizi:</strong>{" "}
              {Array.isArray(selectedSchedule.exercises)
                ? selectedSchedule.exercises.map((id: string) => exerciseMap[id] || id).join(", ")
                : "-"}
            </p>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditClick(selectedSchedule);
                }}
                className="flex items-center gap-2 text-sm -600 font-medium cursor-pointer"
              >
                <Pencil size={16} />
                Modifica
              </button>

              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleDelete(selectedSchedule.id);
                }}
                className="flex items-center gap-2 text-sm text-red-600 hover:text-red-800 font-medium cursor-pointer"
              >
                <Trash size={16} />
                Elimina
              </button>
            </div>
          </div>
        </div>
      )}

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

              <div>
                <h3 className="text-base font-semibold mb-2">Esercizi</h3>
                <div className="grid grid-cols-2 gap-2 max-h-48 overflow-y-auto">
                  {Object.entries(exerciseMap).map(([id, nome]) => (
                    <label key={id} className="flex items-center gap-2 text-sm">
                      <input
                        type="checkbox"
                        checked={formData.exercises.includes(id)}
                        onChange={() => handleExerciseToggle(id)}
                      />
                      {nome}
                    </label>
                  ))}
                </div>
              </div>
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
