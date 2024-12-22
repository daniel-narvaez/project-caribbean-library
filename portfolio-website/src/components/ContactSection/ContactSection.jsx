import React, { useState, useContext } from "react";

import MessageInABottle from '../../../assets/images/message-in-a-bottle.svg?react';
import { Form, InputField, SelectField, TextBox, SubmitButton } from "../Form/Form";

import styles from './ContactSection.module.css';

import { ScreenSizeContext } from "../../contexts/ScreenSize";

export const ContactSection = () => {
  const { size } = useContext(ScreenSizeContext);
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e) => {
    setSubmitted(true);
    console.log('Parent received submit');
  };

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
                required: true
              }}
            />
            <InputField 
              labelConfig={{ text: 'Email' }}
              inputConfig={{
                id: 'emailAddress',
                name: 'email',
                type: 'email',
                required: true
              }}
            />
            <SelectField
              labelConfig={{ text: 'Subject' }}
              selectConfig={{
                id: 'messageSubject',
                name: 'subject',
                required: true
              }}
              options={[
                { value: 'collaborate', label: "Let's Collaborate" },
                { value: 'report', label: 'Report a Bug' },
                { value: 'feedback', label: 'Share Feedback' },
                { value: 'hiring', label: "Discuss Opportunities"},
                { value: 'other', label: 'Something Else' },
              ]}
            />
            <TextBox 
              labelConfig={{ text: 'Message' }}
              textareaConfig={{
                id: 'messageBody',
                name: 'message',
                required: true
              }}
            />
            <div className={styles.ctaMenu}>
              <SubmitButton
                title='Send'
                className='action'
              />
            </div>
          </Form>
        </div>
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
} 