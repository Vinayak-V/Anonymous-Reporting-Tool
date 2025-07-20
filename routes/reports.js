const express = require('express');
const { v4: uuidv4 } = require('uuid');
const { getDatabase } = require('../database/init');

const router = express.Router();

// Submit anonymous report
router.post('/submit', async (req, res) => {
  try {
    const {
      category,
      subcategory,
      title,
      description,
      location,
      date_incident,
      time_incident,
      severity
    } = req.body;

    // Validation
    if (!category || !title || !description) {
      return res.status(400).json({
        success: false,
        message: 'Category, title, and description are required'
      });
    }

    if (title.length < 5 || description.length < 10) {
      return res.status(400).json({
        success: false,
        message: 'Title must be at least 5 characters and description at least 10 characters'
      });
    }

    // Generate unique report ID and passcode
    const reportId = `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 5).toUpperCase()}`;
    const passcode = Math.random().toString(36).substr(2, 8).toUpperCase();

    const db = getDatabase();
    
    db.run(`
      INSERT INTO reports (
        report_id, passcode, category, subcategory, title, description,
        location, date_incident, time_incident, severity
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      reportId, passcode, category, subcategory || null, title, description,
      location || null, date_incident || null, time_incident || null, severity || 'medium'
    ], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Failed to submit report'
        });
      }

      // Log the action in history
      db.run(`
        INSERT INTO report_history (report_id, action, new_value, changed_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `, [this.lastID, 'created', 'Report submitted']);

      res.json({
        success: true,
        message: 'Report submitted successfully',
        reportId,
        passcode,
        instructions: 'Please save your Report ID and Passcode to track your report status'
      });
    });
  } catch (error) {
    console.error('Submit report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get report categories
router.get('/categories', (req, res) => {
  const categories = {
    'academic': {
      name: 'Academic Issues',
      subcategories: [
        'Grade Dispute',
        'Plagiarism',
        'Academic Misconduct',
        'Course Registration',
        'Faculty Conduct',
        'Other Academic'
      ]
    },
    'facilities': {
      name: 'Facilities & Infrastructure',
      subcategories: [
        'Building Maintenance',
        'Equipment Issues',
        'Safety Hazards',
        'Accessibility',
        'Cleaning',
        'Other Facilities'
      ]
    },
    'security': {
      name: 'Security & Safety',
      subcategories: [
        'Theft',
        'Vandalism',
        'Harassment',
        'Violence',
        'Suspicious Activity',
        'Other Security'
      ]
    },
    'student_life': {
      name: 'Student Life',
      subcategories: [
        'Housing Issues',
        'Food Services',
        'Transportation',
        'Student Organizations',
        'Events',
        'Other Student Life'
      ]
    },
    'technology': {
      name: 'Technology Issues',
      subcategories: [
        'WiFi Problems',
        'Computer Labs',
        'Software Issues',
        'Online Services',
        'IT Support',
        'Other Technology'
      ]
    },
    'other': {
      name: 'Other',
      subcategories: [
        'General Complaint',
        'Suggestion',
        'Feedback',
        'Other'
      ]
    }
  };

  res.json({
    success: true,
    categories
  });
});

// Get report statistics (for dashboard)
router.get('/stats', (req, res) => {
  const db = getDatabase();
  
  const stats = {};
  
  // Total reports
  db.get('SELECT COUNT(*) as total FROM reports', (err, result) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({
        success: false,
        message: 'Database error occurred'
      });
    }
    
    stats.total = result.total;
    
    // Reports by status
    db.all(`
      SELECT status, COUNT(*) as count 
      FROM reports 
      GROUP BY status
    `, (err, statusResults) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }
      
      stats.byStatus = statusResults;
      
      // Reports by category
      db.all(`
        SELECT category, COUNT(*) as count 
        FROM reports 
        GROUP BY category
      `, (err, categoryResults) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error occurred'
          });
        }
        
        stats.byCategory = categoryResults;
        
        // Recent reports (last 7 days)
        db.get(`
          SELECT COUNT(*) as count 
          FROM reports 
          WHERE created_at >= datetime('now', '-7 days')
        `, (err, recentResult) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({
              success: false,
              message: 'Database error occurred'
            });
          }
          
          stats.recent = recentResult.count;
          
          res.json({
            success: true,
            stats
          });
        });
      });
    });
  });
});

module.exports = router; 