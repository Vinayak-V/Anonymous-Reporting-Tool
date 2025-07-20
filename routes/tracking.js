const express = require('express');
const { getDatabase } = require('../database/init');

const router = express.Router();

// Track report status
router.post('/status', (req, res) => {
  try {
    const { reportId, passcode } = req.body;

    if (!reportId || !passcode) {
      return res.status(400).json({
        success: false,
        message: 'Report ID and passcode are required'
      });
    }

    const db = getDatabase();
    
    db.get(`
      SELECT 
        r.*,
        u1.full_name as assigned_to_name,
        u2.full_name as escalated_to_name,
        u3.full_name as response_by_name
      FROM reports r
      LEFT JOIN users u1 ON r.assigned_to = u1.id
      LEFT JOIN users u2 ON r.escalated_to = u2.id
      LEFT JOIN users u3 ON r.response_by = u3.id
      WHERE r.report_id = ? AND r.passcode = ?
    `, [reportId, passcode], (err, report) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (!report) {
        return res.status(404).json({
          success: false,
          message: 'Report not found or invalid passcode'
        });
      }

      // Get report history
      db.all(`
        SELECT 
          action,
          old_value,
          new_value,
          changed_at
        FROM report_history 
        WHERE report_id = ? 
        ORDER BY changed_at DESC
      `, [report.id], (err, history) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error occurred'
          });
        }

        // Format the response
        const statusInfo = {
          reportId: report.report_id,
          title: report.title,
          category: report.category,
          subcategory: report.subcategory,
          status: report.status,
          severity: report.severity,
          description: report.description,
          location: report.location,
          dateIncident: report.date_incident,
          timeIncident: report.time_incident,
          createdAt: report.created_at,
          updatedAt: report.updated_at,
          assignedTo: report.assigned_to_name,
          escalatedTo: report.escalated_to_name,
          response: report.response,
          responseBy: report.response_by_name,
          responseAt: report.response_at,
          history: history.map(h => ({
            action: h.action,
            oldValue: h.old_value,
            newValue: h.new_value,
            changedAt: h.changed_at
          }))
        };

        res.json({
          success: true,
          report: statusInfo
        });
      });
    });
  } catch (error) {
    console.error('Track status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get status options for display
router.get('/status-options', (req, res) => {
  const statusOptions = [
    {
      value: 'pending',
      label: 'Pending Review',
      description: 'Your report has been submitted and is awaiting review',
      color: '#f59e0b'
    },
    {
      value: 'under_review',
      label: 'Under Review',
      description: 'Your report is currently being reviewed by authorities',
      color: '#3b82f6'
    },
    {
      value: 'assigned',
      label: 'Assigned',
      description: 'Your report has been assigned to a staff member',
      color: '#8b5cf6'
    },
    {
      value: 'in_progress',
      label: 'In Progress',
      description: 'Action is being taken on your report',
      color: '#10b981'
    },
    {
      value: 'escalated',
      label: 'Escalated',
      description: 'Your report has been escalated to higher authorities',
      color: '#ef4444'
    },
    {
      value: 'resolved',
      label: 'Resolved',
      description: 'Your report has been resolved',
      color: '#059669'
    },
    {
      value: 'closed',
      label: 'Closed',
      description: 'Your report has been closed',
      color: '#6b7280'
    }
  ];

  res.json({
    success: true,
    statusOptions
  });
});

module.exports = router; 