interface AdminCardProps {
  title: string;
  muted?: boolean;
  right?: React.ReactNode;
  body?: boolean;        // wraps children in adm-card-body padding
  children: React.ReactNode;
}

export default function AdminCard({ title, muted, right, body, children }: AdminCardProps) {
  return (
    <section className="adm-card">
      <div className="adm-card-head">
        <h2>
          <span className="hairline" />
          <span className={muted ? 'adm-title-muted' : ''}>{title}</span>
        </h2>
        {right}
      </div>
      {body ? <div className="adm-card-body">{children}</div> : children}
    </section>
  );
}
