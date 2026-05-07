interface AdminCardProps {
  title: string;
  muted?: boolean;
  right?: React.ReactNode;
  children: React.ReactNode;
}

export default function AdminCard({ title, muted, right, children }: AdminCardProps) {
  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2>
          <span className="hairline" />
          <span className={muted ? 'adm-title-muted' : ''}>{title}</span>
        </h2>
        {right}
      </div>
      {children}
    </section>
  );
}
