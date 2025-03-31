export interface HealthData {
  steps: StepData[];
  heartRate: HeartRateData[];
  restingHeartRate: HeartRateData[];
  workouts: WorkoutData[];
  sleep: SleepData[];
  summary: HealthSummary;
}

export interface StepData {
  date: string;
  count: number;
}

export interface HeartRateData {
  date: string;
  value: number;
  unit: string;
}

export interface WorkoutData {
  date: string;
  type: string;
  duration: number; // in minutes
  calories: number;
  distance?: number; // in kilometers
}

export interface SleepData {
  date: string;
  duration: number;
  deepSleep: number;
  remSleep: number;
}

export interface HealthSummary {
  totalSteps: number;
  averageSteps: number;
  mostActiveDay: string;
  totalWorkouts: number;
  averageWorkoutDuration: number;
  averageHeartRate: number;
  averageRestingHeartRate: number;
  averageSleepDuration: number;
} 