import { Trip } from '@/types/trip';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { MapPin, Calendar, Users, Trash2, Eye } from 'lucide-react';
import { format, parseISO } from 'date-fns';
import { Link } from 'react-router-dom';

interface SavedTripCardProps {
  trip: Trip;
  onDelete: (id: string) => void;
}

export function SavedTripCard({ trip, onDelete }: SavedTripCardProps) {
  const tripTypeEmoji: Record<string, string> = {
    adventure: '🏔️',
    relaxation: '🏖️',
    cultural: '🏛️',
    foodie: '🍽️',
    mixed: '✨',
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              {trip.destination}
            </CardTitle>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="secondary">
                {tripTypeEmoji[trip.tripType]} {trip.tripType}
              </Badge>
            </div>
          </div>
          <Badge variant="outline" className="text-xs">
            ${trip.budgetBreakdown.total.toLocaleString()}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pb-3">
        <div className="flex flex-col gap-2 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <span>
              {format(parseISO(trip.startDate), 'MMM d')} - {format(parseISO(trip.endDate), 'MMM d, yyyy')}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            <span>{trip.travelers} {trip.travelers === 1 ? 'traveler' : 'travelers'}</span>
          </div>
        </div>
        
        <p className="text-xs text-muted-foreground mt-3">
          {trip.itinerary.length} days • {trip.itinerary.reduce((acc, day) => acc + day.activities.length, 0)} activities
        </p>
      </CardContent>
      
      <CardFooter className="pt-3 border-t flex gap-2">
        <Link to={`/trip/${trip.id}`} className="flex-1">
          <Button variant="default" className="w-full" size="sm">
            <Eye className="h-4 w-4 mr-2" />
            View Trip
          </Button>
        </Link>
        <Button
          variant="outline"
          size="sm"
          onClick={() => onDelete(trip.id)}
          className="text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
}
