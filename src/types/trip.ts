export interface TripFormData {
  destination: string;
  startDate: Date;
  endDate: Date;
  travelers: number;
  tripType: 'adventure' | 'relaxation' | 'cultural' | 'foodie' | 'mixed';
  budget: number;
}

export interface Activity {
  id: string;
  time: string;
  title: string;
  description: string;
  duration: string;
  type: 'attraction' | 'restaurant' | 'hotel' | 'transport' | 'activity';
  location: {
    lat: number;
    lng: number;
    address: string;
  };
}

export interface DayPlan {
  day: number;
  date: string;
  activities: Activity[];
}

export interface BudgetBreakdown {
  accommodation: number;
  food: number;
  activities: number;
  transport: number;
  total: number;
}

export interface Trip {
  id: string;
  destination: string;
  startDate: string;
  endDate: string;
  travelers: number;
  tripType: string;
  budget: number;
  itinerary: DayPlan[];
  budgetBreakdown: BudgetBreakdown;
  createdAt: string;
}
