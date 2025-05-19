"use client";
import Sidebar from "../../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import AddExercise from "./addExercise";
import ExerciseSelection from "./ExerciseSelection";

export default function Schede() {
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsub(); // Pulisco il listener
  }, [router]);

  return (
    <div>
      <Sidebar />
      <div className="ml-[20%] w-full p-12">
        <div className="w-3/4 border-b-secondary-100 border-b-1">
          <span className="text-[70px]">🏋🏽</span>
          <h1 className="text-4xl font-bold mt-6">Esercizi</h1>
          <p className="my-2">
            Pagina dedicata all'inserimento ed alla visualizzazione degli
            esercizi che andranno a svolgere i propri clienti.
          </p>
        </div>

        <div className="mt-10 w-3/4">
          <div className="flex w-full justify-between items-center border-b-secondary-100 border-b-1 pb-2">
            <h3 className="text-xl font-semibold">Visualizzazione Esercizi</h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-500 font-semibold rounded-sm text-white text-lg px-4 py-2 cursor-pointer hover:bg-primary-600 transition flex items-center"
            >
              Add<i className="bx  bx-plus text-xl ml-2 font-bold"></i>
            </button>
          </div>
          {showModal && <AddExercise onClose={() => setShowModal(false)} />}
          <ExerciseSelection />
        </div>
      </div>
    </div>
  );
}
