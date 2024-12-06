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
              width="1rem"
              height="1rem"
              patternUnits="userSpaceOnUse"
            >
              <circle 
                cx="0.5rem"
                cy="0.5rem"
                r="0.075rem"
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