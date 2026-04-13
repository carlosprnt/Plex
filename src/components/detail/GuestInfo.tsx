import type { Guest } from '../../types';
import styles from './GuestInfo.module.css';

interface GuestInfoProps {
  guest: Guest;
}

export default function GuestInfo({ guest }: GuestInfoProps) {
  return (
    <div className={styles.card}>
      {guest.avatarUrl ? (
        <img
          src={guest.avatarUrl}
          alt={guest.name}
          className={styles.avatarImg}
          onError={(e) => {
            (e.target as HTMLImageElement).style.display = 'none';
            (e.target as HTMLImageElement).nextElementSibling?.classList.remove(styles.hidden);
          }}
        />
      ) : null}
      <div
        className={`${styles.avatar} ${guest.avatarUrl ? styles.hidden : ''}`}
        style={guest.avatarColor ? { background: guest.avatarColor } : undefined}
      >
        {guest.name.charAt(0)}
      </div>
      <div className={styles.info}>
        <h4 className={styles.name}>{guest.name}</h4>
        <p className={styles.role}>{guest.role}</p>
        <div className={styles.links}>
          {guest.wikipediaUrl && (
            <a href={guest.wikipediaUrl} target="_blank" rel="noopener noreferrer" className={styles.link} title="Wikipedia">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12.09 13.119c-.936 1.932-2.217 4.548-2.853 5.728-.616 1.074-1.127.931-1.532.029-1.406-3.321-4.293-9.144-5.651-12.409-.251-.601-.441-.987-.619-1.139-.181-.15-.554-.24-1.122-.271C.103 5.033 0 4.982 0 4.898v-.455l.052-.045c.924-.005 5.401 0 5.401 0l.051.045v.434c0 .119-.075.176-.225.176l-.564.031c-.485.029-.727.164-.727.436 0 .135.053.33.166.601 1.082 2.646 4.818 10.521 4.818 10.521l2.681-5.478-2.149-4.478c-.315-.614-.632-.928-.95-.939l-.757-.033c-.159 0-.236-.058-.236-.174v-.435l.053-.045h4.827l.051.045v.434c0 .119-.074.176-.223.176l-.372.012c-.491.014-.701.158-.536.494.656 1.343 1.879 3.951 1.879 3.951l1.874-3.872c.127-.291.191-.527.191-.7 0-.294-.271-.457-.813-.489l-.449-.023c-.147 0-.22-.056-.22-.174v-.435l.053-.045c.584-.003 3.67 0 3.67 0l.051.045v.434c0 .119-.073.176-.22.176-.725.043-1.244.206-1.564.623-.31.296-2.286 4.505-2.286 4.505l2.395 5.075s3.564-7.645 4.263-9.208c.258-.586.387-.998.387-1.197 0-.273-.263-.424-.79-.451l-.622-.031c-.151 0-.226-.057-.226-.175v-.435l.052-.045h4.013l.051.045v.434c0 .119-.074.176-.223.176-.753.032-1.297.223-1.635.572-.339.348-1.267 2.456-1.267 2.456l-4.752 10.138c-.397.839-.861.946-1.391.321-.53-.624-2.717-5.646-2.717-5.646z"/>
              </svg>
            </a>
          )}
          {guest.socialLinks?.youtube && (
            <a href={guest.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className={styles.link} title="YouTube">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
            </a>
          )}
          {guest.socialLinks?.instagram && (
            <a href={guest.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className={styles.link} title="Instagram">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
              </svg>
            </a>
          )}
          {guest.socialLinks?.twitter && (
            <a href={guest.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className={styles.link} title="X/Twitter">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
              </svg>
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
