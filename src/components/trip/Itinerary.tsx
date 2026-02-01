import { DayPlan } from '@/types/trip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, MapPin, Utensils, Building, Car, Camera } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ItineraryProps {
  itinerary: DayPlan[];
  onActivityClick?: (lat: number, lng: number) => void;
}

const activityIcons = {
  attraction: Camera,
  restaurant: Utensils,
  hotel: Building,
  transport: Car,
  activity: MapPin,
};

const activityColors = {
  attraction: 'bg-primary/10 text-primary border-primary/20',
  restaurant: 'bg-orange-100 text-orange-700 border-orange-200',
  hotel: 'bg-purple-100 text-purple-700 border-purple-200',
  transport: 'bg-green-100 text-green-700 border-green-200',
  activity: 'bg-blue-100 text-blue-700 border-blue-200',
};

export function Itinerary({ itinerary, onActivityClick }: ItineraryProps) {
  return (
    <div className="space-y-6">
      {itinerary.map((day) => (
        <Card key={day.day} className="overflow-hidden">
          <CardHeader className="bg-muted/50">
            <CardTitle className="flex items-center justify-between">
              <span>Day {day.day}</span>
              <Badge variant="secondary" className="font-normal">
                {day.date}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="divide-y">
              {day.activities.map((activity, index) => {
                const Icon = activityIcons[activity.type];
                return (
                  <div
                    key={activity.id}
                    className={cn(
                      'p-4 hover:bg-muted/30 transition-colors cursor-pointer',
                      index === 0 && 'pt-4'
                    )}
                    onClick={() => onActivityClick?.(activity.location.lat, activity.location.lng)}
                  >
                    <div className="flex items-start gap-4">
                      <div className={cn(
                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border',
                        activityColors[activity.type]
                      )}>
                        <Icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-sm font-medium text-muted-foreground">
                            {activity.time}
                          </span>
                          <Badge variant="outline" className="text-xs">
                            {activity.duration}
                          </Badge>
                        </div>
                        <h4 className="font-semibold truncate">{activity.title}</h4>
                        <p className="text-sm text-muted-foreground">{activity.description}</p>
                        <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{activity.location.address}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
