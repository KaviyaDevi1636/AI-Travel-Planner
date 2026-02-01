import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { SavedTripCard } from '@/components/trip/SavedTripCard';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Bookmark, Plane, Trash2 } from 'lucide-react';
import { Trip } from '@/types/trip';
import { getTrips, deleteTrip } from '@/lib/storage';

export default function SavedTrips() {
  const [trips, setTrips] = useState<Trip[]>([]);

  useEffect(() => {
    setTrips(getTrips());
  }, []);

  const handleDelete = (id: string) => {
    deleteTrip(id);
    setTrips(getTrips());
    toast.success('Trip deleted');
  };

  return (
    <div className="min-h-screen flex flex-col bg-muted/20">
      <Header />

      <main className="flex-1 container py-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold flex items-center gap-2">
                <Bookmark className="h-8 w-8 text-primary" />
                Saved Trips
              </h1>
              <p className="text-muted-foreground mt-1">
                {trips.length} {trips.length === 1 ? 'trip' : 'trips'} saved
              </p>
            </div>
            <Link to="/planner">
              <Button>
                <Plane className="h-4 w-4 mr-2" />
                Plan New Trip
              </Button>
            </Link>
          </div>

          {trips.length === 0 ? (
            <div className="text-center py-16 bg-background rounded-lg border">
              <Bookmark className="h-16 w-16 mx-auto text-muted-foreground/50 mb-4" />
              <h2 className="text-xl font-semibold mb-2">No saved trips yet</h2>
              <p className="text-muted-foreground mb-6">
                Start planning your first adventure!
              </p>
              <Link to="/planner">
                <Button>
                  <Plane className="h-4 w-4 mr-2" />
                  Plan Your First Trip
                </Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {trips.map((trip) => (
                <SavedTripCard
                  key={trip.id}
                  trip={trip}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
