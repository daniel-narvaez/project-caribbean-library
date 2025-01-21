/**
 * Sends form data to the contact API endpoint
 * @param {Object} formData - Form data from the EmailForm component
 * @param {string} formData.name - The sender's name
 * @param {string} formData.email - The sender's email
 * @param {string} formData.subject - Selected subject from SUBJECT_OPTIONS
 * @param {string} formData.message - The message content
 * @returns {Promise<Object>} - The response from the server
 */
export const sendContactForm = async (formData) => {
  try {
    const response = await fetch('/api/submit-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: formData.name,
        email: formData.email,
        subject: formData.subject,
        message: formData.message
      })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to send message');
    }

    return await response.json();
  } catch (error) {
    console.error('Error sending contact form:', error);
    throw error;
  }
};