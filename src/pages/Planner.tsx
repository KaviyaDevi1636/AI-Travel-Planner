import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { TripForm } from '@/components/trip/TripForm';
import { Itinerary } from '@/components/trip/Itinerary';
import { BudgetDisplay } from '@/components/trip/BudgetDisplay';
import { TripMap } from '@/components/trip/TripMap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { Save, RotateCcw, Calendar, Map, DollarSign } from 'lucide-react';
import { TripFormData, DayPlan, BudgetBreakdown, Trip } from '@/types/trip';
import { generateItinerary, calculateBudget, getDestinationCoordinates } from '@/lib/mockAI';
import { saveTrip } from '@/lib/storage';
import { format } from 'date-fns';

export default function Planner() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [itinerary, setItinerary] = useState<DayPlan[] | null>(null);
  const [budget, setBudget] = useState<BudgetBreakdown | null>(null);
  const [formData, setFormData] = useState<TripFormData | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 });

  const handleGenerateTrip = async (data: TripFormData) => {
    setIsLoading(true);
    setFormData(data);

    // Simulate AI processing time
    await new Promise((resolve) => setTimeout(resolve, 1500));

    try {
      const generatedItinerary = generateItinerary(data);
      const calculatedBudget = calculateBudget(data);
      const coordinates = getDestinationCoordinates(data.destination);

      setItinerary(generatedItinerary);
      setBudget(calculatedBudget);
      setMapCenter(coordinates);

      toast.success('Your trip has been planned!', {
        description: `${generatedItinerary.length} days of adventure in ${data.destination}`,
      });
    } catch (error) {
      toast.error('Failed to generate itinerary', {
        description: 'Please try again',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveTrip = () => {
    if (!formData || !itinerary || !budget) return;

    const trip: Trip = {
      id: Date.now().toString(),
      destination: formData.destination,
      startDate: formData.startDate.toISOString(),
      endDate: formData.endDate.toISOString(),
      travelers: formData.travelers,
      tripType: formData.tripType,
      budget: formData.budget,
      itinerary,
      budgetBreakdown: budget,
      createdAt: new Date().toISOString(),
    };

    saveTrip(trip);
    toast.success('Trip saved!', {
      description: 'You can find it in your saved trips',
      action: {
        label: 'View',
        onClick: () => navigate('/saved'),
      },
    });
  };

  const handleReset = () => {
    setItinerary(null);
    setBudget(null);
    setFormData(null);
  };

  const handleActivityClick = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto">
          {!itinerary ? (
            <div className="max-w-xl mx-auto">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold mb-2">Plan Your Trip</h1>
                <p className="text-muted-foreground">
                  Fill in your travel details and let AI create your perfect itinerary
                </p>
              </div>
              <TripForm onSubmit={handleGenerateTrip} isLoading={isLoading} />
            </div>
          ) : (
            <div className="space-y-6">
              {/* Trip Header */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background p-6 rounded-lg border">
                <div>
                  <h1 className="text-2xl font-bold mb-1">
                    Your Trip to {formData?.destination}
                  </h1>
                  <p className="text-muted-foreground">
                    {formData && format(formData.startDate, 'MMM d')} -{' '}
                    {formData && format(formData.endDate, 'MMM d, yyyy')} •{' '}
                    {formData?.travelers} travelers
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleReset}>
                    <RotateCcw className="h-4 w-4 mr-2" />
                    New Trip
                  </Button>
                  <Button onClick={handleSaveTrip}>
                    <Save className="h-4 w-4 mr-2" />
                    Save Trip
                  </Button>
                </div>
              </div>

              {/* Content Tabs */}
              <Tabs defaultValue="itinerary" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-6">
                  <TabsTrigger value="itinerary" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Itinerary</span>
                  </TabsTrigger>
                  <TabsTrigger value="map" className="gap-2">
                    <Map className="h-4 w-4" />
                    <span className="hidden sm:inline">Map</span>
                  </TabsTrigger>
                  <TabsTrigger value="budget" className="gap-2">
                    <DollarSign className="h-4 w-4" />
                    <span className="hidden sm:inline">Budget</span>
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary">
                  <Itinerary
                    itinerary={itinerary}
                    onActivityClick={handleActivityClick}
                  />
                </TabsContent>

                <TabsContent value="map">
                  <TripMap
                    itinerary={itinerary}
                    center={mapCenter}
                    destination={formData?.destination || ''}
                  />
                </TabsContent>

                <TabsContent value="budget">
                  {budget && <BudgetDisplay budget={budget} />}
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
