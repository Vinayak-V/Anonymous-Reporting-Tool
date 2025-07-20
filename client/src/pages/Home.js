import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, FileText, Search, Users, Lock, Clock } from 'lucide-react';

const Home = () => {
  return (
    <div className="container mx-auto p-8 bg-gray-100">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <Shield size={64} className="text-blue-600" />
        </div>
        <h1 className="text-4xl font-bold text-gradient mb-4">
          Campus Anonymous Reporting Platform
        </h1>
        <p className="text-xl text-blue mb-8 max-w-2xl mx-auto">
          Submit complaints and concerns anonymously. Track your reports securely. 
          Campus authorities can manage and respond to reports efficiently.
        </p>
        <div className="flex gap-4 justify-center">
          <Link to="/report" className="btn btn-primary btn-lg">
            <FileText className="mr-2" size={20} />
            Submit Report
          </Link>
          <Link to="/track" className="btn btn-outline btn-lg">
            <Search className="mr-2" size={20} />
            Track Report
          </Link>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Lock size={48} className="text-green-600" />
          </div>
          <h3 className="text-2xl font-semibold mb-2 text-blue">100% Anonymous</h3>
          <p className="text-purple">
            Submit reports without revealing your identity. Your privacy is our top priority.
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Clock size={48} className="text-blue-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-gradient">Real-time Tracking</h3>
          <p className="text-blue">
            Track the status of your reports using your unique Report ID and passcode.
          </p>
        </div>

        <div className="card text-center">
          <div className="flex justify-center mb-4">
            <Users size={48} className="text-purple-600" />
          </div>
          <h3 className="text-xl font-semibold mb-2 text-purple">Expert Management</h3>
          <p className="text-blue">
            Campus authorities can efficiently manage, categorize, and respond to reports.
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="card mb-12">
        <div className="card-header">
          <h2 className="card-title text-gradient">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-blue-600">1</span>
            </div>
            <h4 className="font-semibold mb-2 text-blue">Submit Report</h4>
            <p className="text-sm text-purple">
              Fill out the anonymous form with your concern details
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-blue-600">2</span>
            </div>
            <h4 className="font-semibold mb-2 text-purple">Get Tracking Info</h4>
            <p className="text-sm text-blue">
              Receive your unique Report ID and passcode
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-blue-600">3</span>
            </div>
            <h4 className="font-semibold mb-2 text-gradient">Authorities Review</h4>
            <p className="text-sm text-blue">
              Campus staff review and take action on your report
            </p>
          </div>
          <div className="text-center">
            <div className="bg-blue-100 rounded-full w-12 h-12 flex items-center justify-center mx-auto mb-3">
              <span className="font-bold text-blue-600">4</span>
            </div>
            <h4 className="font-semibold mb-2 text-blue">Track Progress</h4>
            <p className="text-sm text-purple">
              Monitor status updates and responses
            </p>
          </div>
        </div>
      </div>

      {/* Report Categories */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title text-gradient">Report Categories</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue mb-2">Academic Issues</h4>
            <p className="text-sm text-purple">Grade disputes, plagiarism, faculty conduct</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gradient mb-2">Facilities & Infrastructure</h4>
            <p className="text-sm text-blue">Building maintenance, safety hazards</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple mb-2">Security & Safety</h4>
            <p className="text-sm text-blue">Theft, harassment, suspicious activity</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-blue mb-2">Student Life</h4>
            <p className="text-sm text-purple">Housing, food services, transportation</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-gradient mb-2">Technology Issues</h4>
            <p className="text-sm text-blue">WiFi problems, computer labs, IT support</p>
          </div>
          <div className="p-4 border rounded-lg">
            <h4 className="font-semibold text-purple mb-2">Other</h4>
            <p className="text-sm text-blue">General complaints, suggestions, feedback</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 