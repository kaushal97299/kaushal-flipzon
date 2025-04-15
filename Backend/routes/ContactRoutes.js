const express = require('express');
const app = express();
const Contact = require('../models/Contact');
const { body, validationResult } = require('express-validator');
const rateLimit = require('express-rate-limit');
const sanitizeHtml = require('sanitize-html');

// Rate limiting for contact form submissions
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // limit each IP to 5 requests per windowMs
  message: 'Too many contact requests from this IP, please try again later'
});

// Contact form submission
app.post('/contactt', contactLimiter, [
  body('name').trim().notEmpty().withMessage('Name is required').escape(),
  body('email').trim().isEmail().withMessage('Valid email is required').normalizeEmail(),
  body('phone').optional().trim().isMobilePhone().withMessage('Valid phone number required'),
  body('subject').trim().notEmpty().withMessage('Subject is required').escape(),
  body('message').trim().notEmpty().withMessage('Message is required').customSanitizer(value => {
    return sanitizeHtml(value, {
      allowedTags: [],
      allowedAttributes: {}
    });
  }),
  body('orderNumber').optional().trim().escape()
], async (req, res) => {
  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ 
        success: false, 
        message: 'Validation errors',
        errors: errors.array() 
      });
    }

    const { name, email, phone, subject, message, orderNumber } = req.body;
    
    const newContact = new Contact({
      name,
      email,
      phone: phone || null,
      subject,
      message,
      orderNumber: subject.toLowerCase() === 'order' ? orderNumber : null,
      dateSubmitted: new Date(),
      status: 'new',
      ipAddress: req.ip
    });
    
    await newContact.save();
    
    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data: {
        id: newContact._id,
        dateSubmitted: newContact.dateSubmitted
      }
    });
  } catch (error) {
    console.error('Error saving contact form:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Get all contacts with pagination and filtering
app.get('/contacts', async (req, res) => {
  try {
    const { status, search, page = 1, limit = 10 } = req.query;
    
    const query = {};
    
    if (status && ['new', 'in-progress', 'resolved'].includes(status)) {
      query.status = status;
    }
    
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { subject: searchRegex },
        { message: searchRegex }
      ];
    }
    
    const options = {
      sort: { dateSubmitted: -1 },
      skip: (page - 1) * limit,
      limit: parseInt(limit),
      lean: true
    };
    
    const [contacts, total] = await Promise.all([
      Contact.find(query, null, options),
      Contact.countDocuments(query)
    ]);
    
    res.json({ 
      success: true, 
      data: contacts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching contacts:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Update contact status or notes
app.patch('/contacts/:id', [
  body('status').optional().isIn(['new', 'in-progress', 'resolved']),
  body('notes').optional().trim().escape()
], async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;
    
    if (!status && !notes) {
      return res.status(400).json({ 
        success: false, 
        message: 'Either status or notes must be provided' 
      });
    }
    
    const update = {};
    if (status) update.status = status;
    if (notes) update.notes = notes;
    
    const updatedContact = await Contact.findByIdAndUpdate(
      id,
      { $set: update },
      { new: true, runValidators: true }
    );
    
    if (!updatedContact) {
      return res.status(404).json({ 
        success: false, 
        message: 'Contact not found' 
      });
    }
    
    res.json({ 
      success: true, 
      message: 'Contact updated successfully',
      data: updatedContact
    });
  } catch (error) {
    console.error('Error updating contact:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Internal server error'
    });
  }
});

module.exports = app;