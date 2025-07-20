# Campus Anonymous Reporting Platform

A comprehensive web application that allows students to submit anonymous complaints and concerns, with a complete management system for campus authorities to track, categorize, and respond to reports.

## Features

### For Students
- **Anonymous Report Submission**: Submit reports without revealing identity
- **Comprehensive Categorization**: Academic, Facilities, Security, Student Life, Technology, and Other categories
- **Real-time Tracking**: Track report status using unique Report ID and passcode
- **Detailed Status Updates**: View complete history and responses from authorities

### For Campus Authorities
- **Secure Login System**: JWT-based authentication for authorized staff
- **Dashboard Overview**: Statistics and overview of all reports
- **Advanced Filtering**: Filter reports by status, category, severity, and search terms
- **Report Management**: 
  - Update report status
  - Assign reports to specific staff members
  - Escalate reports to higher authorities
  - Add responses to reports
- **Complete Audit Trail**: Track all changes and actions taken on reports

## Technology Stack

### Backend
- **Node.js** with Express.js
- **SQLite** database for data persistence
- **JWT** for authentication
- **bcryptjs** for password hashing
- **Helmet** and rate limiting for security

### Frontend
- **React.js** with functional components and hooks
- **React Router** for navigation
- **Axios** for API communication
- **Lucide React** for icons
- **React Hot Toast** for notifications
- **Custom CSS** with utility classes

## Installation & Setup

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Backend Setup
1. Install dependencies:
```bash
npm install
```

2. Start the server:
```bash
# Development mode
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:5000`

### Frontend Setup
1. Navigate to the client directory:
```bash
cd client
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

The React app will start on `http://localhost:3000`

### Database Setup
The database is automatically initialized when you first start the server. A default admin user is created with:
- **Username**: admin
- **Password**: admin123

## Usage Guide

### For Students

1. **Submit a Report**
   - Visit the homepage and click "Submit Report"
   - Fill out the form with your concern details
   - Select appropriate category and subcategory
   - Set severity level
   - Submit the report
   - **Important**: Save your Report ID and Passcode

2. **Track Your Report**
   - Click "Track Report" in the navigation
   - Enter your Report ID and Passcode
   - View current status, updates, and responses

### For Campus Authorities

1. **Login**
   - Click "Authority Login" in the navigation
   - Use your credentials to access the dashboard

2. **Dashboard Overview**
   - View statistics and recent reports
   - Use filters to find specific reports
   - Click "View" to see report details

3. **Manage Reports**
   - Update report status
   - Assign reports to staff members
   - Escalate reports when necessary
   - Add responses to communicate with students

## API Endpoints

### Authentication
- `POST /api/auth/login` - Authority login
- `GET /api/auth/me` - Get current user info
- `GET /api/auth/users` - Get all users for assignment

### Reports
- `POST /api/reports/submit` - Submit anonymous report
- `GET /api/reports/categories` - Get report categories
- `GET /api/reports/stats` - Get report statistics

### Tracking
- `POST /api/tracking/status` - Track report status
- `GET /api/tracking/status-options` - Get status options

### Dashboard (Protected)
- `GET /api/dashboard/reports` - Get all reports with filtering
- `GET /api/dashboard/reports/:id` - Get single report details
- `PATCH /api/dashboard/reports/:id/status` - Update report status
- `PATCH /api/dashboard/reports/:id/assign` - Assign report
- `PATCH /api/dashboard/reports/:id/escalate` - Escalate report
- `PATCH /api/dashboard/reports/:id/respond` - Add response

## Database Schema

### Users Table
- Authority accounts for managing reports
- Includes roles, departments, and contact information

### Reports Table
- Anonymous reports with categorization
- Status tracking and assignment information
- Response and escalation tracking

### Report History Table
- Complete audit trail of all actions
- Tracks who made changes and when

### Report Attachments Table
- Support for file uploads (future feature)

## Security Features

- **Anonymous Reporting**: No personal information collected
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for secure password storage
- **Rate Limiting**: Prevents abuse and spam
- **Input Validation**: Server-side validation of all inputs
- **SQL Injection Protection**: Parameterized queries
- **CORS Configuration**: Proper cross-origin resource sharing

## Deployment

### Production Setup
1. Set environment variables:
   - `NODE_ENV=production`
   - `JWT_SECRET=your-secure-secret-key`
   - `PORT=5000` (or your preferred port)

2. Build the React app:
```bash
cd client
npm run build
```

3. Start the production server:
```bash
npm start
```

The application will serve the React build files and API from the same server.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support or questions, please contact the development team or create an issue in the repository.

---

**Note**: This is a demonstration platform. For production use, ensure proper security measures, data backup strategies, and compliance with relevant privacy laws and regulations. 