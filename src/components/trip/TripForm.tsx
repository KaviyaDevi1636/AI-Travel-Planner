import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format } from 'date-fns';
import { CalendarIcon, MapPin, Users, Compass, DollarSign, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { TripFormData } from '@/types/trip';

const formSchema = z.object({
  destination: z.string().min(2, 'Please enter a destination'),
  startDate: z.date({ required_error: 'Start date is required' }),
  endDate: z.date({ required_error: 'End date is required' }),
  travelers: z.number().min(1).max(20),
  tripType: z.enum(['adventure', 'relaxation', 'cultural', 'foodie', 'mixed']),
  budget: z.number().min(100).max(50000),
});

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  isLoading?: boolean;
}

export function TripForm({ onSubmit, isLoading }: TripFormProps) {
  const [budget, setBudget] = useState([2000]);
  const [travelers, setTravelers] = useState(2);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      destination: '',
      travelers: 2,
      tripType: 'mixed',
      budget: 2000,
    },
  });

  const handleSubmit = (data: z.infer<typeof formSchema>) => {
    onSubmit({
      ...data,
      travelers,
      budget: budget[0],
    } as TripFormData);
  };

  const tripTypes = [
    { value: 'adventure', label: 'Adventure', emoji: '🏔️' },
    { value: 'relaxation', label: 'Relaxation', emoji: '🏖️' },
    { value: 'cultural', label: 'Cultural', emoji: '🏛️' },
    { value: 'foodie', label: 'Foodie', emoji: '🍽️' },
    { value: 'mixed', label: 'Mixed', emoji: '✨' },
  ];

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          Plan Your Trip
        </CardTitle>
        <CardDescription>
          Tell us about your dream vacation and we'll create the perfect itinerary
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
          {/* Destination */}
          <div className="space-y-2">
            <Label htmlFor="destination" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Destination
            </Label>
            <Input
              id="destination"
              placeholder="e.g., Paris, Tokyo, New York..."
              {...form.register('destination')}
              className="text-lg"
            />
            {form.formState.errors.destination && (
              <p className="text-sm text-destructive">{form.formState.errors.destination.message}</p>
            )}
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                Start Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('startDate') && 'text-muted-foreground'
                    )}
                  >
                    {form.watch('startDate') ? (
                      format(form.watch('startDate'), 'PPP')
                    ) : (
                      'Pick a date'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('startDate')}
                    onSelect={(date) => form.setValue('startDate', date as Date)}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <CalendarIcon className="h-4 w-4" />
                End Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      'w-full justify-start text-left font-normal',
                      !form.watch('endDate') && 'text-muted-foreground'
                    )}
                  >
                    {form.watch('endDate') ? (
                      format(form.watch('endDate'), 'PPP')
                    ) : (
                      'Pick a date'
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={form.watch('endDate')}
                    onSelect={(date) => form.setValue('endDate', date as Date)}
                    disabled={(date) => date < (form.watch('startDate') || new Date())}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Travelers */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Number of Travelers: {travelers}
            </Label>
            <Slider
              value={[travelers]}
              onValueChange={(value) => setTravelers(value[0])}
              max={10}
              min={1}
              step={1}
              className="w-full"
            />
          </div>

          {/* Trip Type */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Compass className="h-4 w-4" />
              Trip Type
            </Label>
            <Select
              value={form.watch('tripType')}
              onValueChange={(value) => form.setValue('tripType', value as any)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select trip type" />
              </SelectTrigger>
              <SelectContent>
                {tripTypes.map((type) => (
                  <SelectItem key={type.value} value={type.value}>
                    <span className="flex items-center gap-2">
                      {type.emoji} {type.label}
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <DollarSign className="h-4 w-4" />
              Budget: ${budget[0].toLocaleString()}
            </Label>
            <Slider
              value={budget}
              onValueChange={setBudget}
              max={10000}
              min={500}
              step={100}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>$500</span>
              <span>$10,000</span>
            </div>
          </div>

          <Button type="submit" className="w-full" size="lg" disabled={isLoading}>
            {isLoading ? (
              <>
                <Sparkles className="mr-2 h-4 w-4 animate-spin" />
                Generating Itinerary...
              </>
            ) : (
              <>
                <Sparkles className="mr-2 h-4 w-4" />
                Generate My Trip
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
