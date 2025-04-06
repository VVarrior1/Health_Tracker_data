import { GoalType } from '@/types/health';

// Target placeholder text based on goal type
export const getTargetPlaceholder = (type: GoalType): string => {
  switch (type) {
    case 'steps':
      return '10000';
    case 'sleep':
      return '8';
    case 'heartRate':
      return '60';
    case 'workout':
      return '30';
    default:
      return 'Enter your target';
  }
};

// Target unit label based on goal type
export const getTargetUnit = (type: GoalType): string => {
  switch (type) {
    case 'steps':
      return 'steps';
    case 'sleep':
      return 'hours';
    case 'heartRate':
      return 'bpm';
    case 'workout':
      return 'minutes';
    default:
      return '';
  }
}; 