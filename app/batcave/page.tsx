"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { authService } from "@/services/authService";
import LoadingSpinner from "@/components/LoadingSpinner";
import styles from "./page.module.css";

export default function BatcavePage() {
  const [isAuth,    setIsAuth]   = useState<boolean | null>(null);
  const [username,  setUsername] = useState("");
  const [password,  setPassword] = useState("");
  const [loading,   setLoading]  = useState(false);
  const [error,     setError]    = useState("");
  const router = useRouter();

  useEffect(() => {
    const authenticated = authService.isAuthenticated();
    setIsAuth(authenticated);
    if (authenticated) router.push("/batcave/projects");
  }, []);

  async function handleLogin() {
    setError("");
    setLoading(true);
    try {
      await authService.login(username, password);
      router.push("/batcave/projects");
    } catch {
      setError("Identifiants incorrects.");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  if (isAuth === null || isAuth === true) {
    return (
      <LoadingSpinner />
    );
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        <div className={styles.crumb}>
          <span className={styles.dash} />
          <span>Batcave</span>
        </div>
        <p className={styles.subtitle}>Administration du portfolio</p>

        <div className="adm-field">
          <label className="adm-field-label" htmlFor="username">Identifiant</label>
          <input
            className="adm-input"
            id="username"
            type="text"
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="username"
            placeholder="Votre identifiant"
          />
        </div>

        <div className="adm-field">
          <label className="adm-field-label" htmlFor="password">Mot de passe</label>
          <input
            className="adm-input"
            id="password"
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            onKeyDown={handleKeyDown}
            autoComplete="current-password"
            placeholder="••••••••"
          />
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <button
          className={`adm-btn adm-btn-amber ${styles.submit}`}
          onClick={handleLogin}
          disabled={loading || !username || !password}
        >
          {loading ? "Connexion…" : "Connexion"}
        </button>

      </div>
    </div>
  );
}
