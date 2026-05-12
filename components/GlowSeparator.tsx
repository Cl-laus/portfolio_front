import styles from "./GlowSeparator.module.css";

interface Props {
  vertical?: boolean;
}

export default function GlowSeparator({ vertical }: Props) {
  if (vertical) {
    return <div className={`${styles.separatorV} relative w-1 h-screen flex-shrink-0`} aria-hidden="true" />;
  }
  return <div className={`${styles.separator} relative w-full h-1`} aria-hidden="true" />;
}
