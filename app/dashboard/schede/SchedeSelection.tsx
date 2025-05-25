"use client";

import { useEffect, useState } from "react";
import {
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { db } from "@/firebase";
import { X, Trash, Pencil, User } from "lucide-react";
import Input from "@/app/ui/input";

export default function SchedeSelection() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [editingSchedule, setEditingSchedule] = useState<any | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<any | null>(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [allExercises, setAllExercises] = useState<any[]>([]);
  const [allClients, setAllClients] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState<string>("Tutti");

  const [formData, setFormData] = useState({
    note: "",
    day: "",
    exercises: [] as string[],
  });

  useEffect(() => {
    const fetchSchedules = async () => {
      const user = getAuth().currentUser;
      if (!user) return;

      const qClient = query(
        collection(db, "schedules"),
        where("clientId", "==", user.uid)
      );

      const qTrainer = query(
        collection(db, "schedules"),
        where("trainerId", "==", user.uid)
      );

      const [clientSnap, trainerSnap] = await Promise.all([
        getDocs(qClient),
        getDocs(qTrainer),
      ]);

      const clientSchedules = clientSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const trainerSchedules = trainerSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));

      const allSchedules = [...clientSchedules, ...trainerSchedules];
      const uniqueSchedules = Array.from(
        new Map(allSchedules.map((s) => [s.id, s])).values()
      );

      setSchedules(uniqueSchedules);
    };

    const fetchExercises = async () => {
      const querySnapshot = await getDocs(collection(db, "exercises"));
      const exercisesArray = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllExercises(exercisesArray);
    };

    const fetchClients = async () => {
      const clientsSnap = await getDocs(collection(db, "clients"));
      const clientsArray = clientsSnap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAllClients(clientsArray);
    };

    fetchSchedules();
    fetchExercises();
    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Vuoi davvero eliminare questa scheda?")) return;
    try {
      await deleteDoc(doc(db, "schedules", id));
      setSchedules((prev) => prev.filter((s) => s.id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  const handleEditClick = (schedule: any) => {
    setEditingSchedule(schedule);
    setFormData({
      note: schedule.note || "",
      day: schedule.day || "",
      exercises: schedule.exercises || [],
    });
    setModalOpen(true);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const toggleExercise = (exerciseId: string) => {
    setFormData((prev) => {
      const exists = prev.exercises.includes(exerciseId);
      return {
        ...prev,
        exercises: exists
          ? prev.exercises.filter((id) => id !== exerciseId)
          : [...prev.exercises, exerciseId],
      };
    });
  };

  const handleSave = async () => {
    if (!editingSchedule) return;
    try {
      const docRef = doc(db, "schedules", editingSchedule.id);
      await updateDoc(docRef, formData);

      setSchedules((prev) =>
        prev.map((s) =>
          s.id === editingSchedule.id ? { ...s, ...formData } : s
        )
      );

      setModalOpen(false);
      setEditingSchedule(null);
    } catch (error) {
      console.error(error);
    }
  };


  const getClientName = (clientId: string) => {
    const client = allClients.find((c) => c.id === clientId);
    if (!client) return clientId; // fallback: mostra id se non trovato
    return `${client.nome} ${client.cognome}`;
  };

  const getExerciseName = (exerciseId: string) => {
    const exercise = allExercises.find((e) => e.id === exerciseId);
    return exercise ? exercise.nome : exerciseId;
  };

  return (
    <div className="mt-4">
      {/* FILTRO */}
      <div className="mb-6 w-1/5 relative">
        <select
          value={selectedDay}
          onChange={(e) => setSelectedDay(e.target.value)}
          className="appearance-none w-full px-4 py-2 pr-10 rounded-xl border-2 border-primary-500 bg-secondary-50 text-primary-500 font-semibold shadow-sm hover:shadow-md transition duration-200 focus:outline-none focus:ring-2 focus:ring-primary-300 cursor-pointer"
        >
          <option value="Tutti">Tutti</option>
          <option value="Lunedì">Lunedì</option>
          <option value="Martedì">Martedì</option>
          <option value="Mercoledì">Mercoledì</option>
          <option value="Giovedì">Giovedì</option>
          <option value="Venerdì">Venerdì</option>
          <option value="Sabato">Sabato</option>
          <option value="Domenica">Domenica</option>
        </select>
        <span className="pointer-events-none absolute right-3 top-1/2 transform -translate-y-1/2 text-primary-500 text-lg">
          ▼
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {schedules
          .filter((s) => selectedDay === "Tutti" || s.day === selectedDay)
          .map((s) => (
            <div
              key={s.id}
              onClick={() => {
                setSelectedSchedule(s);
                setViewModalOpen(true);
              }}
              className="cursor-pointer w-full p-6 bg-white border border-gray-200 rounded-lg shadow-sm h"
            >
              <div className="flex items-center gap-2 mb-2">
                <User className="text-gray-600" size={20} />
                <h5 className="text-lg font-bold tracking-tight text-gray-900 truncate">
                  {getClientName(s.clientId)}
                </h5>
              </div>
              <p className="text-sm text-gray-500">Giorno: {s.day || "-"}</p>
            </div>
          ))}
      </div>

      {/* Modal dettaglio scheda */}
      {viewModalOpen && selectedSchedule && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="relative bg-white p-6 rounded-sm shadow-md border-2 border-primary-500 w-full max-w-md">
            <button
              onClick={() => {
                setViewModalOpen(false);
                setSelectedSchedule(null);
              }}
              className="absolute top-3 right-3 cursor-pointer"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-semibold mb-4">Dettagli Scheda</h2>

            <div className="text-md">
              <h3 className="text-xl mb-2 font-semibold">
                {getClientName(selectedSchedule.clientId)}
              </h3>
              <p className="mb-2">
                <strong>Giorno:</strong> {selectedSchedule.day || "-"}
              </p>
              <div className="mb-4">
                <strong>Esercizi:</strong>
                <ul className="list-disc list-inside mt-1">
                  {Array.isArray(selectedSchedule.exercises) ? (
                    selectedSchedule.exercises.map(
                      (exId: string, i: number) => {
                        const esercizio = allExercises.find(
                          (e) => e.id === exId
                        );
                        return (
                          <li key={i}>
                            {esercizio
                              ? `${esercizio.nome} ${
                                  esercizio.ripetizioni
                                    ? `(${esercizio.ripetizioni})`
                                    : ""
                                }`
                              : exId}
                          </li>
                        );
                      }
                    )
                  ) : (
                    <li>-</li>
                  )}
                </ul>
              </div>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                onClick={() => {
                  setViewModalOpen(false);
                  handleEditClick(selectedSchedule);
                }}
                className="flex items-center gap-2 text-sm font-medium cursor-pointer"
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

      {/* Modal modifica scheda */}
      {modalOpen && editingSchedule && (
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

            <div className="space-y-4">
              <label className="text-sm font-medium text-secondary-700">
                Giorno della settimana
              </label>
              <select
                name="day"
                value={formData.day}
                onChange={handleFormChange}
                className="cursor-pointer appearance-none h-[54px] px-4 pr-10 w-full border text-lg bg-secondary-50 border-secondary-300 placeholder-secondary-400 rounded-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition duration-150"
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

              <label className="text-sm font-medium text-secondary-700">
                Note
              </label>
              <Input
                type="text"
                name="note"
                value={formData.note}
                onChange={(e:any) =>
                  setFormData((prev) => ({ ...prev, note: e.target.value }))
                }
                placeholder="Note"
              />

              <label className="text-sm font-medium text-secondary-700">
                Esercizi
              </label>
              <div className="max-h-40 overflow-y-auto border bg-secondary-50 border-secondary-300 rounded px-3 py-2 space-y-2 text-lg">
                {allExercises.map((exercise) => (
                  <label
                    key={exercise.id}
                    className="flex items-center space-x-2"
                  >
                    <input
                      type="checkbox"
                      checked={formData.exercises.includes(exercise.id)}
                      onChange={() => toggleExercise(exercise.id)}
                      className="accent-primary-500"
                    />
                    <span>{exercise.nome} ({exercise.ripetizioni})</span>
                  </label>
                ))}
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
              <button onClick={handleSave} className="px-4 py-2 bg-primary-500 text-white rounded-sm hover:bg-primary-600 text-base font-semibold transition cursor-pointer">Salva</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
