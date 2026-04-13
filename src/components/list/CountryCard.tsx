import { motion } from 'framer-motion';
import type { Country } from '../../types';
import { getSeasonColor } from '../../data/worldTourData';
import styles from './CountryCard.module.css';

const FLAG_EMOJI: Record<string, string> = {
  MA: '\u{1F1F2}\u{1F1E6}', MG: '\u{1F1F2}\u{1F1EC}', JO: '\u{1F1EF}\u{1F1F4}',
  MV: '\u{1F1F2}\u{1F1FB}', IN: '\u{1F1EE}\u{1F1F3}', NP: '\u{1F1F3}\u{1F1F5}',
  TH: '\u{1F1F9}\u{1F1ED}', VN: '\u{1F1FB}\u{1F1F3}', KH: '\u{1F1F0}\u{1F1ED}',
  ID: '\u{1F1EE}\u{1F1E9}', MY: '\u{1F1F2}\u{1F1FE}', PH: '\u{1F1F5}\u{1F1ED}',
  CN: '\u{1F1E8}\u{1F1F3}', JP: '\u{1F1EF}\u{1F1F5}', KR: '\u{1F1F0}\u{1F1F7}',
  AE: '\u{1F1E6}\u{1F1EA}', ES: '\u{1F1EA}\u{1F1F8}', US: '\u{1F1FA}\u{1F1F8}',
  MX: '\u{1F1F2}\u{1F1FD}', GT: '\u{1F1EC}\u{1F1F9}', CR: '\u{1F1E8}\u{1F1F7}',
  CU: '\u{1F1E8}\u{1F1FA}', CO: '\u{1F1E8}\u{1F1F4}', PE: '\u{1F1F5}\u{1F1EA}',
  BO: '\u{1F1E7}\u{1F1F4}', CL: '\u{1F1E8}\u{1F1F1}', AR: '\u{1F1E6}\u{1F1F7}',
  PY: '\u{1F1F5}\u{1F1FE}', BR: '\u{1F1E7}\u{1F1F7}', EG: '\u{1F1EA}\u{1F1EC}',
  SA: '\u{1F1F8}\u{1F1E6}', TR: '\u{1F1F9}\u{1F1F7}', SG: '\u{1F1F8}\u{1F1EC}',
};

function getFlag(id: string): string {
  const base = id.replace(/-\d+$/, '');
  return FLAG_EMOJI[base] ?? '\u{1F3F3}\u{FE0F}';
}

interface CountryCardProps {
  country: Country;
  index: number;
  onClick: (country: Country) => void;
}

export default function CountryCard({ country, index, onClick }: CountryCardProps) {
  const color = getSeasonColor(country.seasonId);

  return (
    <motion.article
      className={styles.card}
      style={{ '--season-color': color } as React.CSSProperties}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.04, duration: 0.4, ease: 'easeOut' }}
      onClick={() => onClick(country)}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className={styles.order}>
        <span className={styles.orderNum}>{country.orderInSeason}</span>
      </div>
      <span className={styles.flag}>{getFlag(country.id)}</span>
      <div className={styles.info}>
        <h3 className={styles.name}>{country.name}</h3>
        <span className={styles.season}>T{country.seasonId}</span>
      </div>
      {country.guests.length > 0 && (
        <div className={styles.guestBadge}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          {country.guests.length}
        </div>
      )}
    </motion.article>
  );
}
