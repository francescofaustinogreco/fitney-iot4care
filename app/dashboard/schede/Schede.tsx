"use client";

import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import { getUserName } from "../../lib/getUserName";
import Sidebar from "../../components/Sidebar";
import AddSchedule from "./AddSchedule"; // Modale corretta
import SchedeSelection from "./SchedeSelection";
import { Plus } from "lucide-react";

export default function Schede() {
  const [nome, setNome] = useState("");
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);

  const router = useRouter();

  // Redirect se non autenticato
  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/login");
      }
    });

    return () => unsub();
  }, [router]);

  // Recupero nome utente
  useEffect(() => {
    getUserName()
      .then((userName) => setNome(userName))
      .catch((error) => {
        console.error("Errore nel recupero del nome:", error);
        setNome("");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="">
      <Sidebar />
      <div className="ml-[20%] w-full p-12">
        {/* Header con benvenuto */}
        <div className="w-3/4 border-b border-secondary-100 pb-4">
          <span className="text-[70px]">💪</span>
          <h1 className="text-4xl font-bold mt-6">
            Ciao{nome ? `, ${nome}` : ""}! 👋
          </h1>
          {loading ? (
            <p>Caricamento...</p>
          ) : (
            <p className="my-2">
              Benvenuto in Fitney, qui puoi gestire le schede dei tuoi clienti.
            </p>
          )}
        </div>

        <div className="mt-10 w-3/4">
          <div className="flex w-full justify-between items-center border-b border-secondary-100 pb-2">
            <h3 className="text-xl font-semibold">Visualizzazione Schede</h3>
            <button
              onClick={() => setShowModal(true)}
              className="bg-primary-500 font-semibold rounded-sm text-white text-lg px-4 py-2 cursor-pointer hover:bg-primary-600 transition flex items-center"
            >
              Add <Plus className="ml-2" />
            </button>
          </div>

          {/* Modale per Aggiunta Scheda */}
          {showModal && <AddSchedule onClose={() => setShowModal(false)} />}

          {/* Lista Schede */}
          <SchedeSelection />
        </div>
      </div>
    </div>
  );
}
