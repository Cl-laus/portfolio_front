'use client';

import Link from 'next/link';
import styles from './not-found.module.css';

export default function NotFound() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6 text-center p-8">
      <span className={styles.code}>404</span>

      <h1 className={styles.title}>Page introuvable.</h1>

      <p className={styles.desc}>Cette page n&apos;existe pas.</p>

      <Link href="/" className={`${styles.backLink} inline-flex items-center gap-2 mt-4`}>
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
