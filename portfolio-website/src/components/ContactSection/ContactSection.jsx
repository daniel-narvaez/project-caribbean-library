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
                required: false
              }}
            />
            <InputField 
              labelConfig={{ text: 'Email' }}
              inputConfig={{
                id: 'emailAddress',
                name: 'email',
                type: 'email',
                required: false
              }}
            />
            <SelectField
              labelConfig={{ text: 'Subject' }}
              selectConfig={{
                id: 'messageSubject',
                name: 'subject',
                required: false
              }}
              options={[
                { value: 'Option 1', label: 'Option 1' },
                { value: 'Option 2', label: 'Option 2' },
                { value: 'Option 3', label: 'Option 3' },
              ]}
            />
            <TextBox 
              labelConfig={{ text: 'Message' }}
              textareaConfig={{
                id: 'messageBody',
                name: 'message',
                required: false
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
        <div className={`${styles.cardContent} ${styles.contactMedia}`}>
          <MessageInABottle id='message-in-a-bottle' />
        </div>
      </article>
    </section>
  );
}