interface AdminFieldProps {
  label: string;
  htmlFor: string;
  hint?: string;
  children: React.ReactNode;
}

export default function AdminField({ label, htmlFor, hint, children }: AdminFieldProps) {
  return (
    <div className="adm-field">
      <label className="adm-field-label" htmlFor={htmlFor}>
        {label}
        {hint && <span className="adm-field-hint"> {hint}</span>}
      </label>
      {children}
    </div>
  );
}
