import Link from 'next/link';
import styles from '../styles/Header.module.scss';

export default function Header() {
  return (
    <header className={styles.nav}>
      <div><strong>WP Developer</strong></div>
      <nav>
        <Link href="/">Home</Link>
        <Link href="/about">About</Link>
        <Link href="/contact">Contact</Link>
        <Link href="/blog">Blog</Link>
      </nav>
    </header>
  );
}
