import styles from './Background.module.css';

export const Background = ({ children }) => {
  return (
    <div className={styles.backgroundContainer}>
      <div className={styles.patternContainer}>
        <svg className={styles.svgPattern}>
          <defs>
            <pattern
              id="dotPattern"
              x="0"
              y="0"
              width="16"
              height="16"
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="8"
                cy="8"
                r="1.2"
                fill="#dcd8d1"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#dotPattern)`} />
        </svg>
      </div>
      <div className={styles.childrenWrapper}>
        {children}
      </div>
    </div>
  );
}