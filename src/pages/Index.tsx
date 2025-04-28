import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="max-w-4xl mx-auto mb-8">
        <h1 className="text-4xl md:text-5xl font-bold text-center text-purple-900 mb-6">
          Waxpass Booking Experience
        </h1>
        <p className="text-center text-lg text-gray-700 mb-12">
          Explore our different user interface variations to find and book the perfect wax service
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle>Map-based View</CardTitle>
            <CardDescription className="text-purple-100">
              Select location from an interactive map
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Find nearby waxing centers by browsing an interactive map with location markers.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/map-view">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle>Step-by-Step Flow</CardTitle>
            <CardDescription className="text-purple-100">
              Guided booking process
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Experience a wizard-like booking flow that guides you through each stage of the process.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/step-by-step">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle>Card-Based Selection</CardTitle>
            <CardDescription className="text-purple-100">
              Visual card-based interface
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Browse locations and services using an intuitive card-based interface with rich visuals.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/card-based">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle>Single Page Experience</CardTitle>
            <CardDescription className="text-purple-100">
              All in one page interface
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Complete your booking on a single page with dynamic content that adapts to your selections.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/single-page">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all">
          <CardHeader className="bg-gradient-to-r from-purple-500 to-purple-700 text-white">
            <CardTitle>Tab Layout</CardTitle>
            <CardDescription className="text-purple-100">
              Tabbed interface experience
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Navigate between different aspects of your booking using a clean, tabbed interface.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/tab-layout">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>

        <Card className="hover:shadow-lg transition-all border-purple-400">
          <CardHeader className="bg-gradient-to-r from-purple-700 to-purple-900 text-white">
            <CardTitle>Service Selector</CardTitle>
            <CardDescription className="text-purple-100">
              Innovative service selection
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <p className="text-gray-600">Explore multiple innovative ways to browse and select waxing services with a focus on UX.</p>
          </CardContent>
          <CardFooter>
            <Button asChild className="w-full">
              <Link to="/service-selector">View Demo</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

export default Index;
