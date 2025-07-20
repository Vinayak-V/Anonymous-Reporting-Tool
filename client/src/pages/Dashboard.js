import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { 
  BarChart3, 
  FileText, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  Search,
  Filter,
  Eye
} from 'lucide-react';

const Dashboard = () => {
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: '',
    category: '',
    severity: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    pages: 0
  });

  useEffect(() => {
    fetchReports();
    fetchStats();
  }, [filters, pagination.page]);

  const fetchReports = async () => {
    try {
      const params = new URLSearchParams({
        page: pagination.page,
        limit: pagination.limit,
        ...filters
      });

      const response = await axios.get(`/api/dashboard/reports?${params}`);
      
      if (response.data.success) {
        setReports(response.data.reports);
        setPagination(response.data.pagination);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      toast.error('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/reports/stats');
      if (response.data.success) {
        setStats(response.data.stats);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setPagination(prev => ({ ...prev, page: 1 }));
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
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
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
          <p className="mt-2 text-blue">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gradient mb-2">Dashboard</h1>
        <p className="text-blue">Manage and respond to student reports</p>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-opacity-20 bg-blue-900 rounded-lg">
              <FileText className="text-blue" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue">Total Reports</p>
              <p className="text-2xl font-bold text-gradient">{stats.total || 0}</p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-opacity-20 bg-purple-900 rounded-lg">
              <Clock className="text-purple" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-purple">Pending</p>
              <p className="text-2xl font-bold text-blue">
                {stats.byStatus?.find(s => s.status === 'pending')?.count || 0}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-opacity-20 bg-gradient-to-r from-blue-900 to-purple-900 rounded-lg">
              <AlertTriangle className="text-gradient" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gradient">Critical</p>
              <p className="text-2xl font-bold text-purple">
                {reports.filter(r => r.severity === 'critical').length}
              </p>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center">
            <div className="p-3 bg-opacity-20 bg-blue-900 rounded-lg">
              <CheckCircle className="text-blue" size={24} />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-blue">Resolved</p>
              <p className="text-2xl font-bold text-gradient">
                {stats.byStatus?.find(s => s.status === 'resolved')?.count || 0}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="card mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Filter size={20} className="text-blue" />
          <h3 className="font-semibold text-gradient">Filters</h3>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          <div className="form-group">
            <label className="form-label text-blue">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue" size={16} />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="form-input pl-10"
                placeholder="Search reports..."
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label text-purple">Status</label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="form-select"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="under_review">Under Review</option>
              <option value="assigned">Assigned</option>
              <option value="in_progress">In Progress</option>
              <option value="escalated">Escalated</option>
              <option value="resolved">Resolved</option>
              <option value="closed">Closed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-blue">Category</label>
            <select
              value={filters.category}
              onChange={(e) => handleFilterChange('category', e.target.value)}
              className="form-select"
            >
              <option value="">All Categories</option>
              <option value="academic">Academic Issues</option>
              <option value="facilities">Facilities & Infrastructure</option>
              <option value="security">Security & Safety</option>
              <option value="student_life">Student Life</option>
              <option value="technology">Technology Issues</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label text-purple">Severity</label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="form-select"
            >
              <option value="">All Severity</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div className="form-group flex items-end">
            <button
              onClick={() => {
                setFilters({
                  status: '',
                  category: '',
                  severity: '',
                  search: ''
                });
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
              className="btn btn-outline w-full"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Reports</h3>
          <p className="text-sm text-blue">
            Showing {reports.length} of {pagination.total} reports
          </p>
        </div>

        {reports.length === 0 ? (
          <div className="text-center py-8">
            <FileText size={48} className="text-blue mx-auto mb-4" />
            <p className="text-blue">No reports found matching your criteria.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="table">
              <thead>
                <tr>
                  <th>Report ID</th>
                  <th>Title</th>
                  <th>Category</th>
                  <th>Status</th>
                  <th>Severity</th>
                  <th>Submitted</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {reports.map((report) => (
                  <tr key={report.report_id}>
                    <td className="font-mono text-sm">{report.report_id}</td>
                    <td>
                      <div>
                        <p className="font-medium">{report.title}</p>
                        <p className="text-sm text-blue truncate max-w-xs">
                          {report.description}
                        </p>
                      </div>
                    </td>
                    <td>
                      <span className="text-sm">
                        {report.category}
                        {report.subcategory && (
                          <span className="text-blue"> - {report.subcategory}</span>
                        )}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${getStatusBadge(report.status)}`}>
                        {report.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td>
                      <span className={`badge ${
                        report.severity === 'critical' ? 'badge-escalated' :
                        report.severity === 'high' ? 'badge-under-review' :
                        report.severity === 'medium' ? 'badge-assigned' : 'badge-pending'
                      }`}>
                        {report.severity}
                      </span>
                    </td>
                    <td className="text-sm text-blue">
                      {formatDate(report.created_at)}
                    </td>
                    <td>
                      <Link
                        to={`/dashboard/reports/${report.report_id}`}
                        className="btn btn-outline btn-sm"
                      >
                        <Eye size={16} className="mr-1" />
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {pagination.pages > 1 && (
          <div className="flex items-center justify-between mt-6">
            <p className="text-sm text-blue">
              Page {pagination.page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                disabled={pagination.page === 1}
                className="btn btn-outline btn-sm"
              >
                Previous
              </button>
              <button
                onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                disabled={pagination.page === pagination.pages}
                className="btn btn-outline btn-sm"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard; 