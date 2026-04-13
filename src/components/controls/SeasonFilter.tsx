import { seasons } from '../../data/worldTourData';
import styles from './SeasonFilter.module.css';

interface SeasonFilterProps {
  activeSeasons: Set<number>;
  onChange: (seasons: Set<number>) => void;
}

export default function SeasonFilter({ activeSeasons, onChange }: SeasonFilterProps) {
  const toggle = (id: number) => {
    const next = new Set(activeSeasons);
    if (next.has(id)) {
      if (next.size > 1) next.delete(id);
    } else {
      next.add(id);
    }
    onChange(next);
  };

  return (
    <div className={styles.container}>
      {seasons.map((s) => {
        const active = activeSeasons.has(s.id);
        return (
          <button
            key={s.id}
            className={`${styles.button} ${active ? styles.active : ''}`}
            onClick={() => toggle(s.id)}
            aria-pressed={active}
            style={{
              '--season-color': s.color,
              '--season-glow': s.glowColor,
            } as React.CSSProperties}
          >
            <span className={styles.dot} />
            <span className={styles.label}>T{s.id}</span>
            <span className={styles.year}>{s.year}</span>
            {s.status === 'ongoing' && <span className={styles.badge}>EN CURSO</span>}
          </button>
        );
      })}
    </div>
  );
}
