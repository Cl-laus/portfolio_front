import styles from "./GlowSeparator.module.css";

export default function GlowSeparator() {
  return <div className={`${styles.separator} relative w-full h-1.5`} aria-hidden="true" />;
}
