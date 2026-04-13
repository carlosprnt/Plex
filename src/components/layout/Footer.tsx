import { teamMembers } from '../../data/worldTourData';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <div className={styles.team}>
          <span className={styles.teamLabel}>Equipo:</span>
          {teamMembers.map((m) => (
            <span key={m.name} className={styles.member}>
              {m.name}
              <span className={styles.memberRole}>{m.role}</span>
            </span>
          ))}
        </div>
        <p className={styles.credit}>
          Fan project &middot; Data may be incomplete &middot; Check{' '}
          <a
            href="https://www.youtube.com/@YoSoyPlex"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.link}
          >
            @YoSoyPlex
          </a>{' '}
          on YouTube
        </p>
      </div>
    </footer>
  );
}
