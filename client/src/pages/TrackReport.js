import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { Search, Clock, User, MessageSquare, AlertCircle } from 'lucide-react';

const TrackReport = () => {
  const [reportId, setReportId] = useState('');
  const [passcode, setPasscode] = useState('');
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState(null);
  const [statusOptions, setStatusOptions] = useState([]);

  useEffect(() => {
    fetchStatusOptions();
  }, []);

  const fetchStatusOptions = async () => {
    try {
      const response = await axios.get('/api/tracking/status-options');
      setStatusOptions(response.data.statusOptions);
    } catch (error) {
      console.error('Error fetching status options:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!reportId || !passcode) {
      toast.error('Please enter both Report ID and Passcode');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/tracking/status', {
        reportId,
        passcode
      });

      if (response.data.success) {
        setReport(response.data.report);
        toast.success('Report found!');
      }
    } catch (error) {
      console.error('Track error:', error);
      toast.error(error.response?.data?.message || 'Failed to find report');
      setReport(null);
    } finally {
      setLoading(false);
    }
  };

  const getStatusInfo = (status) => {
    return statusOptions.find(option => option.value === status) || {
      label: status,
      description: 'Status information not available',
      color: '#6b7280'
    };
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (report) {
    const statusInfo = getStatusInfo(report.status);
    
    return (
      <div className="container mx-auto p-8">
        <div className="max-w-4xl mx-auto">
          <div className="card">
            <div className="card-header">
              <div className="flex items-center justify-between">
                <h1 className="card-title text-gradient">Report Status</h1>
                <button
                  onClick={() => {
                    setReport(null);
                    setReportId('');
                    setPasscode('');
                  }}
                  className="btn btn-outline btn-sm"
                >
                  Track Another Report
                </button>
              </div>
            </div>

            {/* Report Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="font-semibold text-lg mb-4 text-blue">Report Information</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-blue">Report ID</label>
                    <p className="font-mono font-bold text-purple">{report.reportId}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple">Title</label>
                    <p className="font-semibold text-blue">{report.title}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue">Category</label>
                    <p className="text-purple">{report.category} {report.subcategory && `- ${report.subcategory}`}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple">Severity</label>
                    <p className="capitalize text-blue">{report.severity}</p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-lg mb-4 text-gradient">Current Status</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-medium text-blue">Status</label>
                    <div className="flex items-center gap-2">
                      <span 
                        className="badge"
                        style={{ backgroundColor: statusInfo.color + '20', color: statusInfo.color }}
                      >
                        {statusInfo.label}
                      </span>
                    </div>
                    <p className="text-sm text-purple mt-1">{statusInfo.description}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-purple">Submitted</label>
                    <p className="text-blue">{formatDate(report.createdAt)}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-blue">Last Updated</label>
                    <p className="text-purple">{formatDate(report.updatedAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Report Details */}
            <div className="mb-6">
              <h3 className="font-semibold text-lg mb-3 text-blue">Report Details</h3>
              <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg">
                <p className="whitespace-pre-wrap text-purple">{report.description}</p>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              {report.location && (
                <div>
                  <label className="text-sm font-medium text-blue">Location</label>
                  <p className="text-purple">{report.location}</p>
                </div>
              )}
              {report.dateIncident && (
                <div>
                  <label className="text-sm font-medium text-purple">Date of Incident</label>
                  <p className="text-blue">{report.dateIncident}</p>
                </div>
              )}
              {report.timeIncident && (
                <div>
                  <label className="text-sm font-medium text-blue">Time of Incident</label>
                  <p className="text-purple">{report.timeIncident}</p>
                </div>
              )}
            </div>

            {/* Assignment Information */}
            {(report.assignedTo || report.escalatedTo) && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-gradient">Assignment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.assignedTo && (
                    <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-blue" />
                        <span className="font-medium text-blue">Assigned To</span>
                      </div>
                      <p className="text-purple">{report.assignedTo}</p>
                    </div>
                  )}
                  {report.escalatedTo && (
                    <div className="bg-opacity-20 bg-purple-900 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle size={16} className="text-purple" />
                        <span className="font-medium text-purple">Escalated To</span>
                      </div>
                      <p className="text-blue">{report.escalatedTo}</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response */}
            {report.response && (
              <div className="mb-6">
                <h3 className="font-semibold text-lg mb-3 text-blue">Response</h3>
                <div className="bg-opacity-20 bg-gradient-to-r from-blue-900 to-purple-900 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-gradient" />
                    <span className="font-medium text-gradient">Response from {report.responseBy}</span>
                  </div>
                  <p className="whitespace-pre-wrap text-purple">{report.response}</p>
                  {report.responseAt && (
                    <p className="text-sm text-blue mt-2">
                      Responded on {formatDate(report.responseAt)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            {report.history && report.history.length > 0 && (
              <div>
                <h3 className="font-semibold text-lg mb-3 text-gradient">Report History</h3>
                <div className="space-y-3">
                  {report.history.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-opacity-20 bg-blue-900 rounded-lg">
                      <Clock size={16} className="text-blue mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium capitalize text-purple">{entry.action.replace('_', ' ')}</p>
                        {entry.newValue && (
                          <p className="text-sm text-blue">{entry.newValue}</p>
                        )}
                        <p className="text-xs text-gradient mt-1">
                          {formatDate(entry.changedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-md mx-auto">
        <div className="card">
          <div className="card-header text-center">
            <div className="flex justify-center mb-4">
              <Search size={48} className="text-blue-600" />
            </div>
            <h1 className="card-title">Track Your Report</h1>
            <p className="text-gray-600">
              Enter your Report ID and Passcode to check the status of your report.
            </p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Report ID *</label>
              <input
                type="text"
                value={reportId}
                onChange={(e) => setReportId(e.target.value)}
                className="form-input"
                placeholder="e.g., RPT-1234567890-ABC12"
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Passcode *</label>
              <input
                type="text"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="form-input"
                placeholder="e.g., ABC12345"
                required
              />
            </div>

            <div className="alert alert-info mb-6">
              <AlertCircle className="inline mr-2" size={16} />
              <strong>Note:</strong> You received these credentials when you submitted your report.
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn btn-primary btn-lg w-full"
            >
              {loading ? 'Searching...' : 'Track Report'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default TrackReport; 