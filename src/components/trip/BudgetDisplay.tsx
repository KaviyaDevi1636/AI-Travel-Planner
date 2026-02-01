import { BudgetBreakdown } from '@/types/trip';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Building, Utensils, Camera, Car, DollarSign } from 'lucide-react';

interface BudgetDisplayProps {
  budget: BudgetBreakdown;
}

export function BudgetDisplay({ budget }: BudgetDisplayProps) {
  const categories = [
    { key: 'accommodation', label: 'Accommodation', icon: Building, color: 'bg-purple-500' },
    { key: 'food', label: 'Food & Dining', icon: Utensils, color: 'bg-orange-500' },
    { key: 'activities', label: 'Activities', icon: Camera, color: 'bg-primary' },
    { key: 'transport', label: 'Transport', icon: Car, color: 'bg-green-500' },
  ] as const;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-primary" />
          Budget Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Total Budget */}
        <div className="text-center p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Total Estimated Cost</p>
          <p className="text-3xl font-bold text-primary">
            ${budget.total.toLocaleString()}
          </p>
        </div>

        {/* Category Breakdown */}
        <div className="space-y-4">
          {categories.map(({ key, label, icon: Icon, color }) => {
            const value = budget[key];
            const percentage = (value / budget.total) * 100;
            
            return (
              <div key={key} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${color} bg-opacity-20`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <span className="text-sm font-medium">{label}</span>
                  </div>
                  <span className="text-sm font-semibold">${value.toLocaleString()}</span>
                </div>
                <Progress value={percentage} className="h-2" />
              </div>
            );
          })}
        </div>

        {/* Tips */}
        <div className="p-3 bg-muted/50 rounded-lg border border-dashed">
          <p className="text-xs text-muted-foreground">
            💡 This is an estimated budget based on average costs. Actual expenses may vary based on your preferences and booking choices.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
