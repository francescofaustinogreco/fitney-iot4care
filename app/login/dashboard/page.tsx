
import { useState } from "react"; // FINISCO DOPO

export default function DashboardPage(){

    // DATI ANAGRAFICI
    const [nome, setNome] = useState<string>("");
    const [anni, setAnni] = useState<any>("");
    const [altezza, setAltezza] = useState<any>("");

    const [error, setError] = useState<string | null>("");
    

    const handleNewUser = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        try{
            // CREO UN NUOVO UTENTE DEL PERSONAL TRAINER CON I SUOI DATI ANAGRAFICI
         //   await createNewUser(nome,anni,altezza);
        }catch(err:any){
            setError(err.message);
        }
    };
}