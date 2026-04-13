import type { ViewMode } from '../../types';
import styles from './ViewToggle.module.css';

interface ViewToggleProps {
  viewMode: ViewMode;
  onChange: (mode: ViewMode) => void;
}

export default function ViewToggle({ viewMode, onChange }: ViewToggleProps) {
  return (
    <div className={styles.container}>
      <button
        className={`${styles.button} ${viewMode === 'globe' ? styles.active : ''}`}
        onClick={() => onChange('globe')}
        aria-pressed={viewMode === 'globe'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20" />
          <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
        Globo
      </button>
      <button
        className={`${styles.button} ${viewMode === 'list' ? styles.active : ''}`}
        onClick={() => onChange('list')}
        aria-pressed={viewMode === 'list'}
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="8" y1="6" x2="21" y2="6" />
          <line x1="8" y1="12" x2="21" y2="12" />
          <line x1="8" y1="18" x2="21" y2="18" />
          <line x1="3" y1="6" x2="3.01" y2="6" />
          <line x1="3" y1="12" x2="3.01" y2="12" />
          <line x1="3" y1="18" x2="3.01" y2="18" />
        </svg>
        Lista
      </button>
      <div
        className={styles.slider}
        style={{ transform: viewMode === 'list' ? 'translateX(100%)' : 'translateX(0)' }}
      />
    </div>
  );
}
