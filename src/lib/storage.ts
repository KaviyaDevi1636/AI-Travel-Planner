import { Trip } from '@/types/trip';

const STORAGE_KEY = 'ai-travel-planner-trips';

export function saveTrip(trip: Trip): void {
  const trips = getTrips();
  trips.unshift(trip);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}

export function getTrips(): Trip[] {
  const data = localStorage.getItem(STORAGE_KEY);
  if (!data) return [];
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

export function getTrip(id: string): Trip | null {
  const trips = getTrips();
  return trips.find(t => t.id === id) || null;
}

export function deleteTrip(id: string): void {
  const trips = getTrips().filter(t => t.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(trips));
}
