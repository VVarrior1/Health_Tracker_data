'use client';

import React, { useMemo } from 'react';
import { HealthData } from '@/types/health';

interface HealthRecommendationsProps {
  healthData: HealthData;
  sleepHeartRateCorrelation: number;
  stepsHeartRateCorrelation: number;
  sleepStepsCorrelation: number;
}

const HealthRecommendations: React.FC<HealthRecommendationsProps> = ({
  healthData,
  sleepHeartRateCorrelation,
  stepsHeartRateCorrelation,
  sleepStepsCorrelation
}) => {
  // Generate optimal sleep recommendation
  const sleepRecommendation = useMemo(() => {
    const avgSleepDuration = healthData.summary.averageSleepDuration;
    
    if (sleepHeartRateCorrelation < -0.3) {
      // Negative correlation - more sleep is associated with lower heart rate
      if (avgSleepDuration < 7) {
        return {
          title: 'Consider Increasing Sleep Duration',
          description: 'Your data suggests that longer sleep durations are associated with lower resting heart rate. Consider increasing your sleep to 7-8 hours per night.',
          impact: 'Potential for improved heart health and recovery'
        };
      } else {
        return {
          title: 'Maintain Current Sleep Pattern',
          description: `Your current average sleep duration of ${avgSleepDuration.toFixed(1)} hours appears to be supporting a healthy resting heart rate.`,
          impact: 'Continued heart health benefits'
        };
      }
    } else if (sleepHeartRateCorrelation > 0.3) {
      // Positive correlation - more sleep is associated with higher heart rate
      // This is unusual, might suggest sleep quality issues
      return {
        title: 'Evaluate Sleep Quality',
        description: 'Your data shows an unusual pattern where longer sleep is associated with higher heart rate. This could indicate sleep quality issues.',
        impact: 'Addressing sleep quality may improve recovery and heart health'
      };
    } else if (sleepStepsCorrelation > 0.3) {
      // Positive correlation - more sleep leads to more steps next day
      if (avgSleepDuration < 7) {
        return {
          title: 'Increase Sleep for More Activity',
          description: 'Your data suggests that more sleep leads to higher activity levels the next day. Aim for 7-8 hours of sleep to boost your energy for activity.',
          impact: 'Potential for increased daily activity and energy levels'
        };
      }
    }
    
    // Default recommendation
    return {
      title: 'Maintain Consistent Sleep Schedule',
      description: 'While no strong correlation was found between your sleep and other metrics, maintaining a consistent sleep schedule of 7-9 hours is recommended for general health.',
      impact: 'Supports overall wellbeing and consistent energy levels'
    };
  }, [healthData, sleepHeartRateCorrelation, sleepStepsCorrelation]);
  
  // Generate activity recommendation
  const activityRecommendation = useMemo(() => {
    const avgSteps = healthData.summary.averageSteps;
    
    if (stepsHeartRateCorrelation > 0.3) {
      // Positive correlation - more steps associated with higher heart rate
      if (avgSteps < 7500) {
        return {
          title: 'Gradually Increase Activity',
          description: 'Your data shows increased activity raises your heart rate, which is normal. Consider gradually increasing daily steps to improve cardiovascular fitness.',
          impact: 'Improved cardiovascular health and endurance'
        };
      } else {
        return {
          title: 'Maintain Current Activity Level',
          description: `Your current average of ${avgSteps.toFixed(0)} steps per day appears to be providing good cardiovascular stimulus.`,
          impact: 'Continued cardiovascular fitness benefits'
        };
      }
    } else if (stepsHeartRateCorrelation < -0.3) {
      // Negative correlation - more steps associated with lower heart rate
      // This suggests good cardiovascular fitness
      return {
        title: 'Your Fitness Level Appears Strong',
        description: 'The data suggests higher activity levels are associated with lower heart rates, indicating good cardiovascular fitness.',
        impact: 'Continue current activity patterns for heart health'
      };
    }
    
    // Default recommendation
    if (avgSteps < 5000) {
      return {
        title: 'Increase Daily Step Count',
        description: 'Your average daily steps are below the recommended minimum of 7,500. Consider gradually increasing your activity.',
        impact: 'Improved overall health and energy levels'
      };
    } else if (avgSteps < 7500) {
      return {
        title: 'Moderately Increase Activity',
        description: 'You\'re on the right track with your step count. Aim to reach 7,500-10,000 steps consistently for optimal health benefits.',
        impact: 'Enhanced cardiovascular health and weight management'
      };
    } else {
      return {
        title: 'Maintain Strong Activity Habits',
        description: `Your average of ${avgSteps.toFixed(0)} steps per day is excellent. Continue with your current activity patterns.`,
        impact: 'Sustained health benefits and reduced disease risk'
      };
    }
  }, [healthData, stepsHeartRateCorrelation]);
  
  return (
    <div className="mt-8 bg-white rounded-lg shadow-md p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Personalized Recommendations</h2>
      
      <p className="text-gray-600 mb-4">
        These recommendations are generated based on patterns identified in your health data. 
        Always consult with healthcare professionals before making significant changes to your routine.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sleep Recommendation */}
        <div className="bg-indigo-50 rounded-lg p-5 border border-indigo-100">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-indigo-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <h3 className="text-lg font-semibold text-indigo-800">{sleepRecommendation.title}</h3>
          </div>
          <p className="text-gray-700 mb-3">{sleepRecommendation.description}</p>
          <div className="flex items-center">
            <span className="text-xs font-medium uppercase tracking-wide text-indigo-600 bg-indigo-100 rounded-full px-2 py-1">
              Impact: {sleepRecommendation.impact}
            </span>
          </div>
        </div>
        
        {/* Activity Recommendation */}
        <div className="bg-emerald-50 rounded-lg p-5 border border-emerald-100">
          <div className="flex items-center mb-3">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-emerald-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            <h3 className="text-lg font-semibold text-emerald-800">{activityRecommendation.title}</h3>
          </div>
          <p className="text-gray-700 mb-3">{activityRecommendation.description}</p>
          <div className="flex items-center">
            <span className="text-xs font-medium uppercase tracking-wide text-emerald-600 bg-emerald-100 rounded-full px-2 py-1">
              Impact: {activityRecommendation.impact}
            </span>
          </div>
        </div>
      </div>
      
      {/* Additional Tips */}
      <div className="mt-6">
        <h3 className="text-lg font-semibold text-gray-800 mb-3">Additional Tips</h3>
        <ul className="list-disc list-inside space-y-2 text-gray-700">
          <li>Track your metrics consistently to get more accurate correlation insights over time</li>
          <li>Pay attention to how changes in one health metric affect others</li>
          <li>Consider tracking additional factors like nutrition, stress, and hydration</li>
          <li>Remember that individual health patterns vary - what works for others may differ for you</li>
        </ul>
      </div>
    </div>
  );
};

export default HealthRecommendations; 