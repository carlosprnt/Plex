import { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Country } from '../../types';
import { getSeasonColor, seasons } from '../../data/worldTourData';
import GuestInfo from './GuestInfo';
import styles from './CountryDetail.module.css';

interface CountryDetailProps {
  country: Country | null;
  onClose: () => void;
}

export default function CountryDetail({ country, onClose }: CountryDetailProps) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <AnimatePresence>
      {country && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <motion.div
            className={styles.modal}
            style={{ '--season-color': getSeasonColor(country.seasonId) } as React.CSSProperties}
            initial={{ opacity: 0, y: 60, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.97 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <button className={styles.close} onClick={onClose} aria-label="Cerrar">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>

            <div className={styles.header}>
              <div className={styles.orderBadge}>
                {country.orderInSeason}
              </div>
              <div>
                <h2 className={styles.name}>{country.name}</h2>
                <p className={styles.seasonLabel}>
                  {seasons.find((s) => s.id === country.seasonId)?.title} &middot;{' '}
                  {seasons.find((s) => s.id === country.seasonId)?.year}
                </p>
              </div>
            </div>

            {country.description && (
              <p className={styles.description}>{country.description}</p>
            )}

            {country.guests.length > 0 && (
              <div className={styles.guestsSection}>
                <h3 className={styles.guestsTitle}>Invitados</h3>
                <div className={styles.guestsList}>
                  {country.guests.map((guest) => (
                    <GuestInfo key={guest.name} guest={guest} />
                  ))}
                </div>
              </div>
            )}

            {country.videoUrl && (
              <a
                href={country.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.videoLink}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                </svg>
                Ver en YouTube
              </a>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
