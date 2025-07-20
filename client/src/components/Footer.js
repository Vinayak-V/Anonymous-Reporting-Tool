import React from 'react';
import { Shield } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="flex items-center justify-center mb-4">
          <Shield className="mr-2" size={20} />
          <span className="font-semibold">Campus Anonymous Reporting Platform</span>
        </div>
        <p className="text-sm text-gray-300">
          Providing a safe and confidential way for students to report concerns and complaints.
        </p>
        <p className="text-sm text-gray-400 mt-2">
          © 2024 Campus Reports. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer; 