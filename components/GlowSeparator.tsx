import styles from "./GlowSeparator.module.css";

interface Props {
  vertical?: boolean;
}

export default function GlowSeparator({ vertical }: Props) {
  if (vertical) {
    return (
      <div className={styles.verticalWrapper} aria-hidden="true">
        <div className={`${styles.separator} ${styles.rotated}`} />
      </div>
    );
  }
  return <div className={`${styles.separator} relative w-full h-1`} aria-hidden="true" />;
}
