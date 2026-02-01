import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Itinerary } from '@/components/trip/Itinerary';
import { BudgetDisplay } from '@/components/trip/BudgetDisplay';
import { TripMap } from '@/components/trip/TripMap';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Map, DollarSign, Trash2 } from 'lucide-react';
import { Trip } from '@/types/trip';
import { getTrip, deleteTrip } from '@/lib/storage';
import { getDestinationCoordinates } from '@/lib/mockAI';
import { format, parseISO } from 'date-fns';

export default function TripDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [trip, setTrip] = useState<Trip | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 48.8566, lng: 2.3522 });

  useEffect(() => {
    if (id) {
      const foundTrip = getTrip(id);
      if (foundTrip) {
        setTrip(foundTrip);
        setMapCenter(getDestinationCoordinates(foundTrip.destination));
      } else {
        navigate('/saved');
      }
    }
  }, [id, navigate]);

  const handleDelete = () => {
    if (trip) {
      deleteTrip(trip.id);
      toast.success('Trip deleted');
      navigate('/saved');
    }
  };

  const handleActivityClick = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  if (!trip) {
    return null;
  }

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Back Button */}
          <Link to="/saved">
            <Button variant="ghost" className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              Back to Saved Trips
            </Button>
          </Link>

          {/* Trip Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-background p-6 rounded-lg border">
            <div>
              <h1 className="text-2xl font-bold mb-1">
                Trip to {trip.destination}
              </h1>
              <p className="text-muted-foreground">
                {format(parseISO(trip.startDate), 'MMM d')} -{' '}
                {format(parseISO(trip.endDate), 'MMM d, yyyy')} •{' '}
                {trip.travelers} travelers
              </p>
            </div>
            <Button
              variant="outline"
              onClick={handleDelete}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Trip
            </Button>
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
                itinerary={trip.itinerary}
                onActivityClick={handleActivityClick}
              />
            </TabsContent>

            <TabsContent value="map">
              <TripMap
                itinerary={trip.itinerary}
                center={mapCenter}
                destination={trip.destination}
              />
            </TabsContent>

            <TabsContent value="budget">
              <BudgetDisplay budget={trip.budgetBreakdown} />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
