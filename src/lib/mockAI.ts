import { TripFormData, DayPlan, BudgetBreakdown, Activity } from '@/types/trip';
import { differenceInDays, format, addDays } from 'date-fns';

const destinationData: Record<string, { lat: number; lng: number; attractions: string[]; restaurants: string[]; hotels: string[] }> = {
  'paris': {
    lat: 48.8566,
    lng: 2.3522,
    attractions: ['Eiffel Tower', 'Louvre Museum', 'Notre-Dame Cathedral', 'Arc de Triomphe', 'Sacré-Cœur', 'Champs-Élysées'],
    restaurants: ['Le Jules Verne', 'Café de Flore', 'L\'Ambroisie', 'Le Comptoir du Panthéon', 'Pink Mamma'],
    hotels: ['Hôtel Plaza Athénée', 'Le Meurice', 'Hôtel de Crillon']
  },
  'tokyo': {
    lat: 35.6762,
    lng: 139.6503,
    attractions: ['Senso-ji Temple', 'Tokyo Skytree', 'Meiji Shrine', 'Shibuya Crossing', 'Tokyo Tower', 'Imperial Palace'],
    restaurants: ['Sukiyabashi Jiro', 'Ichiran Ramen', 'Tsukiji Outer Market', 'Gonpachi', 'Robot Restaurant'],
    hotels: ['Park Hyatt Tokyo', 'Aman Tokyo', 'The Peninsula Tokyo']
  },
  'new york': {
    lat: 40.7128,
    lng: -74.0060,
    attractions: ['Statue of Liberty', 'Central Park', 'Empire State Building', 'Times Square', 'Brooklyn Bridge', 'Metropolitan Museum'],
    restaurants: ['Katz\'s Delicatessen', 'Le Bernardin', 'Eleven Madison Park', 'Joe\'s Pizza', 'Peter Luger'],
    hotels: ['The Plaza', 'The Ritz-Carlton', 'Four Seasons']
  },
  'london': {
    lat: 51.5074,
    lng: -0.1278,
    attractions: ['Big Ben', 'Tower of London', 'British Museum', 'Buckingham Palace', 'London Eye', 'Westminster Abbey'],
    restaurants: ['The Ledbury', 'Dishoom', 'Sketch', 'Duck & Waffle', 'Borough Market'],
    hotels: ['The Savoy', 'Claridge\'s', 'The Ritz London']
  },
  'default': {
    lat: 40.7128,
    lng: -74.0060,
    attractions: ['City Center', 'Main Museum', 'Historic District', 'Local Park', 'Cultural Center', 'Viewpoint'],
    restaurants: ['Local Bistro', 'Traditional Restaurant', 'Street Food Market', 'Café Central', 'Fine Dining'],
    hotels: ['Grand Hotel', 'Boutique Stay', 'City Lodge']
  }
};

function getDestinationInfo(destination: string) {
  const key = destination.toLowerCase();
  return destinationData[key] || destinationData['default'];
}

function generateRandomOffset(base: number, range: number): number {
  return base + (Math.random() - 0.5) * range;
}

function generateActivity(
  id: string,
  time: string,
  title: string,
  type: Activity['type'],
  baseLat: number,
  baseLng: number
): Activity {
  const descriptions: Record<Activity['type'], string[]> = {
    attraction: ['Must-see landmark', 'Popular tourist spot', 'Historic site', 'Cultural gem'],
    restaurant: ['Highly rated cuisine', 'Local favorite', 'Authentic experience', 'Award-winning'],
    hotel: ['Comfortable stay', 'Great amenities', 'Central location', 'Excellent reviews'],
    transport: ['Scenic route', 'Quick transfer', 'Convenient connection'],
    activity: ['Exciting experience', 'Unique adventure', 'Memorable moment']
  };

  return {
    id,
    time,
    title,
    description: descriptions[type][Math.floor(Math.random() * descriptions[type].length)],
    duration: type === 'restaurant' ? '1.5 hours' : type === 'hotel' ? 'Overnight' : '2-3 hours',
    type,
    location: {
      lat: generateRandomOffset(baseLat, 0.05),
      lng: generateRandomOffset(baseLng, 0.05),
      address: `${title}, ${type === 'hotel' ? 'Hotel District' : 'City Center'}`
    }
  };
}

export function generateItinerary(formData: TripFormData): DayPlan[] {
  const days = differenceInDays(formData.endDate, formData.startDate) + 1;
  const destInfo = getDestinationInfo(formData.destination);
  const itinerary: DayPlan[] = [];

  for (let i = 0; i < days; i++) {
    const date = addDays(formData.startDate, i);
    const activities: Activity[] = [];

    // Morning activity
    activities.push(
      generateActivity(
        `day${i + 1}-1`,
        '09:00',
        destInfo.attractions[i % destInfo.attractions.length],
        'attraction',
        destInfo.lat,
        destInfo.lng
      )
    );

    // Lunch
    activities.push(
      generateActivity(
        `day${i + 1}-2`,
        '12:30',
        destInfo.restaurants[i % destInfo.restaurants.length],
        'restaurant',
        destInfo.lat,
        destInfo.lng
      )
    );

    // Afternoon activity
    activities.push(
      generateActivity(
        `day${i + 1}-3`,
        '14:30',
        destInfo.attractions[(i + 1) % destInfo.attractions.length],
        'attraction',
        destInfo.lat,
        destInfo.lng
      )
    );

    // Evening
    if (formData.tripType === 'foodie' || formData.tripType === 'mixed') {
      activities.push(
        generateActivity(
          `day${i + 1}-4`,
          '19:00',
          destInfo.restaurants[(i + 1) % destInfo.restaurants.length],
          'restaurant',
          destInfo.lat,
          destInfo.lng
        )
      );
    } else {
      activities.push(
        generateActivity(
          `day${i + 1}-4`,
          '18:00',
          `Evening at ${destInfo.attractions[(i + 2) % destInfo.attractions.length]}`,
          'activity',
          destInfo.lat,
          destInfo.lng
        )
      );
    }

    itinerary.push({
      day: i + 1,
      date: format(date, 'EEEE, MMM d'),
      activities
    });
  }

  return itinerary;
}

export function calculateBudget(formData: TripFormData): BudgetBreakdown {
  const days = differenceInDays(formData.endDate, formData.startDate) + 1;
  const travelers = formData.travelers;
  
  // Base costs per person per day (adjust based on trip type)
  const multiplier = formData.tripType === 'relaxation' ? 1.3 : 
                     formData.tripType === 'adventure' ? 1.1 : 1;

  const accommodationPerDay = (formData.budget * 0.35 / days) * multiplier;
  const foodPerDay = (formData.budget * 0.25 / days) * multiplier;
  const activitiesPerDay = (formData.budget * 0.25 / days) * multiplier;
  const transportPerDay = (formData.budget * 0.15 / days);

  return {
    accommodation: Math.round(accommodationPerDay * days),
    food: Math.round(foodPerDay * days * travelers),
    activities: Math.round(activitiesPerDay * days * travelers),
    transport: Math.round(transportPerDay * days),
    total: formData.budget
  };
}

export function getDestinationCoordinates(destination: string): { lat: number; lng: number } {
  const destInfo = getDestinationInfo(destination);
  return { lat: destInfo.lat, lng: destInfo.lng };
}
