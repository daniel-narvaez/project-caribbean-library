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
import styles from './EmailForm.module.css';
import { sendContactForm } from "../../../api/emailHandler";

/**
 * Contact form subject options
 */
const SUBJECT_OPTIONS = [
  { value: 'collaborate', label: "Let's collaborate" },
  { value: 'report', label: 'Report a bug' },
  { value: 'feedback', label: 'Share feedback' },
  { value: 'hiring', label: "Discuss opportunities" },
  { value: 'other', label: 'Something else' }
];

/**
 * ContactSection Component
 * Renders a contact form with success state animation
 */
export const EmailForm = ({tagline = ''}) => {
  const { size } = useContext(ScreenSizeContext);
  const [flipped, setFlipped] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = useCallback(async (e) => {
    try {
      const formData = {
        name: e.target.name.value,
        email: e.target.email.value,
        subject: e.target.subject.label,
        message: e.target.message.value
      };

      setFlipped(true);
      
      await sendContactForm(formData);

      setError(null); 
      console.log('Parent received submit');
    } catch (error) {
      if (error.message === 'Too many requests. Please try again later') {
        setError('You have written too many messages. Please try again in an hour.');
      } else {
        setError('Failed to send message. Please try again later.')
      }
      console.error('Form submission error:', error);
    }
  }, []);

  return (
    <article className={`
      ${styles.emailArticle}
      ${styles[size]}
      ${flipped ? styles.flipped : ''}
    `}>
      {/* Form Side */}
      <div className={`${styles.cardContent} ${styles.formContent}`}>
        <div className={styles.taglineContainer}>
          <span className={styles[size]}>
            {tagline}
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
              // disabled: true
            }}
          />

          <InputField
            labelConfig={{ text: 'Email' }}
            inputConfig={{
              id: 'emailAddress',
              name: 'email',
              type: 'email',
              required: true,
              // disabled: true
            }}
          />

          <SelectField
            labelConfig={{ text: 'Subject' }}
            selectConfig={{
              id: 'messageSubject',
              name: 'subject',
              required: true,
              // disabled: true
            }}
            options={SUBJECT_OPTIONS}
          />

          <TextBox
            labelConfig={{ text: 'Message' }}
            textareaConfig={{
              id: 'messageBody',
              name: 'message',
              required: true,
              // disabled: true
            }}
          />

          <div className={styles.ctaMenu}>
            <SubmitButton
              title='Send'
              className='action'
              // disabled={true}
            />
          </div>
        </Form>
      </div>

      {/* Success Message Side */}
      <div className={`${styles.cardContent} ${styles.emailMedia} ${styles[size]}`}>
        {!error ? (
          <>
            <MessageInABottle id='message-in-a-bottle' />
            <div className={styles.taglineContainer}>
              <span className={styles[size]}>
                Message in a bottle sent! <br/>
                I'll respond within 48 hours.
              </span>
            </div>
          </>
        ) : (
          <div className={styles.taglineContainer}>
            <span className={`${styles[size]} ${styles.error}`}>
              {error}
            </span>
          </div>
        )}
      </div>
    </article>
  );
};