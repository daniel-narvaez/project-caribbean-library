import React, { useContext } from "react";

import { Form } from "../Form/Form";

import styles from './ContactSection.module.css';

import { ScreenSizeContext } from "../../contexts/ScreenSize";

export const ContactSection = () => {
  const { size } = useContext(ScreenSizeContext)
  return (
    <section
      id='contact'
      className={styles.contactSection}
    >
      <h2 className={`${styles.heading} ${styles[size]}`}>
        Contact
      </h2>
      <article className={styles.contactArticle}>
        <div className={styles.formContent}>
          <div className={styles.taglineContainer}>
            <span>
              Want to reach out? Cast a message to my inbox, and let's begin our conversation. 
            </span>
          </div>
          <Form>
            <label htmlFor="fullName">Name</label>
            <input type="text" id="fullName" name="fullName" placeholder=" "/>
          </Form>
        </div>
        <div className={styles.contactMedia}>

        </div>
      </article>
    </section>
  );
}