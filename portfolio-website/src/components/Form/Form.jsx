import React, { useState, useContext, memo } from 'react';

import styles from './Form.module.css'

import { ScreenSizeContext } from '../../contexts/ScreenSize';
import { getArticle } from '../../utils';


export const Form = ({ children, onSubmit }) => {

  const handleSubmit = (e) => {
    e.preventDefault();  // Prevent default form submission
    console.log('Form submitted');
    if (onSubmit) {
      onSubmit(e);
    }
  };

  return (
    <form 
      className={styles.form}
      onSubmit={handleSubmit}
    >
      {children}
    </form>
  );
}

const generateUniqueId = (() => {
  let counter = 0;
  return (prefix = 'default') => `${prefix}-${counter++}`;
})();

export const InputField = ({
  labelConfig = {},
  inputConfig = {}
}) => {
  const [error, setError] = useState('');
  const { size } = useContext(ScreenSizeContext);

  const defaultInputConfig = {
    type: "text",
    id: generateUniqueId('input'),
    name: "defaultName",
    placeholder: " ",
    required: false
  };

  const defaultLabelConfig = {
    text: "Label"
  };

  const finalInputConfig = { ...defaultInputConfig, ...inputConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const validateInput = (value) => {
    // First check if field is required and empty
    if (!value && finalInputConfig.required) {
      setError(`Your ${finalLabelConfig.text.toLowerCase()} is required`);
      return false;
    }

    // Only do email validation if type is email
    if (finalInputConfig.type === 'email') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        setError('Please enter a valid email address');
        return false;
      }
    }
    else if (finalInputConfig.type === 'fullName') {  // Add new type
      // Check for valid characters (letters, spaces, hyphens, apostrophes)
      const nameRegex = /^[a-zA-Z\s'-]+$/;
      if (!nameRegex.test(value)) {
        setError('Please use only letters, hyphens, and apostrophes');
        return false;
      }

      // Check minimum length (e.g., 2 characters)
      if (value.length < 2) {
        setError('Name is too short');
        return false;
      }

      // Check maximum length (e.g., 50 characters)
      if (value.length > 50) {
        setError('Name is too long');
        return false;
      }

      // Check for at least two words
      const words = value.trim().split(/\s+/);
      if (words.length < 2) {
        setError('Please enter both first and last name');
        return false;
      }
    }

    setError('');
    return true;
  };

  return (
    <div className={`${styles.inputField} ${styles[size]}`}>
      <input className='action'
        {...finalInputConfig}
        onBlur={(e) => validateInput(e.target.value)}
      />
      <label className='action' htmlFor={finalInputConfig.id}>
        {finalLabelConfig.text}
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  );
}

export const SelectField = ({
  labelConfig = {},
  selectConfig = {},
  options = [] // Array of { value: string, label: string }
}) => {
  const [error, setError] = useState('');
  const { size } = useContext(ScreenSizeContext);

  const defaultSelectConfig = {
    id: generateUniqueId('select'),
    name: "defaultName",
    required: false
  };

  const defaultLabelConfig = {
    text: "Label"
  };

  const finalSelectConfig = { ...defaultSelectConfig, ...selectConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const validateInput = (value) => {
    if(!value && finalSelectConfig.required) {
      setError(`${getArticle(finalLabelConfig.text).toUpperCase()} ${finalLabelConfig.text.toLowerCase()} is required`)
      return false;
    }

    setError('');
    return true;
  };

  const seenValues = new Set();
  const uniqueOptions = options.filter(option => {
    if (seenValues.has(option.value)) {
      console.warn(`Duplicate value found in select options: "${option.value}". Only the first occurrence will be used.`);
      return false;
    }
    seenValues.add(option.value);
    return true;
  });

  return (
    <div className={`${styles.selectField} ${styles[size]}`}>
      <select className='action'
        {...finalSelectConfig}
        onBlur={(e) => validateInput(e.target.value)}
      >
        <option value="" hidden> </option>
        {uniqueOptions.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <label className='action' htmlFor={finalSelectConfig.id}>
        {finalLabelConfig.text}
      </label>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

export const TextBox = ({
  labelConfig = {},
  textareaConfig = {}
}) => {
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);
  const { size } = useContext(ScreenSizeContext);

  const defaultTextareaConfig = {
    id: generateUniqueId('textarea'),
    name: "defaultName",
    placeholder: " ",
    required: false,
    rows: 5,
    maxLength: 1000
  };

  const defaultLabelConfig = {
    text: "Label"
  };

  const finalTextareaConfig = { ...defaultTextareaConfig, ...textareaConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const handleInput = (e) => {
    setCharCount(e.target.value.length);
    if (finalTextareaConfig.onChange) {
      finalTextareaConfig.onChange(e);
    }
  };

  const validateInput = (value) => {
    // First check if field is required and empty
    if (!value && finalTextareaConfig.required) {
      setError(`A ${finalTextareaConfig.name.toLowerCase()} is required`);
      return false;
    }

    setError('');
    return true;
  }

  return (
    <div className={`${styles.textBox} ${styles[size]}`}>
      <textarea className='action'
        {...finalTextareaConfig}
        onChange={handleInput}
        onBlur={(e) => validateInput(e.target.value)}
      />
      <label className='action' htmlFor={finalTextareaConfig.id}>
        {finalLabelConfig.text}
      </label>
      <span className={styles.charCount}>
        {finalTextareaConfig.maxLength - charCount} characters remaining
      </span>
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

export const SubmitButton = memo(({
  title = 'Submit',
  className = '',
  style = 'solid'
}) => {

  return (
    <button
      type="submit"
      className={`${styles.submitButton} ${styles[style]} ${styles[className]} ${className}`}
    >
      <span>{title}</span>
    </button>
  );
});