/**
 * emailHandler.js
 * ==============
 * 
 * Utility for handling contact form submissions.
 * Manages form data validation and API communication.
 */

const API_CONFIG = {
  ENDPOINT: '/api/submit-form',
  HEADERS: {
    'Content-Type': 'application/json'
  }
};

/**
 * Validates form data before submission
 * @param {Object} formData - Form data to validate
 * @returns {boolean} True if data is valid
 * @throws {Error} If validation fails
 */
function validateFormData(formData) {
  if (!formData.email?.trim()) {
    throw new Error('Email is required');
  }
  if (!formData.message?.trim()) {
    throw new Error('Message is required');
  }
  return true;
}

/**
 * Sends form data to the contact API endpoint
 * @param {Object} formData - Form data from the EmailForm component
 * @param {string} formData.name - The sender's name
 * @param {string} formData.email - The sender's email
 * @param {string} formData.subject - Selected subject from SUBJECT_OPTIONS
 * @param {string} formData.message - The message content
 * @returns {Promise<Object>} Response from the server
 * @throws {Error} If submission fails
 */
export const sendContactForm = async (formData) => {
  try {
    // Validate form data
    validateFormData(formData);

    // Send request
    const response = await fetch(API_CONFIG.ENDPOINT, {
      method: 'POST',
      headers: API_CONFIG.HEADERS,
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });

    // Handle response
    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();

  } catch (error) {
    console.error('Contact form submission error:', {
      message: error.message,
      formData: { ...formData, message: '[REDACTED]' }
    });
    throw error;
  }
};