import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  MapPin, 
  Phone, 
  User, 
  Calendar, 
  Sparkles, 
  Heart,
  Gift,
  ShoppingBag,
  X
} from 'lucide-react';

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navigation = [
    {
      name: 'Services',
      href: '/services',
      icon: Sparkles,
      submenu: [
        { name: 'Brazilian Waxing', href: '/services/brazilian', icon: '💎' },
        { name: 'Eyebrow Waxing', href: '/services/eyebrows', icon: '👁️' },
        { name: 'Body Waxing', href: '/services/body', icon: '✨' },
        { name: 'Facial Waxing', href: '/services/face', icon: '💆' },
        { name: 'Men\'s Waxing', href: '/services/mens', icon: '👨' },
        { name: 'All Services', href: '/services', icon: '🌟' },
      ]
    },
    {
      name: 'Wax Pass',
      href: '/wax-pass-calculator',
      icon: Gift,
    },
    {
      name: 'Locations',
      href: '/locations',
      icon: MapPin,
    },
    {
      name: 'First Visit',
      href: '/first-visit',
      icon: Heart,
      submenu: [
        { name: 'First Wax Free', href: '/first-visit/free-wax', icon: '🎁' },
        { name: 'What to Expect', href: '/first-visit/what-to-expect', icon: '💭' },
        { name: 'FAQ\'s', href: '/first-visit/faqs', icon: '❓' },
      ]
    },
    {
      name: 'Shop',
      href: '/shop',
      icon: ShoppingBag,
    },
  ];

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(href + '/');
  };

  return (
    <header className="sticky top-0 z-50 w-full animate-glass-fade-in">
      {/* Top Banner with glassmorphism */}
      <div className="glass-pink-hover relative overflow-hidden">
        <div className="container mx-auto px-4 py-3 text-center">
          <div className="flex items-center justify-center space-x-2 text-white">
            <Gift className="h-5 w-5 animate-glass-pulse" />
            <span className="font-bold text-lg">First Wax Free!</span>
            <span className="hidden sm:inline">New guests enjoy a complimentary brow, underarm, or bikini wax.</span>
          </div>
        </div>
        
        {/* Shimmer effect overlay */}
        <div className="absolute inset-0 glass-shimmer opacity-30" />
      </div>

      {/* Main Header with glassmorphism */}
      <div className="glass-white border-b border-white/20">
        <div className="container mx-auto px-4">
          <div className="flex h-20 items-center justify-between">
            {/* Logo with glassmorphism */}
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative">
                <div className="h-12 w-12 rounded-2xl glass-pink flex items-center justify-center group-hover:animate-glass-glow transition-all duration-300 transform group-hover:scale-110">
                  <Sparkles className="text-white h-6 w-6" />
                </div>
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-2xl bg-pink-500/20 blur-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10" />
              </div>
              <div className="hidden sm:block">
                <span className="font-bold text-2xl bg-gradient-to-r from-pink-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent">
                  WaxSmart
                </span>
                <div className="text-xs text-gray-500 font-medium">Confidence Starts Here</div>
              </div>
            </Link>

            {/* Desktop Navigation with glassmorphism */}
            <NavigationMenu className="hidden lg:flex">
              <NavigationMenuList className="space-x-2">
                {navigation.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <NavigationMenuItem key={item.name}>
                      {item.submenu ? (
                        <>
                          <NavigationMenuTrigger 
                            className={`glass hover:glass-pink-hover rounded-xl px-4 py-3 transition-all duration-300 ${
                              isActive(item.href) ? 'glass-pink text-white' : 'text-gray-700'
                            }`}
                          >
                            <IconComponent className="h-4 w-4 mr-2" />
                            {item.name}
                          </NavigationMenuTrigger>
                          <NavigationMenuContent>
                            <div className="glass-white rounded-2xl border border-white/20 p-6 w-[450px]">
                              <div className="grid grid-cols-2 gap-4">
                                {item.submenu.map((subItem) => (
                                  <Link
                                    key={subItem.name}
                                    to={subItem.href}
                                    className="glass-hover rounded-xl p-4 transition-all duration-300 group block"
                                  >
                                    <div className="flex items-center space-x-3">
                                      <span className="text-2xl group-hover:scale-110 transition-transform duration-300">
                                        {subItem.icon}
                                      </span>
                                      <div>
                                        <div className="font-semibold text-gray-900 group-hover:text-pink-600 transition-colors">
                                          {subItem.name}
                                        </div>
                                      </div>
                                    </div>
                                  </Link>
                                ))}
                              </div>
                            </div>
                          </NavigationMenuContent>
                        </>
                      ) : (
                        <Link
                          to={item.href}
                          className={`glass hover:glass-pink-hover rounded-xl px-4 py-3 flex items-center space-x-2 transition-all duration-300 ${
                            isActive(item.href) ? 'glass-pink text-white' : 'text-gray-700 hover:text-pink-600'
                          }`}
                        >
                          <IconComponent className="h-4 w-4" />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      )}
                    </NavigationMenuItem>
                  );
                })}
              </NavigationMenuList>
            </NavigationMenu>

            {/* Action Buttons with glassmorphism */}
            <div className="flex items-center space-x-3">
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center space-x-2 glass hover:glass-cyan-hover rounded-xl px-4 py-3 transition-all duration-300"
              >
                <MapPin className="h-4 w-4" />
                <span className="font-medium">Find Center</span>
              </Button>
              
              <Button 
                variant="ghost" 
                size="sm" 
                className="hidden md:flex items-center space-x-2 glass hover:glass-purple-hover rounded-xl px-4 py-3 transition-all duration-300"
              >
                <User className="h-4 w-4" />
                <span className="font-medium">Login</span>
              </Button>

              <Button 
                asChild 
                className="glass-pink hover:glass-pink-hover rounded-xl px-6 py-3 text-white font-semibold transition-all duration-300 transform hover:scale-105 shadow-glass-pink"
              >
                <Link to="/book" className="flex items-center space-x-2">
                  <Calendar className="h-5 w-5" />
                  <span>Book Now</span>
                </Link>
              </Button>

              {/* Mobile Menu with glassmorphism */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="lg:hidden glass hover:glass-pink-hover rounded-xl p-3 transition-all duration-300"
                  >
                    <Menu className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent 
                  side="right" 
                  className="w-[300px] sm:w-[400px] glass-white border-l border-white/20 backdrop-blur-xl"
                >
                  <div className="flex items-center justify-between mb-8">
                    <span className="font-bold text-xl bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                      WaxSmart
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setIsOpen(false)}
                      className="glass hover:glass-pink-hover rounded-xl p-2"
                    >
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <div className="flex flex-col space-y-4">
                    {navigation.map((item) => {
                      const IconComponent = item.icon;
                      return (
                        <div key={item.name}>
                          <Link
                            to={item.href}
                            className={`glass hover:glass-pink-hover rounded-xl p-4 flex items-center space-x-3 transition-all duration-300 ${
                              isActive(item.href) ? 'glass-pink text-white' : 'text-gray-700'
                            }`}
                            onClick={() => setIsOpen(false)}
                          >
                            <IconComponent className="h-5 w-5" />
                            <span className="font-semibold text-lg">{item.name}</span>
                          </Link>
                          {item.submenu && (
                            <div className="ml-6 mt-2 space-y-2">
                              {item.submenu.map((subItem) => (
                                <Link
                                  key={subItem.name}
                                  to={subItem.href}
                                  className="glass hover:glass-cyan-hover rounded-lg px-4 py-3 flex items-center space-x-3 transition-all duration-300"
                                  onClick={() => setIsOpen(false)}
                                >
                                  <span className="text-lg">{subItem.icon}</span>
                                  <span className="text-sm font-medium">{subItem.name}</span>
                                </Link>
                              ))}
                            </div>
                          )}
                        </div>
                      );
                    })}
                    
                    <div className="border-t border-white/20 pt-6 space-y-3">
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start glass hover:glass-cyan-hover rounded-xl p-4 transition-all duration-300"
                      >
                        <MapPin className="h-5 w-5 mr-3" />
                        <span className="font-medium">Find Center</span>
                      </Button>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-start glass hover:glass-purple-hover rounded-xl p-4 transition-all duration-300"
                      >
                        <User className="h-5 w-5 mr-3" />
                        <span className="font-medium">Login</span>
                      </Button>
                      <Button 
                        asChild 
                        className="w-full justify-start glass-pink hover:glass-pink-hover rounded-xl p-4 text-white font-semibold transition-all duration-300"
                      >
                        <Link to="/book" onClick={() => setIsOpen(false)} className="flex items-center">
                          <Calendar className="h-5 w-5 mr-3" />
                          <span>Book Appointment</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header; 