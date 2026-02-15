/**
 * Form.jsx
 * =======
 * 
 * Overview:
 * A comprehensive form system with various input types and built-in validation.
 * Features floating labels, error handling, and responsive design.
 * 
 * Key Features:
 * - Floating label inputs
 * - Built-in validation
 * - Character counting
 * - Responsive design
 * - Configurable fields
 * 
 * Technical Implementation:
 * - Uses React hooks for state management
 * - Context-based screen size adaptation
 * - Memoized components for performance
 * - Unique ID generation for form elements
 */

import { useState, memo, useCallback } from 'react';
import styles from './Form.module.css';
import typographies from '../../typography.module.css';
import { getArticle } from '../../utils';

/**
 * Unique ID generator for form elements
 * Uses closure to maintain counter state
 */
const createUniqueId = (() => {
    let counter = 0;
    return (prefix = 'form') => `${prefix}-${counter++}`;
})();

/**
 * Validation utilities for form fields
 */
const validators = {
    email: (value) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(value) ? '' : 'Please enter a valid email address';
    },
    
    fullName: (value) => {
        const nameRegex = /^[a-zA-Z\s'-]+$/;
        if (!nameRegex.test(value)) {
            return 'Please use only letters, hyphens, and apostrophes';
        }
        if (value.length < 2) {
            return 'Name is too short';
        }
        if (value.length > 50) {
            return 'Name is too long';
        }
        const words = value.trim().split(/\s+/);
        if (words.length < 2) {
            return 'Please enter both first and last name';
        }
        return '';
    },

    required: (value, fieldName) => {
        return value ? '' : `${fieldName} is required`;
    }
};

/**
 * Core Form component
 * Handles form submission and provides context to child components
 */
export const Form = ({ children, onSubmit }) => {
    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (onSubmit) {
            onSubmit(e);
        }
    }, [onSubmit]);

    return (
        <form 
            className={styles.form}
            onSubmit={handleSubmit}
        >
            {children}
        </form>
    );
};

/**
 * Input Field Components
 * ====================
 */

/**
 * InputField Component
 * A floating label input field with validation
 */
export const InputField = ({
  labelConfig = {},
  inputConfig = {}
}) => {
  const [error, setError] = useState('');

  const defaultInputConfig = {
      type: "text",
      id: createUniqueId('input'),
      name: "defaultName",
      placeholder: " ",
      required: false,
      disabled: false
  };

  const defaultLabelConfig = {
      text: "Label"
  };

  const finalInputConfig = { ...defaultInputConfig, ...inputConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const validateInput = useCallback((value) => {
      if (finalInputConfig.required && !value) {
          setError(`Your ${finalLabelConfig.text.toLowerCase()} is required`);
          return false;
      }

      if (finalInputConfig.type === 'email') {
          const emailError = validators.email(value);
          if (emailError) {
              setError(emailError);
              return false;
          }
      }
      else if (finalInputConfig.type === 'fullName') {
          const nameError = validators.fullName(value);
          if (nameError) {
              setError(nameError);
              return false;
          }
      }

      setError('');
      return true;
  }, [finalInputConfig.required, finalInputConfig.type, finalLabelConfig.text]);

  return (
      <div className={`${styles.inputField}`}>
          <input 
              className={`${typographies.b2}`}
              {...finalInputConfig}
              onBlur={(e) => validateInput(e.target.value)}
          />
          <label className={`${typographies.ui4}`} htmlFor={finalInputConfig.id}>
              {finalLabelConfig.text}
          </label>
          {error && <span className={`${typographies.ui4} ${styles.error}`}>{error}</span>}
      </div>
  );
};

/**
* SelectField Component
* A dropdown select field with floating label
*/
export const SelectField = ({
  labelConfig = {},
  selectConfig = {},
  options = []
}) => {
  const [error, setError] = useState('');

  const defaultSelectConfig = {
      id: createUniqueId('select'),
      name: "defaultName",
      required: false,
      disabled: false
  };

  const defaultLabelConfig = {
      text: "Label"
  };

  const finalSelectConfig = { ...defaultSelectConfig, ...selectConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const validateInput = useCallback((value) => {
      if (!value && finalSelectConfig.required) {
          const article = getArticle(finalLabelConfig.text);
          setError(`${article.toUpperCase()} ${finalLabelConfig.text.toLowerCase()} is required`);
          return false;
      }
      setError('');
      return true;
  }, [finalSelectConfig.required, finalLabelConfig.text]);

  // Filter duplicate options
  const uniqueOptions = options.filter((option, index, self) => {
      const firstIndex = self.findIndex(o => o.value === option.value);
      if (firstIndex !== index) {
          console.warn(`Duplicate value found in select options: "${option.value}". Only the first occurrence will be used.`);
      }
      return firstIndex === index;
  });

  return (
      <div className={`${styles.selectField}`}>
          <select 
              className={`${typographies.b2}`}
              {...finalSelectConfig}
              onBlur={(e) => validateInput(e.target.value)}
          >
              <option className={`${typographies.b2}`} value="" hidden> </option>
              {uniqueOptions.map(option => (
                  <option className={`${typographies.b2}`} key={option.value} value={option.value}>
                      {option.label}
                  </option>
              ))}
          </select>
          <label className={`${typographies.ui4}`} htmlFor={finalSelectConfig.id}>
              {finalLabelConfig.text}
          </label>
          {error && <span className={`${typographies.ui4} ${styles.error}`}>{error}</span>}
      </div>
  );
};

/**
 * TextBox and Submit Components
 * ===========================
 */

/**
 * TextBox Component
 * A multi-line text input with character counting
 */
export const TextBox = ({
  labelConfig = {},
  textareaConfig = {}
}) => {
  const [error, setError] = useState('');
  const [charCount, setCharCount] = useState(0);

  const defaultTextareaConfig = {
      id: createUniqueId('textarea'),
      name: "defaultName",
      placeholder: " ",
      required: false,
      disabled: false,
      rows: 5,
      maxLength: 1000
  };

  const defaultLabelConfig = {
      text: "Label"
  };

  const finalTextareaConfig = { ...defaultTextareaConfig, ...textareaConfig };
  const finalLabelConfig = { ...defaultLabelConfig, ...labelConfig };

  const handleInput = useCallback((e) => {
      setCharCount(e.target.value.length);
      if (finalTextareaConfig.onChange) {
          finalTextareaConfig.onChange(e);
      }
  }, [finalTextareaConfig]);

  const validateInput = useCallback((value) => {
      if (!value && finalTextareaConfig.required) {
          setError(`A ${finalTextareaConfig.name.toLowerCase()} is required`);
          return false;
      }
      setError('');
      return true;
  }, [finalTextareaConfig.required, finalTextareaConfig.name]);

  return (
      <div className={`${styles.textBox}`}>
          <textarea 
              className={`${typographies.b2}`}
              {...finalTextareaConfig}
              onChange={handleInput}
              onBlur={(e) => validateInput(e.target.value)}
          />
          <label className={`${typographies.ui4}`} htmlFor={finalTextareaConfig.id}>
              {finalLabelConfig.text}
          </label>
          <span className={`${typographies.ui4} ${styles.charCount}`}>
              {finalTextareaConfig.maxLength - charCount} characters remaining
          </span>
          {error && <span className={`${typographies.ui4} ${styles.error}`}>{error}</span>}
      </div>
  );
};

/**
* SubmitButton Component
* A styled submit button with variants
*/
export const SubmitButton = memo(({
  title = 'Submit',
  className = '',
  style = 'solid',
  disabled = false
}) => {
  return (
      <button
          type="submit"
          className={`${styles.submitButton} ${styles[style]} ${styles[className]} ${className}`}
          disabled={disabled}
      >
          <span className={`${typographies.ui3}`}>{title}</span>
      </button>
  );
});