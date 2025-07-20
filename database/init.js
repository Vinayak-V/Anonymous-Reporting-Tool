const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const bcrypt = require('bcryptjs');

const dbPath = path.join(__dirname, 'reports.db');
const db = new sqlite3.Database(dbPath);

const initializeDatabase = async () => {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create users table for authority login
      db.run(`
        CREATE TABLE IF NOT EXISTS users (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          username TEXT UNIQUE NOT NULL,
          password TEXT NOT NULL,
          full_name TEXT NOT NULL,
          role TEXT NOT NULL DEFAULT 'authority',
          department TEXT,
          email TEXT UNIQUE NOT NULL,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
      `);

      // Create reports table
      db.run(`
        CREATE TABLE IF NOT EXISTS reports (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          report_id TEXT UNIQUE NOT NULL,
          passcode TEXT NOT NULL,
          category TEXT NOT NULL,
          subcategory TEXT,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          location TEXT,
          date_incident DATE,
          time_incident TIME,
          severity TEXT DEFAULT 'medium',
          status TEXT DEFAULT 'pending',
          assigned_to INTEGER,
          assigned_by INTEGER,
          assigned_at DATETIME,
          escalated_to INTEGER,
          escalated_by INTEGER,
          escalated_at DATETIME,
          response TEXT,
          response_by INTEGER,
          response_at DATETIME,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (assigned_to) REFERENCES users (id),
          FOREIGN KEY (assigned_by) REFERENCES users (id),
          FOREIGN KEY (escalated_to) REFERENCES users (id),
          FOREIGN KEY (escalated_by) REFERENCES users (id),
          FOREIGN KEY (response_by) REFERENCES users (id)
        )
      `);

      // Create report_attachments table for file uploads
      db.run(`
        CREATE TABLE IF NOT EXISTS report_attachments (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          report_id INTEGER NOT NULL,
          filename TEXT NOT NULL,
          file_path TEXT NOT NULL,
          file_size INTEGER,
          mime_type TEXT,
          uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (report_id) REFERENCES reports (id)
        )
      `);

      // Create report_history table for tracking changes
      db.run(`
        CREATE TABLE IF NOT EXISTS report_history (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          report_id INTEGER NOT NULL,
          action TEXT NOT NULL,
          old_value TEXT,
          new_value TEXT,
          changed_by INTEGER,
          changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          FOREIGN KEY (report_id) REFERENCES reports (id),
          FOREIGN KEY (changed_by) REFERENCES users (id)
        )
      `);

      // Insert default admin user
      const defaultPassword = 'admin123';
      bcrypt.hash(defaultPassword, 10, (err, hash) => {
        if (err) {
          console.error('Error hashing password:', err);
          reject(err);
          return;
        }

        db.run(`
          INSERT OR IGNORE INTO users (username, password, full_name, role, department, email)
          VALUES (?, ?, ?, ?, ?, ?)
        `, ['admin', hash, 'System Administrator', 'admin', 'IT', 'admin@campus.edu'], (err) => {
          if (err) {
            console.error('Error creating default admin:', err);
            reject(err);
          } else {
            console.log('Database initialized successfully');
            console.log('Default admin credentials:');
            console.log('Username: admin');
            console.log('Password: admin123');
            resolve();
          }
        });
      });
    });
  });
};

const getDatabase = () => {
  return db;
};

module.exports = {
  initializeDatabase,
  getDatabase
}; 