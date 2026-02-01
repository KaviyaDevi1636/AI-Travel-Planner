/// <reference types="@types/google.maps" />

import { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Map, ExternalLink, MapPin } from 'lucide-react';
import { DayPlan } from '@/types/trip';

declare global {
  interface Window {
    google: typeof google;
  }
}

interface TripMapProps {
  itinerary: DayPlan[];
  center: { lat: number; lng: number };
  destination: string;
}

export function TripMap({ itinerary, center, destination }: TripMapProps) {
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  // Get all locations from itinerary
  const locations = itinerary.flatMap(day => 
    day.activities.map(activity => ({
      ...activity.location,
      title: activity.title,
      type: activity.type,
      day: day.day,
    }))
  );

  useEffect(() => {
    // Check if Google Maps is already loaded
    if (window.google && window.google.maps) {
      setMapLoaded(true);
      return;
    }

    // Load Google Maps script
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = () => setMapLoaded(true);
    document.head.appendChild(script);

    return () => {
      // Cleanup if needed
    };
  }, []);

  useEffect(() => {
    if (!mapLoaded || !mapRef.current || !window.google) return;

    const newMap = new window.google.maps.Map(mapRef.current, {
      center,
      zoom: 13,
      styles: [
        {
          featureType: 'poi',
          elementType: 'labels',
          stylers: [{ visibility: 'off' }],
        },
      ],
      mapTypeControl: false,
      streetViewControl: false,
    });

    // Add markers for each location
    locations.forEach((location, index) => {
      const marker = new window.google.maps.Marker({
        position: { lat: location.lat, lng: location.lng },
        map: newMap,
        title: location.title,
        label: {
          text: String(index + 1),
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold',
        },
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px;">
            <strong>Day ${location.day}</strong>
            <p style="margin: 4px 0 0;">${location.title}</p>
            <small style="color: #666;">${location.address}</small>
          </div>
        `,
      });

      marker.addListener('click', () => {
        infoWindow.open(newMap, marker);
      });
    });

    // Draw route between locations
    if (locations.length > 1) {
      const path = locations.map(loc => ({ lat: loc.lat, lng: loc.lng }));
      new window.google.maps.Polyline({
        path,
        geodesic: true,
        strokeColor: '#0ea5e9',
        strokeOpacity: 0.8,
        strokeWeight: 3,
        map: newMap,
      });
    }

    setMap(newMap);
  }, [mapLoaded, center, locations]);

  const openInGoogleMaps = () => {
    const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destination)}`;
    window.open(url, '_blank');
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="flex items-center gap-2">
          <Map className="h-5 w-5 text-primary" />
          Trip Map
        </CardTitle>
        <Button variant="outline" size="sm" onClick={openInGoogleMaps}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Open in Maps
        </Button>
      </CardHeader>
      <CardContent>
        {/* Map Container */}
        <div
          ref={mapRef}
          className="w-full h-[400px] rounded-lg bg-muted flex items-center justify-center"
        >
          {!mapLoaded && (
            <div className="text-center text-muted-foreground">
              <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>Loading map...</p>
              <p className="text-xs mt-2">
                Note: Add your Google Maps API key for full functionality
              </p>
            </div>
          )}
        </div>

        {/* Locations Legend */}
        <div className="mt-4 flex flex-wrap gap-2">
          {locations.slice(0, 6).map((location, index) => (
            <div
              key={index}
              className="flex items-center gap-1 text-xs bg-muted px-2 py-1 rounded-full"
            >
              <span className="w-5 h-5 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-[10px] font-bold">
                {index + 1}
              </span>
              <span className="truncate max-w-[100px]">{location.title}</span>
            </div>
          ))}
          {locations.length > 6 && (
            <span className="text-xs text-muted-foreground self-center">
              +{locations.length - 6} more
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
