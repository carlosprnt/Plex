import { seasons } from '../../data/worldTourData';
import type { Country } from '../../types';
import CountryCard from './CountryCard';
import styles from './ListView.module.css';

interface ListViewProps {
  activeSeasons: Set<number>;
  onCountrySelect: (country: Country) => void;
}

export default function ListView({ activeSeasons, onCountrySelect }: ListViewProps) {
  const visibleSeasons = seasons.filter((s) => activeSeasons.has(s.id));

  return (
    <div className={styles.container}>
      {visibleSeasons.map((season) => (
        <section key={season.id} className={styles.section}>
          <div className={styles.sectionHeader}>
            <div
              className={styles.seasonLine}
              style={{ background: season.color }}
            />
            <div className={styles.sectionInfo}>
              <h2 className={styles.sectionTitle}>{season.title}</h2>
              <p className={styles.sectionMeta}>
                {season.year} &middot; {season.totalDays} días &middot;{' '}
                {season.countries.length} países
                {season.status === 'ongoing' && (
                  <span
                    className={styles.ongoingBadge}
                    style={{ background: season.color }}
                  >
                    EN CURSO
                  </span>
                )}
              </p>
            </div>
          </div>
          <div className={styles.grid}>
            {season.countries.map((country, i) => (
              <CountryCard
                key={country.id}
                country={country}
                index={i}
                onClick={onCountrySelect}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
