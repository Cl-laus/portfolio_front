import styles from "./TechChip.module.css";

interface TechChipProps {
  name: string;
}

export default function TechChip({ name }: TechChipProps) {
  return <span className={styles.chip}>{name}</span>;
}
