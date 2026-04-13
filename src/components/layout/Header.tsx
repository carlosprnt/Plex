import styles from './Header.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <div className={styles.brand}>
          <span className={styles.logo}>&#127758;</span>
          <div>
            <h1 className={styles.title}>La Vuelta al Mundo</h1>
            <p className={styles.subtitle}>YoSoyPlex</p>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue}>3</span>
            <span className={styles.statLabel}>Temporadas</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>52</span>
            <span className={styles.statLabel}>Países</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>245</span>
            <span className={styles.statLabel}>Días</span>
          </div>
        </div>
      </div>
    </header>
  );
}
