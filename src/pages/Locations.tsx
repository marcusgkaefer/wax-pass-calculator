import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { WaxPassProvider } from '@/lib/WaxPassContext';
import LocationSelection from '@/components/waxPass/LocationSelection';
import { 
  MapPin, 
  Phone, 
  Clock, 
  Star,
  Navigation,
  Search,
  Filter
} from 'lucide-react';

const Locations = () => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [selectedCenter, setSelectedCenter] = useState(null);

  const features = [
    {
      icon: MapPin,
      title: '1000+ Locations',
      description: 'Convenient locations across the United States'
    },
    {
      icon: Clock,
      title: 'Flexible Hours',
      description: 'Open 7 days a week with evening appointments'
    },
    {
      icon: Star,
      title: 'Expert Staff',
      description: 'Trained professionals at every location'
    },
    {
      icon: Phone,
      title: 'Easy Booking',
      description: 'Book online or call your nearest center'
    }
  ];

  return (
    <Layout>
      <WaxPassProvider>
        {/* Hero Section */}
        <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                Find Your Nearest <span className="text-purple-700">Wax Center</span>
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                With over 1000 locations nationwide, there's a European Wax Center near you. 
                Find expert waxing services and book your appointment today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" className="bg-purple-700 hover:bg-purple-800">
                  <Navigation className="h-5 w-5 mr-2" />
                  Use My Location
                </Button>
                <Button size="lg" variant="outline">
                  <Search className="h-5 w-5 mr-2" />
                  Search by City
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <div key={index} className="text-center">
                  <feature.icon className="h-12 w-12 mx-auto text-purple-700 mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Enhanced Location Finder */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-900 mb-4">
                  Locate Your Perfect Wax Center
                </h2>
                <p className="text-xl text-gray-600">
                  Search by location, see real-time availability, and book instantly
                </p>
              </div>

              {/* Integrated Location Selection Component */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <LocationSelection 
                  onContinue={() => {
                    // Handle continue action - could navigate to booking
                    console.log('Continue to booking');
                  }}
                />
              </div>
            </div>
          </div>
        </section>

        {/* State-by-State Directory */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Browse by State</h2>
              <p className="text-center text-gray-600 mb-8">
                Click your state to find all European Wax Center locations
              </p>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {[
                  'Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
                  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
                  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine',
                  'Maryland', 'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri',
                  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
                  'North Carolina', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island',
                  'South Carolina', 'Tennessee', 'Texas', 'Utah', 'Virginia', 'Washington',
                  'West Virginia', 'Wisconsin'
                ].map((state) => (
                  <Button 
                    key={state} 
                    variant="outline" 
                    className="justify-start text-left hover:bg-purple-50 hover:border-purple-300"
                  >
                    {state}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Services Available */}
        <section className="py-16 bg-purple-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Services Available at All Locations</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {[
                  { name: 'Brazilian', icon: '🌺' },
                  { name: 'Eyebrows', icon: '👁️' },
                  { name: 'Body Waxing', icon: '💪' },
                  { name: 'Facial Waxing', icon: '💆' },
                  { name: 'Men\'s Services', icon: '👨' }
                ].map((service) => (
                  <Card key={service.name} className="text-center border-purple-200">
                    <CardContent className="pt-6">
                      <div className="text-4xl mb-2">{service.icon}</div>
                      <p className="font-medium">{service.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <p className="text-gray-600 mt-8">
                Prices and services may vary by location. Contact your local center for specific details.
              </p>
            </div>
          </div>
        </section>

        {/* Why Choose EWC */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">
                Why European Wax Center?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Star className="h-5 w-5 text-yellow-500" />
                      Expert Wax Specialists
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Our trained professionals use the finest techniques and highest quality wax 
                      to ensure your comfort and the best results.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Clock className="h-5 w-5 text-purple-700" />
                      Convenient Scheduling
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      Open 7 days a week with flexible hours including evenings and weekends 
                      to fit your busy schedule.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Badge className="h-5 w-5 text-green-600" />
                      First Wax Free
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      New guests can enjoy a complimentary brow, underarm, or bikini wax 
                      to experience the EWC difference.
                    </p>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="h-5 w-5 text-blue-600" />
                      Nationwide Network
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">
                      With over 1000 locations, you can maintain your waxing routine 
                      wherever life takes you.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-4xl font-bold mb-4">Ready to Book Your Appointment?</h2>
            <p className="text-xl mb-8 text-purple-100">
              Find your nearest location and experience the confidence that comes with smooth, beautiful skin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
                <MapPin className="h-5 w-5 mr-2" />
                Find My Center
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-900">
                <Phone className="h-5 w-5 mr-2" />
                Call to Book
              </Button>
            </div>
          </div>
        </section>
      </WaxPassProvider>
    </Layout>
  );
};

export default Locations; 