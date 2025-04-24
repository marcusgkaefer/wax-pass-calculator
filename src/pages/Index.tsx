
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import LocationSearch from '../components/LocationSearch';
import PricingForm from '../components/PricingForm';

const Index = () => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center text-purple-900 mb-4">
          My Local Center Wax Pass Pricing
        </h1>
        <p className="text-center text-gray-600 mb-8 max-w-2xl mx-auto">
          Service and package prices may vary by location and are subject to change without notice.
          Actual savings may vary by service; disclosed savings are average, approximate
          percentages for each pass, rounded to nearest whole percentage.
        </p>

        <div className="space-y-8">
          <div>
            <h2 className="text-xl font-semibold text-purple-900 mb-4 text-center">
              Find Your Local Center
            </h2>
            <LocationSearch
              onLocationSelect={(location) => setSelectedLocation(location)}
            />
          </div>

          <div>
            <h2 className="text-xl font-semibold text-purple-900 mb-4 text-center">
              Select Your Pass Details
            </h2>
            <PricingForm locationSelected={!!selectedLocation} />
          </div>
        </div>

        <div className="mt-12 border-t pt-8">
          <h3 className="text-lg font-semibold text-purple-900 mb-4 text-center">
            Explore Different UI/UX Approaches
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Link to="/map-view" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900">Map-Based View</h4>
              <p className="text-sm text-purple-700">Find centers visually on an interactive map</p>
            </Link>
            <Link to="/step-by-step" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900">Step-by-Step Flow</h4>
              <p className="text-sm text-purple-700">Guided wizard experience with clear steps</p>
            </Link>
            <Link to="/card-based" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900">Card-Based Selection</h4>
              <p className="text-sm text-purple-700">Visual card interface for all selections</p>
            </Link>
            <Link to="/single-page" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900">Single Page Experience</h4>
              <p className="text-sm text-purple-700">Everything in one scrollable view</p>
            </Link>
            <Link to="/tab-layout" className="block p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
              <h4 className="font-medium text-purple-900">Tab Layout</h4>
              <p className="text-sm text-purple-700">Tab-based organization of selection process</p>
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default Index;
