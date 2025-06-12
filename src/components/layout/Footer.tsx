import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Facebook, Twitter, Instagram, Youtube } from 'lucide-react';

const Footer = () => {
  const footerSections = {
    ewc: [
      { name: 'About Us', href: '/about' },
      { name: 'Franchising', href: '/franchising' },
      { name: 'Careers', href: '/careers' },
      { name: 'Press & Awards', href: '/press' },
      { name: 'Investors', href: '/investors' },
    ],
    help: [
      { name: 'Contact Us', href: '/contact' },
      { name: 'FAQ\'s', href: '/faqs' },
      { name: 'EWC Rewards', href: '/rewards' },
      { name: 'My Referrals', href: '/referrals' },
      { name: 'Hygiene & Safety', href: '/safety' },
    ],
    policies: [
      { name: 'Return Policy', href: '/policies/returns' },
      { name: 'Shipping Policy', href: '/policies/shipping' },
      { name: 'Privacy Policy', href: '/policies/privacy' },
      { name: 'Terms of Use', href: '/policies/terms' },
      { name: 'Accessibility', href: '/policies/accessibility' },
      { name: 'Cancellation Policy', href: '/policies/cancellation' },
    ],
  };

  return (
    <footer className="bg-gray-50 border-t">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="h-10 w-10 rounded-full bg-purple-700 flex items-center justify-center">
                <span className="text-white font-bold text-lg">EWC</span>
              </div>
              <span className="font-bold text-xl text-purple-900">
                European Wax Center
              </span>
            </div>
            <p className="text-sm text-gray-600">
              Confidence starts here. Your expert waxing destination for beautiful, smooth skin.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm">
                <Facebook className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Twitter className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Instagram className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="sm">
                <Youtube className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* EWC Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">EWC</h3>
            <ul className="space-y-2">
              {footerSections.ewc.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Get Help Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Get Help</h3>
            <ul className="space-y-2">
              {footerSections.help.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Policies Links */}
          <div>
            <h3 className="font-semibold text-gray-900 mb-4">Policies</h3>
            <ul className="space-y-2">
              {footerSections.policies.map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.href} 
                    className="text-sm text-gray-600 hover:text-purple-700 transition-colors"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Newsletter Signup */}
        <div className="mt-12 pt-8 border-t border-gray-200">
          <div className="max-w-md mx-auto text-center">
            <h3 className="font-semibold text-gray-900 mb-2">Subscribe to Emails</h3>
            <p className="text-sm text-gray-600 mb-4">
              Reserve your birthday treat and receive exclusive invitations, updates & special offers.
            </p>
            <div className="flex space-x-2">
              <Input 
                placeholder="Enter your email" 
                className="flex-1"
                type="email"
              />
              <Button className="bg-purple-700 hover:bg-purple-800">
                Subscribe
              </Button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 pt-8 border-t border-gray-200 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-sm text-gray-500">
            © 2025, European Wax Center. All rights reserved.
          </p>
          <div className="flex space-x-4 mt-4 sm:mt-0">
            <Link 
              to="/policies/privacy" 
              className="text-sm text-gray-500 hover:text-purple-700"
            >
              Do Not Sell My Personal Information
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer; 