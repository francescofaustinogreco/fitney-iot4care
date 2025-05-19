"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "@/firebase";
import { doc, setDoc } from "firebase/firestore";
import Image from "next/image";
import Link from "next/link";
import Input from "../ui/input";
import Button from "../ui/button";

export default function RegisterPage() {
  const [name, setName] = useState<string>("");
  const [surname, setSurname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      // 1. Crea l'utente in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // 2. Salva name e surname nel DB in /users/{uid}/users-fitney/profile
      const profileDocRef = doc(db, "users", user.uid, "users-fitney", "profile");
      await setDoc(profileDocRef, {
        name,
        surname,
        createdAt: new Date(),
      });

      router.push("/login");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="border-4 border-primary-500 px-6 py-10 rounded-sm">
        <div className="mb-6">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt="logo register"
            className="mb-6 m-auto"
          />
          <h1 className="text-5xl font-semibold">Registrati</h1>
          <span>Hai già un account? </span>
          <Link href="/login" className="underline text-primary-500 font-bold">
            Accedi
          </Link>
        </div>
        <form onSubmit={handleRegister} className="w-full max-w-sm space-y-2">
          <div className="flex gap-2">
            <Input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nome"
              className="w-1/2 placeholder-secondary-100"
              required
            />
            <Input
              type="text"
              value={surname}
              onChange={(e) => setSurname(e.target.value)}
              placeholder="Cognome"
              className="w-1/2 placeholder-secondary-100"
              required
            />
          </div>
          <Input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="placeholder-secondary-100"
            required
          />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="placeholder-secondary-100"
            required
          />
          {error && <p className="text-red-500 mt-1">{error}</p>}
          <Button type="submit" className="mt-4">
            Registrati
          </Button>
        </form>
      </div>
    </div>
  );
}
