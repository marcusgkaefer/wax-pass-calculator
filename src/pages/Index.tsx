
import React, { useState } from 'react';
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

        <p className="text-center text-sm text-gray-500 mt-8">
          Subject to applicable taxes. Additional terms may apply.
        </p>
      </div>
    </div>
  );
};

export default Index;
