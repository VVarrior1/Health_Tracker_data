'use client';

import React from 'react';
import { HealthData } from '@/types/health';

interface SampleDataGeneratorProps {
  onDataGenerated: (data: HealthData) => void;
}

const SampleDataGenerator: React.FC<SampleDataGeneratorProps> = ({ onDataGenerated }) => {
  const generateSampleData = () => {
    // Get today's date
    const today = new Date();
    
    // Create sample data arrays
    const steps: { date: string; count: number }[] = [];
    const heartRate: { date: string; value: number; unit: string }[] = [];
    const restingHeartRate: { date: string; value: number; unit: string }[] = [];
    const sleep: { date: string; duration: number; deepSleep: number; remSleep: number }[] = [];
    const workouts: { date: string; type: string; duration: number; calories: number; distance?: number }[] = [];
    
    // Generate data for the last 30 days
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(date.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      
      // Base values
      let stepCount = Math.floor(Math.random() * 10000) + 5000;
      let hrValue = Math.floor(Math.random() * 60) + 60;
      let restingHR = Math.floor(Math.random() * 30) + 50;
      let sleepDuration = 5 + Math.random() * 4; // 5-9 hours
      
      // Create patterns for stronger correlations
      // Pattern: Sleep cycles between good (7-9) and poor (5-6) every 5 days
      if (Math.floor(i / 5) % 2 === 0) {
        sleepDuration = 7 + Math.random() * 2; // Good sleep: 7-9 hours
      } else {
        sleepDuration = 5 + Math.random() * 1; // Poor sleep: 5-6 hours
      }
      
      // Add values to arrays
      steps.push({
        date: dateStr,
        count: stepCount
      });
      
      heartRate.push({
        date: dateStr,
        value: hrValue,
        unit: 'bpm'
      });
      
      restingHeartRate.push({
        date: dateStr,
        value: restingHR,
        unit: 'bpm'
      });
      
      sleep.push({
        date: dateStr,
        duration: sleepDuration,
        deepSleep: sleepDuration * 0.3,
        remSleep: sleepDuration * 0.2
      });
      
      // Add some workouts (not every day)
      if (i % 3 === 0) {
        const types = ['Running', 'Walking', 'Cycling', 'Swimming', 'Strength Training'];
        const type = types[Math.floor(Math.random() * types.length)];
        const duration = Math.floor(Math.random() * 60) + 30; // 30-90 minutes
        
        workouts.push({
          date: dateStr,
          type,
          duration,
          calories: duration * 10,
          distance: (type === 'Running' || type === 'Walking' || type === 'Cycling') 
            ? Math.random() * 10 
            : undefined
        });
      }
    }
    
    // Create STRONG negative correlation between sleep and resting heart rate
    // More sleep = lower resting heart rate (health benefit)
    sleep.forEach((sleepData, index) => {
      if (index < restingHeartRate.length) {
        // Linear formula: heartRate = 90 - (5 * sleepDuration)
        // This creates heart rates from ~55 (with 7h sleep) to ~65 (with 5h sleep)
        restingHeartRate[index].value = Math.round(90 - (5 * sleepData.duration));
        // Add some noise for realism
        restingHeartRate[index].value += Math.floor(Math.random() * 6) - 3;
        // Ensure within reasonable bounds
        restingHeartRate[index].value = Math.max(45, Math.min(80, restingHeartRate[index].value));
      }
    });
    
    // Create STRONG positive correlation between steps and heart rate
    // More steps = higher heart rate (exercise effect)
    steps.forEach((stepData, index) => {
      if (index < heartRate.length) {
        // Map steps to heart rate 
        const normalizedSteps = (stepData.count - 5000) / 10000; // 0 to 1 scale
        heartRate[index].value = Math.round(70 + (normalizedSteps * 50)); // 70-120 bpm range
        // Add some noise
        heartRate[index].value += Math.floor(Math.random() * 10) - 5;
        // Ensure within reasonable bounds
        heartRate[index].value = Math.max(60, Math.min(140, heartRate[index].value));
      }
    });
    
    // Create positive correlation between sleep and next day's steps
    // Better sleep = more energy = more steps
    for (let i = 0; i < sleep.length - 1; i++) {
      const sleepDuration = sleep[i].duration;
      // Set next day's steps based on sleep
      if (i + 1 < steps.length) {
        // Linear formula: steps = 5000 + (sleepDuration * 1000)
        steps[i + 1].count = Math.round(5000 + (sleepDuration * 1000));
        // Add some noise for realism
        steps[i + 1].count += Math.floor(Math.random() * 2000) - 1000;
        // Ensure within reasonable bounds
        steps[i + 1].count = Math.max(3000, Math.min(15000, steps[i + 1].count));
      }
    }
    
    // Calculate averages for summary
    const totalSteps = steps.reduce((sum, item) => sum + item.count, 0);
    const averageSteps = totalSteps / steps.length;
    
    const totalHeartRate = heartRate.reduce((sum, item) => sum + item.value, 0);
    const averageHeartRate = totalHeartRate / heartRate.length;
    
    const totalRestingHeartRate = restingHeartRate.reduce((sum, item) => sum + item.value, 0);
    const averageRestingHeartRate = totalRestingHeartRate / restingHeartRate.length;
    
    const totalSleep = sleep.reduce((sum, item) => sum + item.duration, 0);
    const averageSleepDuration = totalSleep / sleep.length;
    
    const totalWorkoutDuration = workouts.reduce((sum, item) => sum + item.duration, 0);
    const averageWorkoutDuration = workouts.length ? totalWorkoutDuration / workouts.length : 0;
    
    // Find most active day (highest step count)
    const mostActiveDay = steps.reduce((max, item) => 
      item.count > max.count ? item : max, steps[0]).date;
    
    // Create the health data object
    const healthData: HealthData = {
      steps,
      heartRate,
      restingHeartRate,
      sleep,
      workouts,
      summary: {
        totalSteps,
        averageSteps,
        mostActiveDay,
        totalWorkouts: workouts.length,
        averageWorkoutDuration,
        averageHeartRate,
        averageRestingHeartRate,
        averageSleepDuration
      },
      goals: []
    };
    
    onDataGenerated(healthData);
  };
  
  return (
    <div className="mt-4 text-center">
      <button 
        onClick={generateSampleData}
        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
      >
        Generate Sample Data
      </button>
      <p className="mt-2 text-xs text-gray-500">
        This will create sample health data with built-in correlations for testing
      </p>
    </div>
  );
};

export default SampleDataGenerator; 