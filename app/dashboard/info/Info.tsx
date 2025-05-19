"use client";

import { useEffect, useState } from "react";
import { auth, db } from "@/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import Sidebar from "../../components/Sidebar";

export default function Schede() {
  const [userInfo, setUserInfo] = useState<{ name?: string; surname?: string; email?: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setUserInfo(null);
        setLoading(false);
        return;
      }

      try {
        const userDocRef = doc(db, "users", user.uid, "users-fitney", "profile");
        const userDocSnap = await getDoc(userDocRef);

        if (userDocSnap.exists()) {
          const data = userDocSnap.data();
          setUserInfo({
            name: data.name,
            surname: data.surname,
            email: user.email || "",
          });
        } else {
          // Documento non trovato
          setUserInfo({
            email: user.email || "",
          });
        }
      } catch (error) {
        console.error("Errore nel recupero dati:", error);
        setUserInfo({
          email: user.email || "",
        });
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) return <div className="ml-[20%] w-[80%] h-screen p-12 flex justify-center items-center">Caricamento...</div>;

  if (!userInfo)
    return (
      <div className="ml-[20%] w-[80%] h-screen p-12 flex justify-center items-center">
        <div>Utente non autenticato. Effettua il login.</div>
      </div>
    );

  return (
    <div>
      <Sidebar />
      <div className="ml-[20%] w-[80%] h-screen p-12 flex justify-center items-center">
        <div className="bg-secondary-50 p-8 rounded-md">
          <h1 className="text-xl font-semibold">Informazioni del tuo account:</h1>
          <ul className="mt-2 text-lg">
            <li className="mt-2">Nome: {userInfo.name || "Non disponibile"}</li>
            <li className="mt-2">Cognome: {userInfo.surname || "Non disponibile"}</li>
            <li className="mt-2">Email: {userInfo.email}</li>
            <li className="mt-2">
              Status: <span className="bg-green-200 p-1 text-green-950 font-semibold">ACTIVE</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
