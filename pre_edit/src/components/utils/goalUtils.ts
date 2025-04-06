import { GoalData } from '@/types/health';

// Format the target value based on goal type
export const formatTarget = (goal: GoalData): string => {
  switch (goal.type) {
    case 'steps':
      return `${goal.target.toLocaleString()} steps`;
    case 'sleep':
      return `${goal.target} hours`;
    case 'heartRate':
      return `${goal.target} bpm`;
    case 'workout':
      return `${goal.target} minutes`;
    default:
      return goal.target.toString();
  }
};

// Format time period with capitalized first letter
export const formatPeriod = (period: string): string => {
  return period.charAt(0).toUpperCase() + period.slice(1);
}; 