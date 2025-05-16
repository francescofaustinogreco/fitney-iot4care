import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase";

type clientFormModal = {
    onClose: () => void;
}

export default function AddClient({onClose}: clientFormModal){
    const [nome, setNome] = useState("");
    const [cognome, setCognome] = useState("");
    const [età, setEtà] = useState("");
    const [limitazioni, setLimitazioni] = useState(false);

    const addClientLogic = async () => {
        try{
            await addDoc(collection(db, "clients"),{
                nome,
                cognome,
                età: Number(età),
                limitazioni,
            });
            onClose();
        }catch(e: any){
            console.log(e.message);
        }
    }

    return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4">Aggiungi Cliente</h2>

        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          placeholder="Cognome"
          value={cognome}
          onChange={(e) => setCognome(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <input
          type="text"
          placeholder="Età"
          value={età}
          onChange={(e) => setEtà(e.target.value)}
          className="border p-2 mb-2 w-full"
        />

        <label className="flex items-center mb-4">
          <input
            type="checkbox"
            checked={limitazioni}
            onChange={(e) => setLimitazioni(e.target.checked)}
            className="mr-2"
          />
          Limitazioni fisiche?
        </label>

        <div className="flex justify-between">
          <button onClick={onClose} className="text-gray-500">
            Annulla
          </button>
          <button
            onClick={addClientLogic}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Salva Cliente
          </button>
        </div>
      </div>
    </div>
  );
}