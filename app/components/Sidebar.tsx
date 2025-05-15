'use client';

import Image from "next/image";
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import SignOutUser from "../dashboard/signOut";

export default function Sidebar() {
  const pathname = usePathname();

  const links = [
    { href: "/dashboard/schede", icon: "bx-folder-open ", label: "Schede" },
    { href: "/dashboard/clienti", icon: "bx-user", label: "Clienti" },
    { href: "/dashboard/esercizi", icon: "bx-dumbbell", label: "Esercizi" },
    { href: "/dashboard/info", icon: "bx-info-circle", label: "Informazioni" },
  ];

  return (
    <aside className="w-1/5 flex flex-col justify-between h-screen fixed left-0 top-0 bg-secondary-50 p-4">
      <div>
        <Image
          src="/logo.svg"
          width={70}
          height={70}
          alt="logo"
          className="m-auto"
        />
        <ul className="mt-8">
          {links.map(({ href, icon, label }) => {
            const isActive = pathname === href;

            return (
              <li key={href} className="mt-1">
                <Link
                  href={href}
                  className={`p-2 rounded-md font-medium flex items-center cursor-pointer transition duration-150 ${
                    isActive ? 'bg-primary-500 text-white font-semibold' : 'text-black hover:bg-secondary-100'
                  }`}
                >
                  <i className={`bx ${icon} mr-2`}></i> {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="w-full">
        <SignOutUser />
      </div>
    </aside>
  );
}
