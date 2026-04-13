import styles from './GlobeMarker.module.css';

interface GlobeMarkerProps {
  color: string;
  name: string;
  hasGuests: boolean;
}

export default function GlobeMarker({ color, name, hasGuests }: GlobeMarkerProps) {
  return (
    <div className={styles.marker} title={name}>
      <div
        className={`${styles.dot} ${hasGuests ? styles.hasGuests : ''}`}
        style={{ background: color, boxShadow: `0 0 8px ${color}` }}
      />
      {hasGuests && (
        <div
          className={styles.ring}
          style={{ borderColor: color }}
        />
      )}
    </div>
  );
}
