import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import Layout from '@/components/layout/Layout';
import { 
  Calendar, 
  Gift, 
  Star,
  Clock,
  Shield,
  Heart,
  CheckCircle,
  AlertCircle,
  Info
} from 'lucide-react';

const FirstVisit = () => {
  const freeServices = [
    {
      name: 'Eyebrow Shaping',
      description: 'Expert shaping to enhance your natural brow arch',
      duration: '15-20 minutes',
      icon: '👁️',
      tips: [
        'Allow 2-3 weeks of growth before your appointment',
        'Avoid tweezing or threading before your visit',
        'Come with clean skin, no makeup on brows'
      ]
    },
    {
      name: 'Underarm',
      description: 'Smooth, hair-free underarms that last weeks',
      duration: '10-15 minutes',
      icon: '💪',
      tips: [
        'Stop shaving 2 weeks before your appointment',
        'Wear comfortable, loose-fitting clothing',
        'Avoid deodorant on the day of your appointment'
      ]
    },
    {
      name: 'Bikini Line',
      description: 'Classic bikini line cleanup for confidence',
      duration: '15-20 minutes',
      icon: '🌺',
      tips: [
        'Hair should be 1/4 inch long (about 2-3 weeks growth)',
        'Avoid tight clothing after your appointment',
        'Exfoliate gently 24 hours before your visit'
      ]
    }
  ];

  const whatToExpect = [
    {
      step: 1,
      title: 'Consultation',
      description: 'Your Wax Specialist will discuss your needs and answer any questions',
      icon: <Heart className="h-6 w-6 text-purple-700" />
    },
    {
      step: 2,
      title: 'Preparation',
      description: 'The area will be cleaned and prepared with pre-wax treatments',
      icon: <Shield className="h-6 w-6 text-purple-700" />
    },
    {
      step: 3,
      title: 'Waxing',
      description: 'Quick, professional waxing using our signature comfort wax',
      icon: <Star className="h-6 w-6 text-purple-700" />
    },
    {
      step: 4,
      title: 'Aftercare',
      description: 'Soothing post-wax treatment and care instructions',
      icon: <CheckCircle className="h-6 w-6 text-purple-700" />
    }
  ];

  const faqs = [
    {
      question: 'Does waxing hurt?',
      answer: 'While there is some discomfort, our expert techniques and high-quality wax minimize pain. Most first-time guests are pleasantly surprised by how comfortable the experience is. The discomfort is brief and gets easier with regular appointments.'
    },
    {
      question: 'How long should my hair be?',
      answer: 'Hair should be at least 1/4 inch long (about the length of a grain of rice). This typically means 2-3 weeks of growth after shaving. If your hair is too short, the wax won\'t be able to grip it properly.'
    },
    {
      question: 'How long do results last?',
      answer: 'Results typically last 3-4 weeks, but this varies based on your individual hair growth cycle. With regular waxing, hair grows back finer and sparser over time.'
    },
    {
      question: 'What should I do to prepare?',
      answer: 'Exfoliate gently 24-48 hours before your appointment, avoid sun exposure, don\'t use retinoids for 48 hours prior, and come with clean skin. Avoid caffeine beforehand to reduce sensitivity.'
    },
    {
      question: 'What should I avoid after waxing?',
      answer: 'For 24-48 hours after waxing, avoid hot baths, saunas, sun exposure, tight clothing, and working out. These can irritate newly waxed skin.'
    },
    {
      question: 'Can I book online?',
      answer: 'Yes! You can easily book your first free wax online by selecting your preferred location and available time slot. You can also call your local center directly.'
    }
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-green-50 to-purple-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-6 bg-green-100 text-green-800 hover:bg-green-200 text-lg px-6 py-2">
              <Gift className="h-5 w-5 mr-2" />
              First Wax FREE!
            </Badge>
            
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Welcome to <span className="text-purple-700">Confidence</span>
            </h1>
            
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              New to European Wax Center? Experience the difference with a complimentary 
              eyebrow, underarm, or bikini wax. No strings attached – just our way of 
              introducing you to smooth, beautiful skin.
            </p>
            
            <Button size="lg" className="bg-green-600 hover:bg-green-700 text-lg px-8 py-6">
              <Calendar className="h-5 w-5 mr-2" />
              Book Your Free Wax
            </Button>
          </div>
        </div>
      </section>

      {/* Choose Your Free Service */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Choose Your Complimentary Service
              </h2>
              <p className="text-xl text-gray-600">
                Select from these three popular services for your first free wax
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {freeServices.map((service) => (
                <Card key={service.name} className="group hover:shadow-lg transition-all duration-300 border-green-200">
                  <CardHeader className="text-center">
                    <div className="text-6xl mb-4">{service.icon}</div>
                    <CardTitle className="text-xl mb-2">{service.name}</CardTitle>
                    <Badge variant="outline" className="border-green-200 text-green-700 mb-3">
                      <Clock className="h-3 w-3 mr-1" />
                      {service.duration}
                    </Badge>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-base mb-6">
                      {service.description}
                    </CardDescription>
                    
                    <div className="space-y-2 mb-6">
                      <p className="font-medium text-gray-900 text-sm">Preparation Tips:</p>
                      {service.tips.map((tip, index) => (
                        <div key={index} className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                          <p className="text-sm text-gray-600">{tip}</p>
                        </div>
                      ))}
                    </div>

                    <Button className="w-full bg-green-600 hover:bg-green-700">
                      <Calendar className="h-4 w-4 mr-2" />
                      Book This Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What to Expect */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                What to Expect During Your Visit
              </h2>
              <p className="text-xl text-gray-600">
                Your comfort and satisfaction are our top priorities
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {whatToExpect.map((step) => (
                <Card key={step.step} className="text-center">
                  <CardHeader>
                    <div className="flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                        {step.icon}
                      </div>
                    </div>
                    <CardTitle className="text-lg">
                      Step {step.step}: {step.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{step.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Comfort Promise */}
      <section className="py-20 bg-purple-700 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-6">Our Comfort Promise</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="text-center">
                <Shield className="h-12 w-12 mx-auto mb-4 text-purple-200" />
                <h3 className="text-xl font-semibold mb-2">Expert Technique</h3>
                <p className="text-purple-100">
                  Our trained specialists use proven methods to minimize discomfort
                </p>
              </div>
              <div className="text-center">
                <Star className="h-12 w-12 mx-auto mb-4 text-purple-200" />
                <h3 className="text-xl font-semibold mb-2">Premium Wax</h3>
                <p className="text-purple-100">
                  We use the finest quality wax that's gentle on your skin
                </p>
              </div>
              <div className="text-center">
                <Heart className="h-12 w-12 mx-auto mb-4 text-purple-200" />
                <h3 className="text-xl font-semibold mb-2">Personalized Care</h3>
                <p className="text-purple-100">
                  Every service is tailored to your comfort level and needs
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-bold text-center mb-12">
              First-Time Guest Questions
            </h2>
            
            <Accordion type="single" collapsible className="space-y-4">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`} className="border rounded-lg px-6">
                  <AccordionTrigger className="text-left font-medium">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-gray-600 pb-4">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-600 to-green-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-4xl font-bold mb-4">Ready for Your Free Wax?</h2>
          <p className="text-xl mb-8 text-green-100">
            Join millions of confident guests who've discovered the EWC difference. 
            Book your complimentary service today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" variant="secondary" className="text-lg px-8 py-6">
              <Calendar className="h-5 w-5 mr-2" />
              Book Free Wax Online
            </Button>
            <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-white text-white hover:bg-white hover:text-green-700">
              <Link to="/locations" className="flex items-center">
                Find Center Near Me
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default FirstVisit; 