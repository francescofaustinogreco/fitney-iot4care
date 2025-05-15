"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/firebase";
import Image from "next/image";
import Link from "next/link";
import Input from "../ui/input";
import Button from "../ui/button";

export default function LoginPage() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className=" border-4 border-primary-500 px-6 py-10 rounded-sm">
        <div className="mb-6">
          <Image
            src="/logo.svg"
            width={100}
            height={100}
            alt="logo login"
            className="mb-6 m-auto"
          />
          <h1 className="text-5xl font-semibold">Accedi</h1>
          <span>Non sei registrato? </span>
          <Link
            href="/register"
            className="underline text-primary-500 font-bold"
          >
            Registrati
          </Link>
        </div>
        <form onSubmit={handleLogin} className="w-full max-w-sm">
          <div>
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-2 placeholder-secondary-100"
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
          </div>
          <Button type="submit" className="mt-6">
            Login
          </Button>
        </form>
      </div>
    </div>
  );
}