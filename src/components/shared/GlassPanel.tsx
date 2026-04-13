import type { ReactNode, CSSProperties } from 'react';
import styles from './GlassPanel.module.css';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  as?: 'div' | 'section' | 'article';
}

export default function GlassPanel({
  children,
  className = '',
  style,
  as: Tag = 'div',
}: GlassPanelProps) {
  return (
    <Tag className={`${styles.panel} ${className}`} style={style}>
      {children}
    </Tag>
  );
}
