"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome = pathname === "/";
  const isAbout = pathname === "/about";

  return (
    <nav className="fixed top-4 right-3 flex gap-6 z-50">

      {!isHome && (
        <button onClick={() => router.push("/")} className={styles.navLink}>
          Accueil
        </button>
      )}

      {!isAbout && (
        <button onClick={() => router.push("/about")} className={styles.navLink}>
          À propos
        </button>
      )}

    </nav>
  );
}
