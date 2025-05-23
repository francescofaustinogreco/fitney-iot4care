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
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    nome: "",
    cognome: "",
    età: 0,
    limitazioni: false,
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const auth = getAuth();
        const user = auth.currentUser;

        if (!user) {
          console.warn("Utente non loggato.");
          return;
        }

        // Query per prendere solo i clienti di questo trainer
        const q = query(collection(db, "clients"), where("trainerId", "==", user.uid));
        const querySnapshot = await getDocs(q);

        const clientsArray = querySnapshot.docs.map((doc) => {
          const data = doc.data() as Omit<Client, "id">;
          return {
            id: doc.id,
            ...data,
          };
        });

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

  const handleEditClick = (client: Client) => {
    setEditingClient(client);
    setFormData({
      nome: client.nome,
      cognome: client.cognome,
      età: client.età,
      limitazioni: client.limitazioni ?? false,
    });
    setModalOpen(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSave = async () => {
    if (!editingClient) return;

    try {
      const docRef = doc(db, "clients", editingClient.id);
      await updateDoc(docRef, {
        nome: formData.nome,
        cognome: formData.cognome,
        età: Number(formData.età),
        limitazioni: formData.limitazioni,
      });

      setClients((prev) =>
        prev.map((client) =>
          client.id === editingClient.id
            ? { ...client, ...formData, età: Number(formData.età) }
            : client
        )
      );

      setModalOpen(false);
      setEditingClient(null);
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
            <th className="px-6 py-3 text-left text-sm font-bold">Cognome</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Età</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Limitazioni</th>
            <th className="px-6 py-3 text-left text-sm font-bold">Azioni</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-secondary-200">
          {clients.map((client) => (
            <tr key={client.id} className="hover:bg-secondary-50 transition">
              <td className="px-6 py-4 text-sm">{client.nome}</td>
              <td className="px-6 py-4 text-sm">{client.cognome}</td>
              <td className="px-6 py-4 text-sm">{client.età}</td>
              <td className="px-6 py-4 text-sm">{client.limitazioni ? "SI" : "NO"}</td>
              <td className="px-6 py-4 text-sm flex gap-2">
                <button
                  onClick={() => handleEditClick(client)}
                  className="hover:text-secondary-700 cursor-pointer"
                >
                  <Pencil className="w-5 h-5" />
                </button>
                <button
                  onClick={() => handleDelete(client.id)}
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
                setEditingClient(null);
              }}
              className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-800 cursor-pointer"
              aria-label="Chiudi"
            >
              <X size={20} />
            </button>

            <h2 className="text-3xl font-semibold mb-6 text-center">Modifica Cliente</h2>

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
                name="cognome"
                value={formData.cognome}
                onChange={handleFormChange}
                placeholder="Cognome"
                required
              />
              <Input
                type="number"
                name="età"
                value={formData.età}
                onChange={handleFormChange}
                placeholder="Età"
                required
              />

              <label className="flex items-center space-x-2 text-sm">
                <input
                  type="checkbox"
                  name="limitazioni"
                  checked={formData.limitazioni}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      limitazioni: e.target.checked,
                    }))
                  }
                  className="accent-primary-500"
                />
                <span>Limitazioni fisiche?</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={() => {
                  setModalOpen(false);
                  setEditingClient(null);
                }}
                className="px-4 py-2 bg-gray-200 rounded-sm hover:bg-gray-300 text-base font-semibold transition cursor-pointer"
              >
                Annulla
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-primary-500 text-white rounded-sm hover:bg-primary-600 text-base font-semibold transition"
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
