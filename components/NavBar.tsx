"use client";

import { usePathname, useRouter } from "next/navigation";
import styles from "./NavBar.module.css";

export default function NavBar() {
  const pathname = usePathname();
  const router = useRouter();

  const isHome    = pathname === "/";
  const isAbout   = pathname === "/about";
  const isBatcave = pathname.startsWith("/batcave");

  if (isBatcave) return null;

  return (
    <nav className="fixed top-4 right-4 flex gap-3 z-50 px-4 py-2 rounded-full backdrop-blur-sm" style={{ background: 'rgba(157,158,161,0.45)' }}>

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
