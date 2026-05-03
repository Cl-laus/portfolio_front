"use client";

import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  return (
    <nav className="fixed top-4 right-3 flex gap-6 z-50">

      {/* HOME BUTTON */}
      {!isHome && (
        <button
          onClick={() => router.push("/")}
          className="nav-link"
        >
          Accueil
        </button>
      )}

      {/* ABOUT BUTTON */}
      {!isAbout && (
        <button
          className="nav-link"
          onClick={() => router.push("/about")}
        >
          À propos
        </button>
      )}

    </nav>
  );
}
