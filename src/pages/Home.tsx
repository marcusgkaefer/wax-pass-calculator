import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/layout/Layout';
import { 
  Calendar, 
  MapPin, 
  Star, 
  Gift, 
  Users, 
  Sparkles,
  ArrowRight,
  Heart,
  Shield,
  Clock
} from 'lucide-react';

const Home = () => {
  const services = [
    {
      name: 'Brazilian',
      description: 'Our #1 service for a reason. Say goodbye to worry and hello to feeling unstoppable.',
      image: '🌺',
      href: '/services/brazilian',
      popular: true,
    },
    {
      name: 'Eyebrows',
      description: 'Perfectly shaped brows flatter your features and fuel your confidence.',
      image: '👁️',
      href: '/services/eyebrows',
    },
    {
      name: 'Body',
      description: 'Flawless arms, legs, back, and beyond. Feel polished from head to toe.',
      image: '✨',
      href: '/services/body',
    },
    {
      name: 'Face',
      description: 'Radiance begins with a fresh face. Trust our experts to bring out your best glow.',
      image: '💆',
      href: '/services/face',
    },
  ];

  const perks = [
    {
      title: 'First Wax Free!',
      description: 'New guest? Your first wax is on us.',
      icon: Gift,
      href: '/first-visit/free-wax',
    },
    {
      title: 'Get a Wax Pass®',
      description: 'Savings, convenience, flexibility.',
      icon: Sparkles,
      href: '/wax-pass-calculator',
    },
    {
      title: 'Refer a friend',
      description: 'Earn $10 in EWC Rewards® for each new guest you refer.',
      icon: Users,
      href: '/referrals',
    },
    {
      title: 'EWC Rewards',
      description: 'Earn points with every visit and purchase.',
      icon: Star,
      href: '/rewards',
    },
  ];

  const stats = [
    { number: '14M+', label: 'Happy Guests' },
    { number: '1000+', label: 'Locations' },
    { number: '20+', label: 'Years Experience' },
    { number: '99%', label: 'Satisfaction Rate' },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-purple-50 to-pink-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-purple-100 text-purple-800 hover:bg-purple-200">
              <Gift className="h-4 w-4 mr-2" />
              First Wax Free for New Guests!
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Confidence Starts <span className="text-purple-700">Here</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              14 million guests can't be wrong. Experience the difference with expert waxing services designed to help you walk in and strut out with confidence.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="bg-purple-700 hover:bg-purple-800 text-lg px-8 py-6">
                <Calendar className="h-5 w-5 mr-2" />
                Book Your Wax
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                <MapPin className="h-5 w-5 mr-2" />
                Find Locations
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Wax Pass Promotion */}
      <section className="py-16 bg-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-4">
              Lock in the lowest prices of the year with a Wax Pass®
            </h2>
            <p className="text-xl mb-8 text-purple-100">
              Buy 9 waxes, get 3 FREE and save 25%. Calculate your savings now!
            </p>
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Link to="/wax-pass-calculator" className="flex items-center">
                Calculate My Savings
                <ArrowRight className="h-5 w-5 ml-2" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Waxing Services Designed for You
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              From perfecting your brows to trying your first Brazilian, our Wax Experts are here to help you walk in and strut out with confidence.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service) => (
              <Card key={service.name} className="group hover:shadow-lg transition-all duration-300 cursor-pointer">
                <CardHeader className="text-center">
                  <div className="text-6xl mb-4">{service.image}</div>
                  <div className="flex items-center justify-center gap-2">
                    <CardTitle className="text-xl">{service.name}</CardTitle>
                    {service.popular && (
                      <Badge variant="secondary" className="text-xs">Popular</Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="text-center">
                  <CardDescription className="mb-4">{service.description}</CardDescription>
                  <Button variant="outline" className="w-full group-hover:bg-purple-700 group-hover:text-white transition-colors">
                    <Link to={service.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button size="lg" variant="outline">
              <Link to="/services">Explore All Waxing Services</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-4xl font-bold text-purple-700 mb-2">{stat.number}</div>
                <div className="text-gray-600">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Perks Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">You Deserve The Best</h2>
            <p className="text-xl text-gray-600">Get the most out of EWC with these perks.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {perks.map((perk) => (
              <Card key={perk.title} className="text-center hover:shadow-lg transition-all">
                <CardHeader>
                  <perk.icon className="h-12 w-12 mx-auto text-purple-700 mb-4" />
                  <CardTitle className="text-lg">{perk.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="mb-4">{perk.description}</CardDescription>
                  <Button variant="outline" size="sm">
                    <Link to={perk.href}>Learn More</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="py-16 bg-purple-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 mx-auto text-purple-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Expert Care</h3>
              <p className="text-gray-600">Trained professionals using the latest techniques and highest hygiene standards.</p>
            </div>
            <div className="text-center">
              <Heart className="h-12 w-12 mx-auto text-purple-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Comfort First</h3>
              <p className="text-gray-600">We prioritize your comfort with gentle techniques and welcoming environments.</p>
            </div>
            <div className="text-center">
              <Clock className="h-12 w-12 mx-auto text-purple-700 mb-4" />
              <h3 className="text-xl font-semibold mb-2">Convenient Booking</h3>
              <p className="text-gray-600">Easy online booking with flexible scheduling to fit your busy lifestyle.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-purple-700 to-purple-900 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready to Feel Unstoppable?</h2>
          <p className="text-xl mb-8 text-purple-100">
            Join millions of confident guests who trust European Wax Center for their waxing needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your First Wax
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-purple-900">
              <MapPin className="h-5 w-5 mr-2" />
              Find Center Near You
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home; 