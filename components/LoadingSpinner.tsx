import styles from "./LoadingSpinner.module.css";

export default function LoadingSpinner() {
  return (
    <div className={`${styles.screen} fixed-overlay flex items-center justify-center`}>
      <div className={styles.spinner} />
    </div>
  );
}
