const express = require('express');
const { getDatabase } = require('../database/init');
const { verifyToken } = require('./auth');

const router = express.Router();

// Get all reports with filtering and pagination
router.get('/reports', verifyToken, (req, res) => {
  try {
    const {
      page = 1,
      limit = 10,
      status,
      category,
      severity,
      assigned_to,
      search
    } = req.query;

    const offset = (page - 1) * limit;
    const db = getDatabase();

    let whereConditions = [];
    let params = [];

    if (status) {
      whereConditions.push('r.status = ?');
      params.push(status);
    }

    if (category) {
      whereConditions.push('r.category = ?');
      params.push(category);
    }

    if (severity) {
      whereConditions.push('r.severity = ?');
      params.push(severity);
    }

    if (assigned_to) {
      whereConditions.push('r.assigned_to = ?');
      params.push(assigned_to);
    }

    if (search) {
      whereConditions.push('(r.title LIKE ? OR r.description LIKE ? OR r.report_id LIKE ?)');
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    const whereClause = whereConditions.length > 0 ? 'WHERE ' + whereConditions.join(' AND ') : '';

    // Get total count
    db.get(`
      SELECT COUNT(*) as total 
      FROM reports r 
      ${whereClause}
    `, params, (err, countResult) => {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      // Get reports
      db.all(`
        SELECT 
          r.*,
          u1.full_name as assigned_to_name,
          u2.full_name as escalated_to_name,
          u3.full_name as response_by_name
        FROM reports r
        LEFT JOIN users u1 ON r.assigned_to = u1.id
        LEFT JOIN users u2 ON r.escalated_to = u2.id
        LEFT JOIN users u3 ON r.response_by = u3.id
        ${whereClause}
        ORDER BY r.created_at DESC
        LIMIT ? OFFSET ?
      `, [...params, parseInt(limit), offset], (err, reports) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error occurred'
          });
        }

        res.json({
          success: true,
          reports,
          pagination: {
            page: parseInt(page),
            limit: parseInt(limit),
            total: countResult.total,
            pages: Math.ceil(countResult.total / limit)
          }
        });
      });
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Get single report details
router.get('/reports/:reportId', verifyToken, (req, res) => {
  try {
    const { reportId } = req.params;
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
      WHERE r.report_id = ?
    `, [reportId], (err, report) => {
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
          message: 'Report not found'
        });
      }

      // Get report history
      db.all(`
        SELECT 
          action,
          old_value,
          new_value,
          changed_at,
          u.full_name as changed_by_name
        FROM report_history rh
        LEFT JOIN users u ON rh.changed_by = u.id
        WHERE rh.report_id = ? 
        ORDER BY rh.changed_at DESC
      `, [report.id], (err, history) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({
            success: false,
            message: 'Database error occurred'
          });
        }

        res.json({
          success: true,
          report: {
            ...report,
            history: history.map(h => ({
              action: h.action,
              oldValue: h.old_value,
              newValue: h.new_value,
              changedAt: h.changed_at,
              changedBy: h.changed_by_name
            }))
          }
        });
      });
    });
  } catch (error) {
    console.error('Get report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Update report status
router.patch('/reports/:reportId/status', verifyToken, (req, res) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!status) {
      return res.status(400).json({
        success: false,
        message: 'Status is required'
      });
    }

    const validStatuses = ['pending', 'under_review', 'assigned', 'in_progress', 'escalated', 'resolved', 'closed'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const db = getDatabase();

    db.run(`
      UPDATE reports 
      SET status = ?, updated_at = CURRENT_TIMESTAMP 
      WHERE report_id = ?
    `, [status, reportId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Log the action
      db.run(`
        INSERT INTO report_history (report_id, action, old_value, new_value, changed_by, changed_at)
        VALUES ((SELECT id FROM reports WHERE report_id = ?), ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [reportId, 'status_updated', '', status, req.user.userId]);

      res.json({
        success: true,
        message: 'Status updated successfully'
      });
    });
  } catch (error) {
    console.error('Update status error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Assign report to staff
router.patch('/reports/:reportId/assign', verifyToken, (req, res) => {
  try {
    const { reportId } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'Assigned to user ID is required'
      });
    }

    const db = getDatabase();

    db.run(`
      UPDATE reports 
      SET assigned_to = ?, assigned_by = ?, assigned_at = CURRENT_TIMESTAMP, 
          status = 'assigned', updated_at = CURRENT_TIMESTAMP 
      WHERE report_id = ?
    `, [assignedTo, req.user.userId, reportId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Log the action
      db.run(`
        INSERT INTO report_history (report_id, action, old_value, new_value, changed_by, changed_at)
        VALUES ((SELECT id FROM reports WHERE report_id = ?), ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [reportId, 'assigned', '', assignedTo, req.user.userId]);

      res.json({
        success: true,
        message: 'Report assigned successfully'
      });
    });
  } catch (error) {
    console.error('Assign report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Escalate report
router.patch('/reports/:reportId/escalate', verifyToken, (req, res) => {
  try {
    const { reportId } = req.params;
    const { escalatedTo } = req.body;

    if (!escalatedTo) {
      return res.status(400).json({
        success: false,
        message: 'Escalated to user ID is required'
      });
    }

    const db = getDatabase();

    db.run(`
      UPDATE reports 
      SET escalated_to = ?, escalated_by = ?, escalated_at = CURRENT_TIMESTAMP, 
          status = 'escalated', updated_at = CURRENT_TIMESTAMP 
      WHERE report_id = ?
    `, [escalatedTo, req.user.userId, reportId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Log the action
      db.run(`
        INSERT INTO report_history (report_id, action, old_value, new_value, changed_by, changed_at)
        VALUES ((SELECT id FROM reports WHERE report_id = ?), ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [reportId, 'escalated', '', escalatedTo, req.user.userId]);

      res.json({
        success: true,
        message: 'Report escalated successfully'
      });
    });
  } catch (error) {
    console.error('Escalate report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

// Respond to report
router.patch('/reports/:reportId/respond', verifyToken, (req, res) => {
  try {
    const { reportId } = req.params;
    const { response } = req.body;

    if (!response) {
      return res.status(400).json({
        success: false,
        message: 'Response is required'
      });
    }

    const db = getDatabase();

    db.run(`
      UPDATE reports 
      SET response = ?, response_by = ?, response_at = CURRENT_TIMESTAMP, 
          updated_at = CURRENT_TIMESTAMP 
      WHERE report_id = ?
    `, [response, req.user.userId, reportId], function(err) {
      if (err) {
        console.error('Database error:', err);
        return res.status(500).json({
          success: false,
          message: 'Database error occurred'
        });
      }

      if (this.changes === 0) {
        return res.status(404).json({
          success: false,
          message: 'Report not found'
        });
      }

      // Log the action
      db.run(`
        INSERT INTO report_history (report_id, action, old_value, new_value, changed_by, changed_at)
        VALUES ((SELECT id FROM reports WHERE report_id = ?), ?, ?, ?, ?, CURRENT_TIMESTAMP)
      `, [reportId, 'responded', '', 'Response added', req.user.userId]);

      res.json({
        success: true,
        message: 'Response added successfully'
      });
    });
  } catch (error) {
    console.error('Respond to report error:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
});

module.exports = router; 