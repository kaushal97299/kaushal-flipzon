import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './contactUs.css';

const ContactUs = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'general',
    message: '',
    orderNumber: ''
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);
  const [touched, setTouched] = useState({});

  // Add phone number validation pattern
  const phoneRegex = /^[+]?[(]?[0-9]{1,4}[)]?[-\s./0-9]*$/;

  // Validate form fields when they lose focus
  const handleBlur = (field) => {
    setTouched({ ...touched, [field]: true });
    validateField(field, formData[field]);
  };

  // Validate individual field
  const validateField = (fieldName, value) => {
    let error = '';
    
    switch (fieldName) {
      case 'name':
        if (!value.trim()) error = 'Name is required';
        break;
      case 'email':
        if (!value.trim()) {
          error = 'Email is required';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
          error = 'Please enter a valid email';
        }
        break;
      case 'phone':
        if (value && !phoneRegex.test(value)) {
          error = 'Please enter a valid phone number';
        }
        break;
      case 'message':
        if (!value.trim()) error = 'Message is required';
        break;
      case 'orderNumber':
        if (formData.subject === 'order' && !value.trim()) {
          error = 'Order number is required for order inquiries';
        }
        break;
      default:
        break;
    }
    
    setErrors({ ...errors, [fieldName]: error });
  };

  // Validate entire form
  const validateForm = () => {
    Object.keys(formData).forEach(field => {
      if (field !== 'phone' || formData.phone) { // Only validate phone if it has value
        validateField(field, formData[field]);
      }
    });
    return !Object.values(errors).some(error => error);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing if the field was touched
    if (touched[name] && errors[name]) {
      validateField(name, value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Mark all fields as touched on submit
    setTouched(Object.keys(formData).reduce((acc, field) => {
      acc[field] = true;
      return acc;
    }, {}));

    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      const response = await axios.post('https://ecommerce-atbk.onrender.com/api/contact/contactt', {
        ...formData,
        phone: formData.phone || null,
        orderNumber: formData.subject === 'order' ? formData.orderNumber : null
      });
      
      if (response.data.success) {
        setSubmitStatus('success');
        // Reset form after successful submission
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: 'general',
          message: '',
          orderNumber: ''
        });
        setTouched({});
      } else {
        setSubmitStatus('error');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
      
      if (error.response?.status === 429) {
        setErrors({ 
          ...errors, 
          server: 'Too many submissions. Please try again later.' 
        });
      } else if (error.response?.data?.errors) {
        setErrors(error.response.data.errors);
      } else {
        setErrors({ 
          ...errors, 
          server: 'An unexpected error occurred. Please try again.' 
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset success message after 5 seconds
  useEffect(() => {
    if (submitStatus === 'success') {
      const timer = setTimeout(() => {
        setSubmitStatus(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [submitStatus]);

  return (
    <div className="contact-container">
      <h1 className='conntt'>Contact Us</h1>
      <p>Have questions or feedback? We'd love to hear from you!</p>
      
      <div className="contact-content">
        <div className="contact-form">
          <form onSubmit={handleSubmit} noValidate>
            <div className={`form-group ${errors.name ? 'error' : ''}`}>
              <label htmlFor="name">Your Name*</label>
              <input 
                type="text" 
                id="name" 
                name="name" 
                value={formData.name}
                onChange={handleChange}
                onBlur={() => handleBlur('name')}
                required 
              />
              {errors.name && <span className="error-message">{errors.name}</span>}
            </div>
            
            <div className={`form-group ${errors.email ? 'error' : ''}`}>
              <label htmlFor="email">Email Address*</label>
              <input 
                type="email" 
                id="email" 
                name="email" 
                value={formData.email}
                onChange={handleChange}
                onBlur={() => handleBlur('email')}
                required 
              />
              {errors.email && <span className="error-message">{errors.email}</span>}
            </div>
            
            <div className={`form-group ${errors.phone ? 'error' : ''}`}>
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                name="phone" 
                value={formData.phone}
                onChange={handleChange}
                onBlur={() => handleBlur('phone')}
              />
              {errors.phone && <span className="error-message">{errors.phone}</span>}
            </div>
            
            <div className="form-group">
              <label htmlFor="subject">Subject*</label>
              <select 
                id="subject" 
                name="subject" 
                value={formData.subject}
                onChange={handleChange}
                required
              >
                <option value="general">General Inquiry</option>
                <option value="order">Order Question</option>
                <option value="return">Returns & Refunds</option>
                <option value="shipping">Shipping Information</option>
                <option value="product">Product Question</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            {formData.subject === 'order' && (
              <div className={`form-group ${errors.orderNumber ? 'error' : ''}`}>
                <label htmlFor="orderNumber">Order Number*</label>
                <input 
                  type="text" 
                  id="orderNumber" 
                  name="orderNumber" 
                  value={formData.orderNumber}
                  onChange={handleChange}
                  onBlur={() => handleBlur('orderNumber')}
                />
                {errors.orderNumber && <span className="error-message">{errors.orderNumber}</span>}
              </div>
            )}
            
            <div className={`form-group ${errors.message ? 'error' : ''}`}>
              <label htmlFor="message">Your Message*</label>
              <textarea 
                id="message" 
                name="message" 
                value={formData.message}
                onChange={handleChange}
                onBlur={() => handleBlur('message')}
                required
              ></textarea>
              {errors.message && <span className="error-message">{errors.message}</span>}
            </div>
            
            <button 
              className='submit-button'
              type="submit" 
              disabled={isSubmitting}
              // className={isSubmitting ? 'submitting' : ''} 
              aria-label={isSubmitting ? 'Submitting form' : 'Submit form'}
            >
              {isSubmitting ? (
                <>
                  <span className="spinner" aria-hidden="true"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </button>
            
            {submitStatus === 'success' && (
              <div className="success-message" role="alert">
                <i className="fas fa-check-circle" aria-hidden="true"></i>
                Thank you for your message! We'll get back to you soon.
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="error-message" role="alert">
                <i className="fas fa-exclamation-circle" aria-hidden="true"></i>
                There was an error submitting your message. Please try again.
                {errors.server && <p className="server-error">{errors.server}</p>}
              </div>
            )}
          </form>
        </div>
        
        <div className="contact-info">
          <div className="info-item">
            <i className="fas fa-map-marker-alt" aria-hidden="true"></i>
            <h3>Our Location</h3>
            <p>123 E-commerce Street<br />Digital City, DC 10001</p>
          </div>
          
          <div className="info-item">
            <i className="fas fa-phone" aria-hidden="true"></i>
            <h3>Phone Support</h3>
            <p>+1 (555) 123-4567<br />Mon-Fri: 9am-6pm EST</p>
          </div>
          
          <div className="info-item">
            <i className="fas fa-envelope" aria-hidden="true"></i>
            <h3>Email Us</h3>
            <p>support@ecommercestore.com<br />response within 24 hours</p>
          </div>
          
          <div className="info-item">
            <i className="fas fa-comments" aria-hidden="true"></i>
            <h3>Live Chat</h3>
            <p>Available 24/7<br />Click the chat icon in the corner</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;