"use client";

import Sidebar from "../../components/Sidebar";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import AddClient from "./addClient";
import ClientSelection from "./ClientSelection";

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
          <span className="text-[70px]">👤</span>
          <h1 className="text-4xl font-bold mt-6">Clienti</h1>
          <p className="my-2">
            Pagina dedicata all'inserimento ed alla visualizzazione dei propri
            clienti.
          </p>
        </div>

        <div className="mt-10 w-3/4">
          <div className="flex w-full justify-between items-center">
            <h3>Visualizzazione Clienti</h3>
            <button onClick={() => setShowModal(true)} className="bg-primary-400">
              Aggiungi Cliente
            </button>
          </div>
          {showModal && <AddClient onClose={() => setShowModal(false)} />}
          <ClientSelection />
        </div>
      </div>
    </div>
  );
}
