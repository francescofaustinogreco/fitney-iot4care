"use client";

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";



export default function SignOutUser(){
    const router = useRouter();
    
    const handleSignOut = async () => {
        try{
            await signOut(auth);
            router.push("/login")
        }catch(err: any){
            console.log(err.message);
        }
    }

    return(
        <button onClick={handleSignOut} className="bg-white-300 text-yellow">
            Sign-Out
        </button>
    );
}