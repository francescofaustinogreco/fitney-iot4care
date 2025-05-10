"use client";

import TrainerForm from "./clientCard";
import { onAuthStateChanged } from "firebase/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { auth } from "@/firebase";
import SignOutUser from "./signOut";

export default function Dashboard(){
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
            <TrainerForm />

            <SignOutUser />
        </div>
    );
}