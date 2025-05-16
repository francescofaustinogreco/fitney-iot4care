import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/firebase";

type Client = {
    id: string;
    [key: string]: any;
};

export default function ClientSelection(){
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "clients"));
        const clientsArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        console.log(clientsArray);
        setClients(clientsArray);
      } catch (error) {
        console.error("Errore nel recupero dei clienti:", error);
      }
    };

    fetchClients();
  }, []);


    return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">Seleziona Paziente</h2>
      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.nome} {client.cognome} (età: {client.età})
          </li>
        ))}
      </ul>
    </div>
  );
}