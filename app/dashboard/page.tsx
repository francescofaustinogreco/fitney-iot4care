"use client";

import WorkoutFormModal from "./clientWorkoutCard";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import SignOutUser from "./signOut";
import AddClient from "./addClient";
import ClientSelection from "./ClientSelection";

export default function Dashboard(){
    const [showModal, setShowModal] = useState(false);

    const router = useRouter();
    
    useEffect(() => {
        const unsub = onAuthStateChanged(auth, (user) => {
            if(!user){
                router.push("/login");
            }
        })

        return () => unsub(); // Pulisco il listener
    }, [router]);

    return(
        <div className="p-4">
            <h1 className="text-xl font-bold">
                Dasboard
            </h1>

            <div>
                <button onClick={() => setShowModal(true)}>Crea Scheda</button>
                
                {showModal && (
                    <WorkoutFormModal onClose={() => setShowModal(false)} />
                )}
            </div>

            <div>
                <button onClick={() => setShowModal(true)}>Aggiungi Cliente</button>

                {showModal && (
                    <AddClient onClose={() => setShowModal(false)} />
                )}
            </div>

            <ClientSelection />
            
            <SignOutUser />
        </div>
    );
}