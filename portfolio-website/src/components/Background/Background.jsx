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
              width="32"
              height="32"
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="16"
                cy="16"
                r="2"
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