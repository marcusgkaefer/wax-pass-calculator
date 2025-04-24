
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft } from 'lucide-react';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
}

const PageHeader: React.FC<PageHeaderProps> = ({ title, subtitle }) => {
  return (
    <div className="mb-8">
      <Link to="/" className="inline-flex items-center text-purple-700 hover:text-purple-900 mb-4">
        <ChevronLeft className="h-4 w-4 mr-1" />
        <span>Back to main page</span>
      </Link>
      <h1 className="text-3xl md:text-4xl font-bold text-center text-purple-900 mb-2">
        {title}
      </h1>
      {subtitle && (
        <p className="text-center text-gray-600 max-w-2xl mx-auto">
          {subtitle}
        </p>
      )}
    </div>
  );
};

export default PageHeader;
