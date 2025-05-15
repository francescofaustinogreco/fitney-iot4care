"use client";

import { auth } from "@/firebase";
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import Button from "../ui/Button";



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
        <Button onClick={handleSignOut} className="">
            Sign-Out
        </Button>
    );
}