import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={`${styles.footer} h-12 flex justify-center items-center`}>
      <span>© 2026 Lucas Luisetti</span>
    </footer>
  );
}
