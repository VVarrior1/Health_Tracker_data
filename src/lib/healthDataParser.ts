import { parseString } from 'xml2js';
import { HealthData, StepData, HeartRateData, WorkoutData, SleepData, HealthSummary } from '@/types/health';

export async function parseHealthData(xmlContent: string): Promise<HealthData> {
  return new Promise((resolve, reject) => {
    parseString(xmlContent, (err, result) => {
      if (err) {
        reject(err);
        return;
      }

      try {
        const healthData: HealthData = {
          steps: filterLast6Months(extractSteps(result)),
          heartRate: filterLast6Months(extractHeartRate(result)),
          restingHeartRate: filterLast6Months(extractRestingHeartRate(result)),
          workouts: extractWorkouts(result),
          sleep: extractSleep(result),
          summary: generateSummary(result),
        };
        resolve(healthData);
      } catch (error) {
        reject(error);
      }
    });
  });
}

function filterLast6Months<T extends { date: string }>(data: T[]): T[] {
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  return data.filter(item => new Date(item.date) >= sixMonthsAgo);
}

function extractSteps(data: any): StepData[] {
  // Create a map to aggregate steps by day
  const dailySteps = new Map<string, number>();
  
  if (data.HealthData?.Record) {
    data.HealthData.Record.forEach((record: any) => {
      if (record.$.type === 'HKQuantityTypeIdentifierStepCount') {
        const date = new Date(record.$.startDate);
        const dateKey = date.toISOString().split('T')[0]; // Get just the date part
        
        const count = parseInt(record.$.value);
        if (!isNaN(count) && count > 0) {
          if (dailySteps.has(dateKey)) {
            dailySteps.set(dateKey, dailySteps.get(dateKey)! + count);
          } else {
            dailySteps.set(dateKey, count);
          }
        }
      }
    });
  }
  
  // Convert the map to an array of StepData objects
  const steps: StepData[] = [];
  dailySteps.forEach((count, dateStr) => {
    // Include all days with step data, no filtering
    steps.push({
      date: dateStr + 'T12:00:00Z', // Use noon as a standard time
      count: count
    });
  });
  
  // Sort by date
  return steps.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
}

function extractHeartRate(data: any): HeartRateData[] {
  const heartRate: HeartRateData[] = [];
  if (data.HealthData?.Record) {
    data.HealthData.Record.forEach((record: any) => {
      if (record.$.type === 'HKQuantityTypeIdentifierHeartRate') {
        heartRate.push({
          date: record.$.startDate,
          value: parseFloat(record.$.value),
          unit: record.$.unit,
        });
      }
    });
  }
  return heartRate;
}

function extractRestingHeartRate(data: any): HeartRateData[] {
  const restingHeartRate: HeartRateData[] = [];
  if (data.HealthData?.Record) {
    data.HealthData.Record.forEach((record: any) => {
      if (record.$.type === 'HKQuantityTypeIdentifierRestingHeartRate') {
        restingHeartRate.push({
          date: record.$.startDate,
          value: parseFloat(record.$.value),
          unit: record.$.unit,
        });
      }
    });
  }
  return restingHeartRate;
}

function extractWorkouts(data: any): WorkoutData[] {
  const workouts: WorkoutData[] = [];
  if (data.HealthData?.Workout) {
    data.HealthData.Workout.forEach((workout: any) => {
      workouts.push({
        date: workout.$.startDate,
        type: workout.$.workoutActivityType,
        duration: parseFloat(workout.$.duration),
        calories: parseFloat(workout.$.totalEnergyBurned),
        distance: workout.$.totalDistance ? parseFloat(workout.$.totalDistance) : undefined,
      });
    });
  }
  
  // Filter to last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return workouts.filter(item => new Date(item.date) >= sixMonthsAgo);
}

function extractSleep(data: any): SleepData[] {
  const sleepEntries = new Map();
  
  if (data.HealthData?.Record) {
    // First, collect all sleep analysis entries
    data.HealthData.Record.forEach((record: any) => {
      if (record.$.type === 'HKCategoryTypeIdentifierSleepAnalysis') {
        // Extract date (just the day part)
        const startDate = new Date(record.$.startDate);
        if (isNaN(startDate.getTime())) return;
        
        const dateKey = startDate.toISOString().split('T')[0];
        
        if (!sleepEntries.has(dateKey)) {
          sleepEntries.set(dateKey, {
            date: record.$.startDate,
            asleepDurations: [],
            awakeDurations: [],
            totalDuration: 0,
            sourceDevices: new Set()
          });
        }
        
        // Track source device for debugging
        if (record.$.sourceName) {
          sleepEntries.get(dateKey).sourceDevices.add(record.$.sourceName);
        }
        
        // Calculate duration
        const endDate = new Date(record.$.endDate);
        if (isNaN(endDate.getTime())) return;
        
        const durationMinutes = (endDate.getTime() - startDate.getTime()) / (60 * 1000);
        
        // Skip invalid durations
        if (durationMinutes <= 0 || durationMinutes > 24 * 60) return;
        
        // Collect based on sleep type
        const sleepValue = record.$.value;
        if (sleepValue === 'HKCategoryValueSleepAnalysisAsleep' || 
            sleepValue === 'HKCategoryValueSleepAnalysisAsleepCore' ||
            sleepValue === 'HKCategoryValueSleepAnalysisAsleepDeep' ||
            sleepValue === 'HKCategoryValueSleepAnalysisAsleepREM' ||
            sleepValue === 'HKCategoryValueSleepAnalysisAsleepUnspecified') {
          sleepEntries.get(dateKey).asleepDurations.push(durationMinutes);
          sleepEntries.get(dateKey).totalDuration += durationMinutes;
        } else if (sleepValue === 'HKCategoryValueSleepAnalysisAwake' || 
                  sleepValue === 'HKCategoryValueSleepAnalysisInBed') {
          sleepEntries.get(dateKey).awakeDurations.push(durationMinutes);
          // Include in-bed time in total duration but not in asleep duration
          sleepEntries.get(dateKey).totalDuration += durationMinutes;
        }
      }
    });
  }
  
  // Process collected data into SleepData
  const sleep: SleepData[] = [];
  sleepEntries.forEach(entry => {
    // Calculate total asleep duration
    const totalAsleepMinutes = entry.asleepDurations.reduce((sum: number, duration: number) => sum + duration, 0);
    const totalAwakeMinutes = entry.awakeDurations.reduce((sum: number, duration: number) => sum + duration, 0);
    
    // Only add entries that have actual sleep data
    // Filter out entries with less than 3 hours of sleep (180 minutes)
    if (totalAsleepMinutes >= 180) {
      sleep.push({
        date: entry.date,
        duration: totalAsleepMinutes,
        deepSleep: Math.round(totalAsleepMinutes * 0.2), // Estimate ~20% deep sleep
        remSleep: Math.round(totalAsleepMinutes * 0.25), // Estimate ~25% REM sleep
      });
    }
  });
  
  // Sort by date
  sleep.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  
  // Filter to last 6 months
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  return sleep.filter(item => new Date(item.date) >= sixMonthsAgo);
}

function generateSummary(data: any): HealthSummary {
  const stepsData = extractSteps(data);
  const steps = filterLast6Months(stepsData);
  const heartRate = filterLast6Months(extractHeartRate(data));
  const restingHeartRate = filterLast6Months(extractRestingHeartRate(data));
  const workouts = extractWorkouts(data);
  const sleep = extractSleep(data);

  // Get date range for the past 6 months
  const today = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
  
  // Calculate total days in the 6-month period
  const totalDaysInPeriod = Math.ceil((today.getTime() - sixMonthsAgo.getTime()) / (1000 * 60 * 60 * 24));
  
  // Calculate total steps
  const totalSteps = steps.reduce((sum, step) => sum + step.count, 0);
  
  // Average daily steps over the entire period - similar to how Apple Health calculates
  const averageSteps = Math.round(totalSteps / totalDaysInPeriod);
    
  const mostActiveDay = steps.reduce((max, current) => 
    current.count > max.count ? current : max, 
    { date: '', count: 0 }
  ).date;

  const totalWorkouts = workouts.length;
  const averageWorkoutDuration = workouts.reduce((sum, workout) => 
    sum + workout.duration, 0) / (totalWorkouts || 1);

  const averageHeartRate = heartRate.reduce((sum, hr) => 
    sum + hr.value, 0) / (heartRate.length || 1);
    
  const averageRestingHeartRate = restingHeartRate.reduce((sum, hr) => 
    sum + hr.value, 0) / (restingHeartRate.length || 1);

  const averageSleepDuration = sleep.reduce((sum, s) => 
    sum + s.duration, 0) / (sleep.length || 1);

  return {
    totalSteps,
    averageSteps,
    mostActiveDay,
    totalWorkouts,
    averageWorkoutDuration: Math.round(averageWorkoutDuration * 100) / 100,
    averageHeartRate: Math.round(averageHeartRate * 100) / 100,
    averageRestingHeartRate: Math.round(averageRestingHeartRate * 100) / 100,
    averageSleepDuration: Math.round(averageSleepDuration * 100) / 100,
  };
} 