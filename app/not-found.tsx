'use client';

import Link from 'next/link';

export default function NotFound() {
  return (
    <main style={{
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '1.5rem',
      textAlign: 'center',
      padding: '2rem',
    }}>
      <span style={{
        fontSize: '0.75rem',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--amber-bright)',
        fontFamily: 'var(--font-geist-mono), monospace',
      }}>
        404
      </span>

      <h1 style={{
        fontSize: '3rem',
        fontWeight: 500,
        color: 'var(--fg)',
        letterSpacing: '-0.025em',
        lineHeight: 1.1,
      }}>
        Page introuvable.
      </h1>

      <p style={{ color: 'var(--fg-muted)', fontSize: '1rem', maxWidth: '28rem' }}>
        Ce projet n&apos;existe pas ou n&apos;est plus disponible.
      </p>

      <Link href="/" style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginTop: '1rem',
        fontSize: '0.75rem',
        letterSpacing: '0.32em',
        textTransform: 'uppercase',
        color: 'var(--fg-muted)',
        transition: 'color .35s ease',
      }}
        onMouseEnter={e => (e.currentTarget.style.color = 'var(--amber-bright)')}
        onMouseLeave={e => (e.currentTarget.style.color = 'var(--fg-muted)')}
      >
        ← Retour à l&apos;accueil
      </Link>
    </main>
  );
}
