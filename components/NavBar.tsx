"use client";

import { usePathname, useRouter } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";
  const isProject = pathname.startsWith("/projects/");

  return (
    <nav className="fixed top-6 right-6 flex gap-6 text-sm text-white z-50">

      {/* HOME BUTTON */}
      {!isHome && (
        <button
          onClick={() => router.push("/")}
          className="opacity-80 hover:opacity-100 transition"
        >
          Home
        </button>
      )}

      {/* ABOUT BUTTON */}
      {!isAbout && (
        <button
          onClick={() => router.push("/about")}
          className="opacity-80 hover:opacity-100 transition"
        >
          About
        </button>
      )}

    </nav>
  );
}