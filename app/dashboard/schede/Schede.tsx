"use client";

import { useEffect, useState } from "react";
import { getUserName } from "../../lib/getUserName";
import Sidebar from "../../components/Sidebar";
import WorkoutFormModal from "../schede/clientWorkoutCard";
import { onAuthStateChanged } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";

export default function Schede() {
  const [nome, setName] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getUserName()
      .then((userName) => setName(userName))
      .catch((error) => {
        console.error("Errore nel recupero del nome:", error);
        setName("");
      })
      .finally(() => setLoading(false));
  }, []);

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
      <div className="ml-[20%] w-full h-screen p-12">
        <h1 className="text-4xl font-bold mb-2">
          Ciao{nome ? `, ${nome}` : ""}! 👋
        </h1>
        {loading ? <p>Caricamento...</p> : <p>Benvenuto in Fitney</p>}

        <div>
          <button onClick={() => setShowModal(true)}>Crea Scheda</button>

          {showModal && (
            <WorkoutFormModal onClose={() => setShowModal(false)} />
          )}
        </div>
      </div>
    </div>
  );
}
