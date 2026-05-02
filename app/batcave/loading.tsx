'use client';

export default function LoadingPage() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-background/50 z-50">
      <svg
        className="animate-spin h-8 w-8 mr-2 text-muted-foreground"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
      </svg>
      <span className="text-base text-muted-foreground">Chargement de l’admin…</span>
    </div>
  );
}