"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../../firebase";
import Input from "../../ui/input";
import Button from "../../ui/button";
import { X } from "lucide-react";


type ClientFormModalProps = {
  onClose: () => void;
};

export default function AddClient({ onClose }: ClientFormModalProps) {
  const [nome, setNome] = useState("");
  const [cognome, setCognome] = useState("");
  const [età, setEtà] = useState("");
  const [limitazioni, setLimitazioni] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addClientLogic = async () => {
    try {
      await addDoc(collection(db, "clients"), {
        nome,
        cognome,
        età: Number(età),
        limitazioni,
      });
      onClose();
    } catch (e: any) {
      setError("Errore durante il salvataggio: " + e.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-secondary-800/30 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="relative bg-white px-6 py-10 border-4 border-primary-500 rounded-sm max-w-sm w-full">
        {/* X in alto a destra */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-secondary-500 hover:text-secondary-800 cursor-pointer"
          aria-label="Chiudi"
        >
          <X size={20} />{" "}
        </button>

        <h2 className="text-3xl font-semibold mb-6 text-center">
          Aggiungi Cliente
        </h2>

        <div className="space-y-3">
          <Input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            placeholder="Nome"
            required
          />
          <Input
            type="text"
            value={cognome}
            onChange={(e) => setCognome(e.target.value)}
            placeholder="Cognome"
            required
          />
          <Input
            type="number"
            value={età}
            onChange={(e) => setEtà(e.target.value)}
            placeholder="Età"
            required
          />

          <label className="flex items-center space-x-2 text-sm">
            <input
              type="checkbox"
              checked={limitazioni}
              onChange={(e) => setLimitazioni(e.target.checked)}
              className="accent-primary-500"
            />
            <span>Limitazioni fisiche?</span>
          </label>

          {error && <p className="text-red-500 text-sm">{error}</p>}
        </div>

        <div className="mt-6 flex justify-end">
          <Button onClick={addClientLogic}>Salva Cliente</Button>
        </div>
      </div>
    </div>
  );
}
