/**
 * Contact.jsx
 * ==========
 * 
 * Main contact page featuring:
 * - Email contact form
 * - Social platform links
 * - Interactive bookshelf display
 * - Responsive layout
 */

import { useContext } from "react";
import { Background } from "../../components/Background/Background";
import ScrollAnchor from "../../components/ScrollAnchor/ScrollAnchor";
import { EmailForm } from "../../components/EmailForm/EmailForm";
import { ContactBook } from "../../components/ContactItem/ContactItem";
import { Footer } from "../../components/Footer/Footer";
import Chapter from "../../components/Chapter/Chapter";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import styles from './Contact.module.css';

/**
 * Available platform connections
 * Listed in display order
 */
const CONTACT_PLATFORMS = [
  'Itch',
  'GitHub',
  'LinkedIn',
  'Bluesky',
  'TheXPlace',
  'YoungArts Post',
  'Discord',
  'Machinations'
];

/**
 * Contact page component
 * Provides multiple ways to connect including email and social platforms
 */
function Contact() {
  const { size } = useContext(ScreenSizeContext);

  return (
    <Background>
      <div className={`${styles.Contact} ${styles[size]}`}>
        <ScrollAnchor />
        
        {/* Accessibility title */}
        <h1 className="sr-only">Contact Email | Daniel Narvaez</h1>

        {/* Email Contact Section */}
        <Chapter
          id="hero"
          className={`${styles.heroSection} ${styles[size]}`}
        >
          <div className={styles.heroContent}>
            <h2 className={styles.headline}>
              Get in contact
            </h2>
            <p className={styles.tagline}>
              Want to reach out? <b>Write a <br/>message</b> to my inbox,
              <br/>and let's begin our conversation.
            </p>
          </div>
          <div className={styles.heroMedia}>
            <EmailForm />
          </div>
        </Chapter>

        {/* Social Platforms Section */}
        <Chapter
          id="platforms"
          className={`${styles.platformsSection} ${styles[size]}`}
        >
          <div className={styles.platformsContent}>
            <h2 className={styles.headline}>
              Let's connect <br/>
              elsewhere
            </h2>
            <p className={styles.tagline}>
              <b>Select a book</b> to open my <br/>
              profile on that platform.
            </p>
          </div>
          <div className={styles.platformsMedia}>
            <div className={`${styles.bookshelf} ${styles[size]}`}>
              {CONTACT_PLATFORMS.map(app => (
                <ContactBook 
                  key={app} 
                  iconName={app} 
                />
              ))}
            </div>
          </div>
        </Chapter>
      </div>
      <Footer />
    </Background>
  );
}

export default Contact;