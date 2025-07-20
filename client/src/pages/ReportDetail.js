import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  ArrowLeft, 
  Clock, 
  User, 
  MessageSquare, 
  AlertTriangle,
  Edit,
  Send
} from 'lucide-react';

const ReportDetail = () => {
  const { reportId } = useParams();
  const navigate = useNavigate();
  const [report, setReport] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showResponseForm, setShowResponseForm] = useState(false);
  const [response, setResponse] = useState('');

  useEffect(() => {
    fetchReport();
    fetchUsers();
  }, [reportId]);

  const fetchReport = async () => {
    try {
      const response = await axios.get(`/api/dashboard/reports/${reportId}`);
      if (response.data.success) {
        setReport(response.data.report);
      }
    } catch (error) {
      console.error('Error fetching report:', error);
      toast.error('Failed to load report');
      navigate('/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/auth/users');
      if (response.data.success) {
        setUsers(response.data.users);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setActionLoading(true);
    try {
      const response = await axios.patch(`/api/dashboard/reports/${reportId}/status`, {
        status: newStatus
      });
      
      if (response.data.success) {
        toast.success('Status updated successfully');
        fetchReport();
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('Failed to update status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleAssign = async (userId) => {
    setActionLoading(true);
    try {
      const response = await axios.patch(`/api/dashboard/reports/${reportId}/assign`, {
        assignedTo: userId
      });
      
      if (response.data.success) {
        toast.success('Report assigned successfully');
        fetchReport();
      }
    } catch (error) {
      console.error('Error assigning report:', error);
      toast.error('Failed to assign report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEscalate = async (userId) => {
    setActionLoading(true);
    try {
      const response = await axios.patch(`/api/dashboard/reports/${reportId}/escalate`, {
        escalatedTo: userId
      });
      
      if (response.data.success) {
        toast.success('Report escalated successfully');
        fetchReport();
      }
    } catch (error) {
      console.error('Error escalating report:', error);
      toast.error('Failed to escalate report');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResponse = async (e) => {
    e.preventDefault();
    if (!response.trim()) {
      toast.error('Please enter a response');
      return;
    }

    setActionLoading(true);
    try {
      const responseData = await axios.patch(`/api/dashboard/reports/${reportId}/respond`, {
        response: response.trim()
      });
      
      if (responseData.data.success) {
        toast.success('Response added successfully');
        setResponse('');
        setShowResponseForm(false);
        fetchReport();
      }
    } catch (error) {
      console.error('Error adding response:', error);
      toast.error('Failed to add response');
    } finally {
      setActionLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    const statusClasses = {
      pending: 'badge-pending',
      under_review: 'badge-under-review',
      assigned: 'badge-assigned',
      in_progress: 'badge-in-progress',
      escalated: 'badge-escalated',
      resolved: 'badge-resolved',
      closed: 'badge-closed'
    };
    return statusClasses[status] || 'badge-closed';
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

  if (loading) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 text-blue mx-auto"></div>
          <p className="mt-2 text-blue">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!report) {
    return (
      <div className="container mx-auto p-8">
        <div className="text-center">
          <p className="text-blue">Report not found.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-outline btn-sm"
          >
            <ArrowLeft size={16} className="mr-1" />
            Back to Dashboard
          </button>
          <h1 className="text-2xl font-bold text-gradient">Report Details</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Report Information */}
            <div className="card mb-6">
              <div className="card-header">
                <div className="flex items-center justify-between">
                  <h2 className="card-title text-gradient">{report.title}</h2>
                  <span className={`badge ${getStatusBadge(report.status)}`}>
                    {report.status.replace('_', ' ')}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium text-blue">Report ID</label>
                  <p className="font-mono font-bold text-purple">{report.report_id}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple">Category</label>
                  <p className="text-blue">{report.category} {report.subcategory && `- ${report.subcategory}`}</p>
                </div>
                <div>
                  <label className="text-sm font-medium text-blue">Severity</label>
                  <span className={`badge ${
                    report.severity === 'critical' ? 'badge-escalated' :
                    report.severity === 'high' ? 'badge-under-review' :
                    report.severity === 'medium' ? 'badge-assigned' : 'badge-pending'
                  }`}>
                    {report.severity}
                  </span>
                </div>
                <div>
                  <label className="text-sm font-medium text-purple">Submitted</label>
                  <p className="text-blue">{formatDate(report.created_at)}</p>
                </div>
              </div>

              <div className="mb-4">
                <label className="text-sm font-medium text-blue">Description</label>
                <div className="bg-opacity-20 bg-blue-900 p-4 rounded-lg mt-1">
                  <p className="whitespace-pre-wrap text-purple">{report.description}</p>
                </div>
              </div>

              {(report.location || report.date_incident || report.time_incident) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {report.location && (
                    <div>
                      <label className="text-sm font-medium text-purple">Location</label>
                      <p className="text-blue">{report.location}</p>
                    </div>
                  )}
                  {report.date_incident && (
                    <div>
                      <label className="text-sm font-medium text-blue">Date of Incident</label>
                      <p className="text-purple">{report.date_incident}</p>
                    </div>
                  )}
                  {report.time_incident && (
                    <div>
                      <label className="text-sm font-medium text-purple">Time of Incident</label>
                      <p className="text-blue">{report.time_incident}</p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Assignment Information */}
            {(report.assigned_to_name || report.escalated_to_name) && (
              <div className="card mb-6">
                <h3 className="font-semibold text-lg mb-4">Assignment Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {report.assigned_to_name && (
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <User size={16} className="text-blue-600" />
                        <span className="font-medium">Assigned To</span>
                      </div>
                      <p>{report.assigned_to_name}</p>
                      {report.assigned_at && (
                        <p className="text-sm text-gray-600 mt-1">
                          Assigned on {formatDate(report.assigned_at)}
                        </p>
                      )}
                    </div>
                  )}
                  {report.escalated_to_name && (
                    <div className="bg-red-50 p-4 rounded-lg">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertTriangle size={16} className="text-red-600" />
                        <span className="font-medium">Escalated To</span>
                      </div>
                      <p>{report.escalated_to_name}</p>
                      {report.escalated_at && (
                        <p className="text-sm text-gray-600 mt-1">
                          Escalated on {formatDate(report.escalated_at)}
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Response */}
            {report.response && (
              <div className="card mb-6">
                <h3 className="font-semibold text-lg mb-4">Response</h3>
                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare size={16} className="text-green-600" />
                    <span className="font-medium">Response from {report.response_by_name}</span>
                  </div>
                  <p className="whitespace-pre-wrap">{report.response}</p>
                  {report.response_at && (
                    <p className="text-sm text-gray-600 mt-2">
                      Responded on {formatDate(report.response_at)}
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* History */}
            {report.history && report.history.length > 0 && (
              <div className="card">
                <h3 className="font-semibold text-lg mb-4">Report History</h3>
                <div className="space-y-3">
                  {report.history.map((entry, index) => (
                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                      <Clock size={16} className="text-gray-400 mt-1 flex-shrink-0" />
                      <div className="flex-1">
                        <p className="font-medium capitalize">{entry.action.replace('_', ' ')}</p>
                        {entry.newValue && (
                          <p className="text-sm text-gray-600">{entry.newValue}</p>
                        )}
                        <p className="text-xs text-gray-500 mt-1">
                          {formatDate(entry.changedAt)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Actions Sidebar */}
          <div className="lg:col-span-1">
            <div className="card">
              <h3 className="font-semibold text-lg mb-4">Actions</h3>
              
              {/* Status Update */}
              <div className="mb-6">
                <label className="form-label">Update Status</label>
                <select
                  onChange={(e) => handleStatusUpdate(e.target.value)}
                  disabled={actionLoading}
                  className="form-select mb-2"
                >
                  <option value="">Select Status</option>
                  <option value="pending">Pending</option>
                  <option value="under_review">Under Review</option>
                  <option value="assigned">Assigned</option>
                  <option value="in_progress">In Progress</option>
                  <option value="escalated">Escalated</option>
                  <option value="resolved">Resolved</option>
                  <option value="closed">Closed</option>
                </select>
              </div>

              {/* Assign Report */}
              <div className="mb-6">
                <label className="form-label">Assign To</label>
                <select
                  onChange={(e) => handleAssign(e.target.value)}
                  disabled={actionLoading}
                  className="form-select mb-2"
                >
                  <option value="">Select Staff Member</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Escalate Report */}
              <div className="mb-6">
                <label className="form-label">Escalate To</label>
                <select
                  onChange={(e) => handleEscalate(e.target.value)}
                  disabled={actionLoading}
                  className="form-select mb-2"
                >
                  <option value="">Select Authority</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.full_name} ({user.department})
                    </option>
                  ))}
                </select>
              </div>

              {/* Add Response */}
              <div className="mb-6">
                {!showResponseForm ? (
                  <button
                    onClick={() => setShowResponseForm(true)}
                    className="btn btn-primary w-full"
                  >
                    <MessageSquare size={16} className="mr-2" />
                    Add Response
                  </button>
                ) : (
                  <form onSubmit={handleResponse}>
                    <label className="form-label">Response</label>
                    <textarea
                      value={response}
                      onChange={(e) => setResponse(e.target.value)}
                      className="form-textarea mb-2"
                      placeholder="Enter your response to the student..."
                      rows={4}
                    />
                    <div className="flex gap-2">
                      <button
                        type="submit"
                        disabled={actionLoading}
                        className="btn btn-primary flex-1"
                      >
                        <Send size={16} className="mr-2" />
                        Send Response
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowResponseForm(false);
                          setResponse('');
                        }}
                        className="btn btn-outline"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                )}
              </div>

              {actionLoading && (
                <div className="text-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="text-sm text-gray-600 mt-2">Processing...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportDetail; 