"use client";

import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function RegisterPage(){
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [error, setError] = useState<string | null>("");
    const router = useRouter();

    const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault() // nessun evento
        try{
            await createUserWithEmailAndPassword(auth, email, password);
            router.push("/dashboard");
        }catch(err: any){
            setError(err.message);
        }
    };

    return(
        <div className="flex flex-col items-center justify-center min-h screen p-4">
            <form onSubmit={handleRegister}
                className="w-full max-w-sm space-y-4"
            >
                <input type="email" 
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full p-2 border border-gray-300 rounded-xl"
                    required
                />

                <input type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full p-2 border border-gray-300 rounded-xl"
                    required
                />

                <button 
                    type="submit"
                    className="w-full p-2 bg-green-600 text-white rounded hover:bg-green-700 transition rounded-xl cursor-pointer"
                >
                    Register
                </button>
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </div>
    );
}