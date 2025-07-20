import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { FileText, AlertCircle, CheckCircle } from 'lucide-react';

const ReportForm = () => {
  const navigate = useNavigate();
  const [categories, setCategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [reportData, setReportData] = useState({});

  const [formData, setFormData] = useState({
    category: '',
    subcategory: '',
    title: '',
    description: '',
    location: '',
    date_incident: '',
    time_incident: '',
    severity: 'medium'
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/reports/categories');
      setCategories(response.data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Reset subcategory when category changes
    if (name === 'category') {
      setFormData(prev => ({
        ...prev,
        subcategory: ''
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('/api/reports/submit', formData);
      
      if (response.data.success) {
        setReportData(response.data);
        setSubmitted(true);
        toast.success('Report submitted successfully!');
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to submit report');
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-2xl mx-auto">
          <div className="card text-center">
            <div className="flex justify-center mb-6">
              <CheckCircle size={64} className="text-blue" />
            </div>
            <h1 className="text-3xl font-bold text-gradient mb-4">
              Report Submitted Successfully!
            </h1>
            <p className="text-blue mb-8">
              Your report has been submitted anonymously. Please save your tracking information below.
            </p>
            
            <div className="bg-opacity-20 bg-blue-900 p-6 rounded-lg mb-6">
              <h3 className="font-semibold text-lg mb-4 text-gradient">Your Tracking Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-blue mb-1">
                    Report ID
                  </label>
                  <div className="bg-opacity-20 bg-purple-900 p-3 border rounded font-mono text-lg font-bold text-blue">
                    {reportData.reportId}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-purple mb-1">
                    Passcode
                  </label>
                  <div className="bg-opacity-20 bg-blue-900 p-3 border rounded font-mono text-lg font-bold text-purple">
                    {reportData.passcode}
                  </div>
                </div>
              </div>
            </div>

            <div className="alert alert-info">
              <AlertCircle className="inline mr-2" size={16} />
              <strong>Important:</strong> Please save this information securely. You'll need both the Report ID and Passcode to track your report status.
            </div>

            <div className="mt-8 flex gap-4 justify-center">
              <button
                onClick={() => navigate('/track')}
                className="btn btn-primary"
              >
                Track My Report
              </button>
              <button
                onClick={() => {
                  setSubmitted(false);
                  setFormData({
                    category: '',
                    subcategory: '',
                    title: '',
                    description: '',
                    location: '',
                    date_incident: '',
                    time_incident: '',
                    severity: 'medium'
                  });
                }}
                className="btn btn-outline"
              >
                Submit Another Report
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-2xl mx-auto">
        <div className="card">
          <div className="card-header text-center">
            <div className="flex justify-center mb-4">
              <FileText size={48} className="text-blue" />
            </div>
            <h1 className="card-title text-gradient">Submit Anonymous Report</h1>
            <p className="text-blue">
              Your identity will remain completely anonymous. All reports are reviewed by campus authorities.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Category *</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="form-select"
                  required
                >
                  <option value="">Select Category</option>
                  {Object.entries(categories).map(([key, category]) => (
                    <option key={key} value={key}>
                      {category.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Subcategory</label>
                <select
                  name="subcategory"
                  value={formData.subcategory}
                  onChange={handleInputChange}
                  className="form-select"
                  disabled={!formData.category}
                >
                  <option value="">Select Subcategory</option>
                  {formData.category && categories[formData.category]?.subcategories.map(sub => (
                    <option key={sub} value={sub}>
                      {sub}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Title *</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="form-input"
                placeholder="Brief title for your report"
                required
                minLength={5}
              />
            </div>

            <div className="form-group">
              <label className="form-label">Description *</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="form-textarea"
                placeholder="Provide detailed description of the incident or concern..."
                required
                minLength={10}
                rows={6}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="form-input"
                  placeholder="Building, room, or area"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Date of Incident</label>
                <input
                  type="date"
                  name="date_incident"
                  value={formData.date_incident}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label className="form-label">Time of Incident</label>
                <input
                  type="time"
                  name="time_incident"
                  value={formData.time_incident}
                  onChange={handleInputChange}
                  className="form-input"
                />
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">Severity Level</label>
              <select
                name="severity"
                value={formData.severity}
                onChange={handleInputChange}
                className="form-select"
              >
                <option value="low">Low - Minor issue</option>
                <option value="medium">Medium - Moderate concern</option>
                <option value="high">High - Serious issue</option>
                <option value="critical">Critical - Emergency situation</option>
              </select>
            </div>

            <div className="alert alert-info mb-6">
              <AlertCircle className="inline mr-2" size={16} />
              <strong>Privacy Notice:</strong> This report is completely anonymous. No personal information is collected or stored.
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary btn-lg flex-1"
              >
                {loading ? 'Submitting...' : 'Submit Report'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReportForm; 