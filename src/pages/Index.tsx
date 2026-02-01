import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plane, Map, DollarSign, Bookmark, Sparkles, ArrowRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

const Index = () => {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Itineraries',
      description: 'Get personalized day-by-day travel plans tailored to your preferences',
    },
    {
      icon: DollarSign,
      title: 'Smart Budget Estimation',
      description: 'Know your costs upfront with detailed budget breakdowns',
    },
    {
      icon: Map,
      title: 'Interactive Maps',
      description: 'Visualize your entire trip with Google Maps integration',
    },
    {
      icon: Bookmark,
      title: 'Save Your Trips',
      description: 'Keep all your travel plans organized and accessible',
    },
  ];

  const popularDestinations = [
    { name: 'Paris', emoji: '🗼', country: 'France' },
    { name: 'Tokyo', emoji: '🏯', country: 'Japan' },
    { name: 'New York', emoji: '🗽', country: 'USA' },
    { name: 'London', emoji: '🎡', country: 'UK' },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container py-20 md:py-32">
            <div className="max-w-3xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="h-4 w-4" />
                AI-Powered Travel Planning
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Plan Your Perfect Trip with{' '}
                <span className="text-primary">Artificial Intelligence</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                Tell us where you want to go, and our AI will create a personalized itinerary complete with activities, budget estimates, and interactive maps.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link to="/planner">
                  <Button size="lg" className="gap-2 text-lg px-8">
                    <Plane className="h-5 w-5" />
                    Start Planning
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/saved">
                  <Button size="lg" variant="outline" className="gap-2 text-lg px-8">
                    <Bookmark className="h-5 w-5" />
                    View Saved Trips
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Decorative elements */}
          <div className="absolute top-20 left-10 w-20 h-20 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/20 rounded-full blur-3xl" />
        </section>

        {/* Features Section */}
        <section className="py-16 md:py-24 bg-muted/30">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Everything You Need to Plan
              </h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our AI travel planner handles all the details so you can focus on the adventure
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {features.map((feature) => (
                <Card key={feature.title} className="border-0 shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="pt-6">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                      <feature.icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Popular Destinations */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Popular Destinations
              </h2>
              <p className="text-muted-foreground">
                Get inspired by these trending travel spots
              </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {popularDestinations.map((dest) => (
                <Link key={dest.name} to={`/planner?destination=${dest.name}`}>
                  <Card className="group cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1">
                    <CardContent className="p-6 text-center">
                      <span className="text-4xl mb-3 block">{dest.emoji}</span>
                      <h3 className="font-semibold group-hover:text-primary transition-colors">
                        {dest.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">{dest.country}</p>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 md:py-24 bg-primary text-primary-foreground">
          <div className="container text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Ready for Your Next Adventure?
            </h2>
            <p className="text-primary-foreground/80 mb-8 max-w-xl mx-auto">
              Let AI handle the planning while you dream about the destination
            </p>
            <Link to="/planner">
              <Button size="lg" variant="secondary" className="gap-2 text-lg">
                <Plane className="h-5 w-5" />
                Plan My Trip Now
              </Button>
            </Link>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Index;
