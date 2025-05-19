"use client";

import { useEffect, useState } from "react";
import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "@/firebase";
import { Trash } from "lucide-react";
import { getAuth } from "firebase/auth";

type Client = {
  id: string;
  nome: string;
  cognome: string;
  età: number;
  trainerId: string; 
  limitazioni?: boolean;
};

export default function ClientSelection() {
  const [clients, setClients] = useState<Client[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Utente non loggato.");
          return;
        }

        const querySnapshot = await getDocs(collection(db, "clients"));

        const clientsArray = querySnapshot.docs
          .map((doc) => {
            const data = doc.data() as Omit<Client, "id">;
            return {
              id: doc.id,
              ...data,
            };
          })
          .filter((client) => client.trainerId === user.uid); 

        setClients(clientsArray);
      } catch (error) {
        console.error("Errore nel recupero dei clienti:", error);
      }
    };

    fetchClients();
  }, []);

  const handleDelete = async (id: string) => {
    const confirmDelete = confirm("Sei sicuro di voler eliminare questo cliente?");
    if (!confirmDelete) return;

    try {
      await deleteDoc(doc(db, "clients", id));
      setClients((prev) => prev.filter((client) => client.id !== id));
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
            <th className="px-6 py-3 text-left text-sm font-bold">Cognome</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Età</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-secondary-50 transition">
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.nome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.cognome}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {client.età}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                <button
                  onClick={() => handleDelete(client.id)}
                  className="hover:text-secondary-800 transition cursor-pointer"
                  aria-label="Elimina cliente"
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
