import styles from "./TechChip.module.css";

interface TechChipProps {
  name: string;
}

export default function TechChip({ name }: TechChipProps) {
  return <span className={`${styles.chip} inline-flex items-center px-3.5 py-1.5 whitespace-nowrap`}>{name}</span>;
}
