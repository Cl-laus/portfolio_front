import styles from "./CircleButton.module.css";

interface CircleButtonProps {
  icon: React.ReactNode;
  size?: "lg";
  className?: string;
  onClick?: () => void;
  href?: string;
}

export default function CircleButton({ icon, size, className = "", onClick, href }: CircleButtonProps) {
  const cls = [
    styles.btn,
    "inline-flex items-center justify-center",
    size === "lg" ? `${styles.lg} w-24 h-24` : "w-10 h-10",
    className,
  ].filter(Boolean).join(" ");

  if (href) {
    return (
      <a className={cls} href={href} target="_blank" rel="noopener noreferrer">
        {icon}
      </a>
    );
  }

  return (
    <button className={cls} type="button" onClick={onClick}>
      {icon}
    </button>
  );
}
