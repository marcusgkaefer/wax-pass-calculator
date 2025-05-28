import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Menu, X, ChevronDown, MapPin, User, ShoppingBag } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Services dropdown content
  const servicesContent = (
    <div className="w-[500px] p-4 md:grid md:grid-cols-2 md:gap-6">
      <div>
        <h3 className="font-medium text-primary mb-2 text-sm">Body Waxing</h3>
        <ul className="space-y-2">
          <li><Link href="/services/brazilian" className="text-sm hover:text-primary">Brazilian Wax</Link></li>
          <li><Link href="/services/bikini" className="text-sm hover:text-primary">Bikini Wax</Link></li>
          <li><Link href="/services/legs" className="text-sm hover:text-primary">Leg Wax</Link></li>
          <li><Link href="/services/arms" className="text-sm hover:text-primary">Arm Wax</Link></li>
          <li><Link href="/services/back" className="text-sm hover:text-primary">Back Wax</Link></li>
          <li><Link href="/services/chest" className="text-sm hover:text-primary">Chest Wax</Link></li>
        </ul>
      </div>
      <div>
        <h3 className="font-medium text-primary mb-2 text-sm">Facial Waxing</h3>
        <ul className="space-y-2">
          <li><Link href="/services/eyebrows" className="text-sm hover:text-primary">Eyebrow Wax</Link></li>
          <li><Link href="/services/lip" className="text-sm hover:text-primary">Lip Wax</Link></li>
          <li><Link href="/services/chin" className="text-sm hover:text-primary">Chin Wax</Link></li>
          <li><Link href="/services/face" className="text-sm hover:text-primary">Full Face Wax</Link></li>
        </ul>
        <div className="mt-4 pt-3 border-t">
          <Link href="/services" className="text-primary text-sm font-medium">View All Services →</Link>
        </div>
      </div>
    </div>
  );

  // Membership dropdown content
  const membershipContent = (
    <div className="w-[400px] p-4">
      <div className="grid gap-4">
        <div className="bg-muted/50 p-3 rounded-lg">
          <h3 className="font-medium text-primary mb-1">Unlimited Wax Pass</h3>
          <p className="text-sm text-muted-foreground mb-2">Unlimited monthly waxing services at a fixed price</p>
          <Link href="/wax-pass/unlimited" className="text-primary text-sm">Learn More →</Link>
        </div>
        <div className="bg-muted/50 p-3 rounded-lg">
          <h3 className="font-medium text-primary mb-1">Prepaid Wax Pass</h3>
          <p className="text-sm text-muted-foreground mb-2">Bundle services and save with prepaid packages</p>
          <Link href="/wax-pass/prepaid" className="text-primary text-sm">Learn More →</Link>
        </div>
        <div className="pt-2 border-t text-center">
          <Button asChild className="w-full">
            <Link href="/wax-pass/find">Find My Best Pass</Link>
          </Button>
        </div>
      </div>
    </div>
  );

  return (
    <header className={cn(
      "sticky top-0 z-50 w-full transition-all duration-200",
      isScrolled ? "bg-white border-b shadow-sm" : "bg-transparent"
    )}>
      <div className="hidden lg:block bg-primary text-primary-foreground py-1">
        <div className="container flex justify-between items-center">
          <div className="flex items-center space-x-6 text-xs">
            <Link href="/locations" className="hover:underline flex items-center">
              <MapPin className="h-3 w-3 mr-1" /> Find a Wax Center
            </Link>
            <Link href="/careers" className="hover:underline">Careers</Link>
            <Link href="/franchising" className="hover:underline">Franchising</Link>
          </div>
          <div className="text-xs">
            <span>First-time guests: Get a free wax! <Link href="/offers/free-wax" className="underline font-medium">Learn more</Link></span>
          </div>
        </div>
      </div>
      
      <div className="container flex h-16 items-center justify-between">
        {/* Logo */}
        <div className="flex items-center">
          <Link href="/" className="font-bold text-xl mr-6">
            WaxSmart
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex">
            <NavigationMenu>
              <NavigationMenuList>
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Services</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {servicesContent}
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <NavigationMenuTrigger>Wax Pass</NavigationMenuTrigger>
                  <NavigationMenuContent>
                    {membershipContent}
                  </NavigationMenuContent>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/locations" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Locations
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
                
                <NavigationMenuItem>
                  <Link href="/promotions" legacyBehavior passHref>
                    <NavigationMenuLink className="group inline-flex h-9 w-max items-center justify-center rounded-md bg-background px-4 py-2 text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground focus:outline-none disabled:pointer-events-none disabled:opacity-50 data-[active]:bg-accent/50 data-[state=open]:bg-accent/50">
                      Promotions
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>
          </div>
        </div>
        
        {/* Action Buttons */}
        <div className="flex items-center space-x-1 lg:space-x-2">
          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="hidden md:flex">
                <User className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem asChild>
                <Link href="/account/login">Sign In</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/register">Create Account</Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/account/passes">My Wax Passes</Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href="/account/appointments">My Appointments</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {/* Cart/Bag Icon */}
          <Button variant="ghost" size="icon" className="hidden md:flex relative">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -top-1 -right-1 bg-primary text-primary-foreground text-xs rounded-full h-4 w-4 flex items-center justify-center">
              2
            </span>
          </Button>
          
          {/* Book Now Button */}
          <Button size="sm" className="hidden md:flex whitespace-nowrap">
            Book Now
          </Button>
          
          {/* Mobile Menu Trigger */}
          <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="lg:hidden">
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="lg:hidden w-full sm:w-80">
              <div className="py-4">
                <Link href="/" className="font-bold text-xl block mb-6">
                  WaxSmart
                </Link>
                
                <div className="space-y-4">
                  <div className="mb-8">
                    <Button className="w-full flex justify-center items-center">
                      Book Now
                    </Button>
                  </div>
                  
                  <Accordion item="Services" content={
                    <div className="ml-4 space-y-2 mt-2">
                      <h3 className="font-medium text-primary mb-1 text-sm">Body Waxing</h3>
                      <div className="space-y-2">
                        <div><Link href="/services/brazilian" className="text-sm">Brazilian Wax</Link></div>
                        <div><Link href="/services/bikini" className="text-sm">Bikini Wax</Link></div>
                        <div><Link href="/services/legs" className="text-sm">Leg Wax</Link></div>
                        <div><Link href="/services/arms" className="text-sm">Arm Wax</Link></div>
                      </div>
                      
                      <h3 className="font-medium text-primary mb-1 mt-4 text-sm">Facial Waxing</h3>
                      <div className="space-y-2">
                        <div><Link href="/services/eyebrows" className="text-sm">Eyebrow Wax</Link></div>
                        <div><Link href="/services/lip" className="text-sm">Lip Wax</Link></div>
                        <div><Link href="/services/face" className="text-sm">Full Face Wax</Link></div>
                      </div>
                      <div><Link href="/services" className="text-primary text-sm mt-2 block">View All Services →</Link></div>
                    </div>
                  } />
                  
                  <Accordion item="Wax Pass" content={
                    <div className="ml-4 space-y-3 mt-2">
                      <div>
                        <h3 className="font-medium mb-1">Unlimited Wax Pass</h3>
                        <p className="text-sm text-muted-foreground">Unlimited monthly waxing</p>
                        <Link href="/wax-pass/unlimited" className="text-primary text-sm">Learn More →</Link>
                      </div>
                      <div>
                        <h3 className="font-medium mb-1">Prepaid Wax Pass</h3>
                        <p className="text-sm text-muted-foreground">Bundle services and save</p>
                        <Link href="/wax-pass/prepaid" className="text-primary text-sm">Learn More →</Link>
                      </div>
                      <div className="pt-2">
                        <Link href="/wax-pass/find" className="text-primary text-sm font-medium">
                          Find My Best Pass →
                        </Link>
                      </div>
                    </div>
                  } />
                  
                  <div className="py-2 border-t border-b">
                    <Link href="/locations" className="py-2 flex items-center">
                      <MapPin className="mr-2 h-4 w-4" /> Find a Wax Center
                    </Link>
                  </div>
                  
                  <div>
                    <Link href="/promotions" className="py-2 block">
                      Promotions
                    </Link>
                  </div>
                  
                  <div className="pt-4 border-t">
                    <div className="space-y-2">
                      <Link href="/account/login" className="py-1 block text-sm">
                        Sign In
                      </Link>
                      <Link href="/account/register" className="py-1 block text-sm">
                        Create Account
                      </Link>
                      <Link href="/account/passes" className="py-1 block text-sm">
                        My Wax Passes
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

// Helper component for mobile accordion menu
const Accordion = ({ item, content }: { item: string, content: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <div className="border-b pb-2">
      <div className="flex justify-between items-center py-2 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <span className="font-medium">{item}</span>
        <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </div>
      {isOpen && (
        <div className="py-2">
          {content}
        </div>
      )}
    </div>
  );
};

export default Navbar; 