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
import { DeviceContext } from "../../contexts/DeviceContext";
import styles from './Contact.module.css';
import { socialMediaData } from "../../data/appIcons";
import { Helmet } from 'react-helmet';

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
  const { device } = useContext(DeviceContext);

  return (
    <>
      <Helmet>
        <title>{`Résumé | Daniel Narvaez`}</title>
      </Helmet>
      <Background>
        <div className={`${styles.Contact} ${styles[device]}`}>
          <ScrollAnchor />
          
          {/* Accessibility title */}
          <h1 className="sr-only">Contact Email | Daniel Narvaez</h1>

          {/* Email Contact Section */}
          <Chapter
            id="hero"
            className={`${styles.heroSection} ${styles[device]}`}
          >
            <div className={styles.heroContent}>
              <h2 className={styles.headline}>
                Get in contact
              </h2>
              <p className={styles.tagline}>
                Want to reach out? <b>Write a <br/>
                message</b> to my inbox, and <br/>
                let's begin our conversation.
              </p>
            </div>
            <div className={styles.heroMedia}>
              <EmailForm />
            </div>
          </Chapter>

          {/* Social Platforms Section */}
          <Chapter
            id="platforms"
            className={`${styles.platformsSection} ${styles[device]}`}
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
              <div className={`${styles.bookshelf} ${styles[device]}`}>
              {Object.values(socialMediaData).map((icon) => (
                <ContactBook
                  key={icon.appName} // Assuming AppIconObject has an appName property
                  icon={icon}
                />
              ))}
              </div>
            </div>
          </Chapter>
        </div>
        <Footer />
      </Background>
    </>
  );
}

export default Contact;