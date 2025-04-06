import { GoalData, GoalType, GoalPeriod, HealthData } from '@/types/health';
import { v4 as uuidv4 } from 'uuid';

// Get goals from localStorage
export const getGoals = (): GoalData[] => {
  if (typeof window === 'undefined') return [];
  
  const storedGoals = localStorage.getItem('health-goals');
  if (!storedGoals) return [];
  
  try {
    return JSON.parse(storedGoals);
  } catch (error) {
    console.error('Error parsing stored goals:', error);
    return [];
  }
};

// Save goals to localStorage
export const saveGoals = (goals: GoalData[]): void => {
  if (typeof window === 'undefined') return;
  localStorage.setItem('health-goals', JSON.stringify(goals));
};

// Create a new goal
export const createGoal = (
  type: GoalType,
  target: number,
  period: GoalPeriod,
  title: string,
  description?: string,
  startDate?: string
): GoalData => {
  const newGoal: GoalData = {
    id: uuidv4(),
    type,
    target,
    period,
    startDate: startDate || new Date().toISOString().split('T')[0],
    title,
    description,
    progress: 0,
    completed: false,
    history: []
  };
  
  const goals = getGoals();
  goals.push(newGoal);
  saveGoals(goals);
  
  return newGoal;
};

// Update an existing goal
export const updateGoal = (updatedGoal: GoalData): GoalData => {
  const goals = getGoals();
  const index = goals.findIndex(goal => goal.id === updatedGoal.id);
  
  if (index !== -1) {
    goals[index] = updatedGoal;
    saveGoals(goals);
  }
  
  return updatedGoal;
};

// Delete a goal
export const deleteGoal = (goalId: string): void => {
  const goals = getGoals();
  const filteredGoals = goals.filter(goal => goal.id !== goalId);
  saveGoals(filteredGoals);
};

// Calculate goal progress based on health data
export const calculateGoalProgress = (goal: GoalData, healthData: HealthData): GoalData => {
  const updatedGoal = { ...goal };
  let currentValue = 0;
  
  switch (goal.type) {
    case 'steps':
      // For steps, calculate average steps against target
      currentValue = healthData.summary.averageSteps;
      break;
    case 'sleep':
      // For sleep, calculate average sleep duration against target
      currentValue = healthData.summary.averageSleepDuration;
      break;
    case 'heartRate':
      // For heart rate, use resting heart rate (for goals like "keep below X bpm")
      currentValue = healthData.summary.averageRestingHeartRate;
      break;
    case 'workout':
      // For workouts, calculate average workout duration against target
      currentValue = healthData.summary.averageWorkoutDuration;
      break;
  }
  
  // Calculate progress percentage based on goal type
  // For heartRate goals, progress is inverse (lower is better)
  if (goal.type === 'heartRate') {
    // If target is higher than current value (e.g., keep HR below 70), progress is 100%
    // If current value is higher, progress decreases proportionally
    updatedGoal.progress = currentValue <= goal.target 
      ? 100 
      : Math.max(0, 100 - (((currentValue - goal.target) / goal.target) * 100));
  } else {
    // For other goals, progress increases with value
    updatedGoal.progress = Math.min(100, (currentValue / goal.target) * 100);
  }
  
  updatedGoal.completed = updatedGoal.progress >= 100;
  
  // Add checkpoint to history
  updatedGoal.history.push({
    date: new Date().toISOString().split('T')[0],
    value: currentValue,
    target: goal.target,
    completed: updatedGoal.completed
  });
  
  return updatedGoal;
};

// Calculate progress for all goals
export const updateAllGoals = (healthData: HealthData): GoalData[] => {
  const goals = getGoals();
  const updatedGoals = goals.map(goal => calculateGoalProgress(goal, healthData));
  saveGoals(updatedGoals);
  return updatedGoals;
}; 