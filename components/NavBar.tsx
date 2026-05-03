"use client";

import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  return (
    <nav className="fixed top-6 right-6 flex gap-6 z-50">

      {/* HOME BUTTON */}
      {!isHome && (
        <button
          onClick={() => router.push("/")}
          className="about-link inline-flex items-center p-0"
        >
          Home
        </button>
      )}

      {/* ABOUT BUTTON */}
      {!isAbout && (
        <button
          className="about-link inline-flex items-center p-0"
          onClick={() => router.push("/about")}
        >
          À propos
        </button>
      )}

    </nav>
  );
}
