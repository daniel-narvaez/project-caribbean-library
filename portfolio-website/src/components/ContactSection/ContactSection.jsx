/**
 * ContactSection.jsx
 * ================
 * 
 * Overview:
 * A responsive contact form section with animated state transitions.
 * Features a flip animation on submission and themed form fields.
 * 
 * Key Features:
 * - Animated form/success state transition
 * - Responsive layout
 * - Validated form fields
 * - Message in a bottle illustration
 * 
 * Technical Implementation:
 * - Uses Form component system
 * - Context-based responsive design
 * - SVG illustration integration
 * - Submission state management
 */

import { useState, useContext, useCallback, memo } from "react";
import MessageInABottle from '../../../assets/images/message-in-a-bottle.svg?react';
import { 
  Form, 
  InputField, 
  SelectField, 
  TextBox, 
  SubmitButton 
} from "../Form/Form";
import { ScreenSizeContext } from "../../contexts/ScreenSize";
import styles from './ContactSection.module.css';

/**
 * Contact form subject options
 */
const SUBJECT_OPTIONS = [
  { value: 'collaborate', label: "Let's Collaborate" },
  { value: 'report', label: 'Report a Bug' },
  { value: 'feedback', label: 'Share Feedback' },
  { value: 'hiring', label: "Discuss Opportunities" },
  { value: 'other', label: 'Something Else' }
];

/**
 * ContactSection Component
 * Renders a contact form with success state animation
 */
export const ContactSection = () => {
  const { size } = useContext(ScreenSizeContext);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = useCallback((e) => {
    setSubmitted(true);
    console.log('Parent received submit');
  }, []);

  return (
    <section
        id='contact'
        className={styles.contactSection}
    >
      <h2 className={`${styles.heading} ${styles[size]}`}>
          Contact
      </h2>

      <article className={`
          ${styles.contactArticle}
          ${submitted ? styles.flipped : ''}
      `}>
        {/* Form Side */}
        <div className={`${styles.cardContent} ${styles.formContent}`}>
          <div className={styles.taglineContainer}>
            <span className={styles[size]}>
              Want to reach out? Cast a message to my inbox, and let's begin our conversation.
            </span>
          </div>

          <Form onSubmit={handleSubmit}>
            <InputField
              labelConfig={{ text: 'Name' }}
              inputConfig={{
                id: 'fullName',
                name: 'name',
                type: 'fullName',
                required: true,
                disabled: true
              }}
            />

            <InputField
              labelConfig={{ text: 'Email' }}
              inputConfig={{
                id: 'emailAddress',
                name: 'email',
                type: 'email',
                required: true,
                disabled: true
              }}
            />

            <SelectField
              labelConfig={{ text: 'Subject' }}
              selectConfig={{
                id: 'messageSubject',
                name: 'subject',
                required: true,
                disabled: true
              }}
              options={SUBJECT_OPTIONS}
            />

            <TextBox
              labelConfig={{ text: 'Message' }}
              textareaConfig={{
                id: 'messageBody',
                name: 'message',
                required: true,
                disabled: true
              }}
            />

            <div className={styles.ctaMenu}>
              <SubmitButton
                title='Send'
                className='action'
                disabled={true}
              />
            </div>
          </Form>
        </div>

        {/* Success Message Side */}
        <div className={`${styles.cardContent} ${styles.contactMedia} ${styles[size]}`}>
          <MessageInABottle id='message-in-a-bottle' />
          <div className={styles.taglineContainer}>
            <span className={styles[size]}>
              Message in a bottle sent! <br/>
              I'll respond within 48 hours.
            </span>
          </div>
        </div>
      </article>
    </section>
  );
};