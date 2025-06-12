import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Layout from '@/components/layout/Layout';
import { 
  Calendar, 
  Clock, 
  DollarSign, 
  Info,
  Sparkles,
  Star
} from 'lucide-react';

const Services = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const serviceCategories = [
    { id: 'all', name: 'All Services', icon: '✨' },
    { id: 'brazilian', name: 'Brazilian', icon: '🌺' },
    { id: 'eyebrows', name: 'Eyebrows', icon: '👁️' },
    { id: 'body', name: 'Body', icon: '💪' },
    { id: 'face', name: 'Face', icon: '💆' },
    { id: 'mens', name: 'Men\'s', icon: '👨' },
  ];

  const services = [
    // Brazilian Services
    {
      id: 'brazilian-full',
      name: 'Full Brazilian',
      category: 'brazilian',
      description: 'Complete hair removal from front to back. Our most popular service.',
      duration: '30-45 mins',
      startingPrice: 65,
      popular: true,
      firstTime: true,
    },
    {
      id: 'brazilian-partial',
      name: 'Bikini Line',
      category: 'brazilian',
      description: 'Classic bikini line cleanup for a clean, confident look.',
      duration: '15-20 mins',
      startingPrice: 35,
      firstTime: true,
    },
    {
      id: 'brazilian-extended',
      name: 'Extended Bikini',
      category: 'brazilian',
      description: 'More coverage than bikini line, less than full Brazilian.',
      duration: '20-30 mins',
      startingPrice: 50,
      firstTime: true,
    },

    // Eyebrow Services
    {
      id: 'brow-shaping',
      name: 'Eyebrow Shaping',
      category: 'eyebrows',
      description: 'Expert shaping to enhance your natural brow arch.',
      duration: '15-20 mins',
      startingPrice: 28,
      popular: true,
      firstTime: true,
    },
    {
      id: 'brow-tinting',
      name: 'Eyebrow Tinting',
      category: 'eyebrows',
      description: 'Add depth and definition with professional tinting.',
      duration: '20-25 mins',
      startingPrice: 35,
    },
    {
      id: 'brow-combo',
      name: 'Brow Shape + Tint',
      category: 'eyebrows',
      description: 'Complete brow transformation with shaping and tinting.',
      duration: '30-35 mins',
      startingPrice: 55,
    },

    // Body Services
    {
      id: 'underarm',
      name: 'Underarm',
      category: 'body',
      description: 'Smooth, hair-free underarms that last weeks.',
      duration: '10-15 mins',
      startingPrice: 22,
      firstTime: true,
    },
    {
      id: 'legs-full',
      name: 'Full Leg',
      category: 'body',
      description: 'Complete leg waxing from thigh to ankle.',
      duration: '45-60 mins',
      startingPrice: 85,
    },
    {
      id: 'legs-half',
      name: 'Half Leg',
      category: 'body',
      description: 'Lower leg waxing from knee to ankle.',
      duration: '25-35 mins',
      startingPrice: 45,
    },
    {
      id: 'arms-full',
      name: 'Full Arm',
      category: 'body',
      description: 'Complete arm waxing including hands and fingers.',
      duration: '30-40 mins',
      startingPrice: 55,
    },

    // Face Services
    {
      id: 'lip',
      name: 'Lip',
      category: 'face',
      description: 'Quick and precise upper lip hair removal.',
      duration: '5-10 mins',
      startingPrice: 18,
    },
    {
      id: 'chin',
      name: 'Chin',
      category: 'face',
      description: 'Gentle chin hair removal for smooth skin.',
      duration: '10-15 mins',
      startingPrice: 20,
    },
    {
      id: 'full-face',
      name: 'Full Face',
      category: 'face',
      description: 'Complete facial waxing for a radiant, smooth complexion.',
      duration: '30-40 mins',
      startingPrice: 65,
    },

    // Men's Services
    {
      id: 'mens-back',
      name: 'Back',
      category: 'mens',
      description: 'Complete back hair removal for men.',
      duration: '30-45 mins',
      startingPrice: 75,
    },
    {
      id: 'mens-chest',
      name: 'Chest',
      category: 'mens',
      description: 'Professional chest waxing for men.',
      duration: '25-35 mins',
      startingPrice: 65,
    },
    {
      id: 'mens-brows',
      name: 'Men\'s Brow Shaping',
      category: 'mens',
      description: 'Masculine brow grooming and shaping.',
      duration: '15-20 mins',
      startingPrice: 32,
    },
  ];

  const filteredServices = selectedCategory === 'all' 
    ? services 
    : services.filter(service => service.category === selectedCategory);

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Expert Waxing <span className="text-purple-700">Services</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Professional waxing services designed to help you feel confident and beautiful. 
              From your first visit to your regular routine, we're here for you.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-700 hover:bg-purple-800">
                <Calendar className="h-5 w-5 mr-2" />
                Book Your Service
              </Button>
              <Button size="lg" variant="outline">
                <Sparkles className="h-5 w-5 mr-2" />
                Calculate Wax Pass Savings
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Service Categories */}
      <section className="py-12 border-b">
        <div className="container mx-auto px-4">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 mb-8">
              {serviceCategories.map((category) => (
                <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
                  <span className="text-lg">{category.icon}</span>
                  <span className="hidden sm:inline">{category.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredServices.map((service) => (
              <Card key={service.id} className="group hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                      <div className="flex gap-2 mb-3">
                        {service.popular && (
                          <Badge className="bg-purple-100 text-purple-800">
                            <Star className="h-3 w-3 mr-1" />
                            Popular
                          </Badge>
                        )}
                        {service.firstTime && (
                          <Badge variant="outline" className="border-green-200 text-green-700">
                            First Time Free
                          </Badge>
                        )}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-purple-700">
                        ${service.startingPrice}+
                      </div>
                      <div className="text-sm text-gray-500">starting</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4 text-base">
                    {service.description}
                  </CardDescription>
                  
                  <div className="flex items-center gap-4 mb-6 text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      {service.duration}
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-4 w-4" />
                      Starting ${service.startingPrice}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button className="flex-1 bg-purple-700 hover:bg-purple-800">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book Now
                    </Button>
                    <Button variant="outline" size="icon">
                      <Info className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* First Time Guest Section */}
      <section className="py-16 bg-green-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              First Time Guest? Your First Wax is FREE!
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              New guests can enjoy a complimentary brow, underarm, or bikini wax. 
              Experience the EWC difference risk-free.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">👁️</div>
                  <CardTitle>Eyebrow Shaping</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Perfect your brows with expert shaping</p>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">💪</div>
                  <CardTitle>Underarm</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Smooth underarms that last weeks</p>
                </CardContent>
              </Card>
              <Card className="border-green-200">
                <CardHeader className="text-center">
                  <div className="text-4xl mb-2">🌺</div>
                  <CardTitle>Bikini Line</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                  <p className="text-gray-600">Clean bikini line for confidence</p>
                </CardContent>
              </Card>
            </div>
            <Button size="lg" className="bg-green-600 hover:bg-green-700">
              <Calendar className="h-5 w-5 mr-2" />
              Claim Your Free Wax
            </Button>
          </div>
        </div>
      </section>

      {/* Wax Pass Promotion */}
      <section className="py-16 bg-purple-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Save More with Wax Passes</h2>
          <p className="text-xl mb-8 text-purple-100">
            Buy 9 waxes, get 3 FREE and save 25% on all your favorite services.
          </p>
          <Button size="lg" variant="secondary">
            <Link to="/wax-pass-calculator" className="flex items-center">
              <Sparkles className="h-5 w-5 mr-2" />
              Calculate Your Savings
            </Link>
          </Button>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>How long do results last?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Results typically last 3-4 weeks, depending on your hair growth cycle. 
                    With regular waxing, hair grows back finer and sparser.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>Does waxing hurt?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    While there is some discomfort, our expert techniques and high-quality wax 
                    minimize pain. Most guests find it much more comfortable than expected.
                  </p>
                </CardContent>
              </Card>
              <Card>
                <CardHeader>
                  <CardTitle>How should I prepare for my appointment?</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    Hair should be at least 1/4 inch long. Avoid sun exposure, exfoliate gently 
                    24 hours before, and avoid caffeine to reduce sensitivity.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services; 