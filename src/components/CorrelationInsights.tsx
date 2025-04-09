'use client';

import React, { useMemo } from 'react';
import { HealthData } from '@/types/health';
import { 
  ResponsiveContainer, 
  ScatterChart, 
  Scatter, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ZAxis
} from 'recharts';
import HealthRecommendations from './HealthRecommendations';

interface CorrelationInsightsProps {
  healthData: HealthData;
  onTabChange?: (tab: 'dashboard' | 'goals' | 'insights') => void;
}

// Calculate Pearson correlation coefficient
const calculateCorrelation = (x: number[], y: number[]): number => {
  if (x.length !== y.length || x.length === 0) return 0;
  
  // Calculate means
  const xMean = x.reduce((sum, val) => sum + val, 0) / x.length;
  const yMean = y.reduce((sum, val) => sum + val, 0) / y.length;
  
  // Calculate correlation coefficient
  let numerator = 0;
  let xDenominator = 0;
  let yDenominator = 0;
  
  for (let i = 0; i < x.length; i++) {
    const xDiff = x[i] - xMean;
    const yDiff = y[i] - yMean;
    numerator += xDiff * yDiff;
    xDenominator += xDiff * xDiff;
    yDenominator += yDiff * yDiff;
  }
  
  if (xDenominator === 0 || yDenominator === 0) return 0;
  return numerator / Math.sqrt(xDenominator * yDenominator);
};

// Format correlation value for display
const formatCorrelation = (value: number): string => {
  const formatted = (value * 100).toFixed(1);
  return `${formatted}%`;
};

// Interpret correlation strength
const interpretCorrelation = (value: number): string => {
  const abs = Math.abs(value);
  if (abs < 0.2) return 'very weak';
  if (abs < 0.4) return 'weak';
  if (abs < 0.6) return 'moderate';
  if (abs < 0.8) return 'strong';
  return 'very strong';
};

// Get direction of correlation
const getCorrelationDirection = (value: number): string => {
  if (value > 0.05) return 'positive';
  if (value < -0.05) return 'negative';
  return 'no';
};

const CorrelationInsights: React.FC<CorrelationInsightsProps> = ({ 
  healthData, 
  onTabChange 
}) => {
  const sleepVsHeartRateData = useMemo(() => {
    const data: { x: number; y: number; date: string }[] = [];
    
    // Create a map of dates to sleep duration
    const sleepByDate = new Map<string, number>();
    healthData.sleep.forEach(item => {
      sleepByDate.set(item.date, item.duration);
    });
    
    // Match with heart rate data
    healthData.restingHeartRate.forEach(item => {
      if (sleepByDate.has(item.date)) {
        data.push({
          x: sleepByDate.get(item.date) as number,
          y: item.value,
          date: item.date
        });
      }
    });
    
    return data;
  }, [healthData]);
  
  const stepsVsHeartRateData = useMemo(() => {
    const data: { x: number; y: number; date: string }[] = [];
    
    // Create a map of dates to step count
    const stepsByDate = new Map<string, number>();
    healthData.steps.forEach(item => {
      stepsByDate.set(item.date, item.count);
    });
    
    // Match with heart rate data
    healthData.heartRate.forEach(item => {
      if (stepsByDate.has(item.date)) {
        data.push({
          x: stepsByDate.get(item.date) as number,
          y: item.value,
          date: item.date
        });
      }
    });
    
    return data;
  }, [healthData]);
  
  const sleepVsStepsData = useMemo(() => {
    const data: { x: number; y: number; date: string }[] = [];
    
    // Create a map of dates to sleep duration
    const sleepByDate = new Map<string, number>();
    healthData.sleep.forEach(item => {
      sleepByDate.set(item.date, item.duration);
    });
    
    // Find the next day's steps after each sleep record
    healthData.steps.forEach(item => {
      // Get yesterday's date
      const currentDate = new Date(item.date);
      currentDate.setDate(currentDate.getDate() - 1);
      const yesterdayStr = currentDate.toISOString().split('T')[0];
      
      if (sleepByDate.has(yesterdayStr)) {
        data.push({
          x: sleepByDate.get(yesterdayStr) as number,
          y: item.count,
          date: item.date
        });
      }
    });
    
    return data;
  }, [healthData]);
  
  // Calculate correlations
  const sleepHeartRateCorrelation = useMemo(() => {
    const x = sleepVsHeartRateData.map(d => d.x);
    const y = sleepVsHeartRateData.map(d => d.y);
    return calculateCorrelation(x, y);
  }, [sleepVsHeartRateData]);
  
  const stepsHeartRateCorrelation = useMemo(() => {
    const x = stepsVsHeartRateData.map(d => d.x);
    const y = stepsVsHeartRateData.map(d => d.y);
    return calculateCorrelation(x, y);
  }, [stepsVsHeartRateData]);
  
  const sleepStepsCorrelation = useMemo(() => {
    const x = sleepVsStepsData.map(d => d.x);
    const y = sleepVsStepsData.map(d => d.y);
    return calculateCorrelation(x, y);
  }, [sleepVsStepsData]);
  
  // Generate insights
  const insights = useMemo(() => {
    const insightsList = [];
    
    if (sleepVsHeartRateData.length > 5) {
      const direction = getCorrelationDirection(sleepHeartRateCorrelation);
      const strength = interpretCorrelation(sleepHeartRateCorrelation);
      
      insightsList.push({
        title: 'Sleep and Heart Rate',
        description: `There appears to be a ${strength} ${direction} correlation between your sleep duration and resting heart rate.`,
        interpretation: direction === 'positive' 
          ? 'Longer sleep duration is associated with higher resting heart rate.'
          : direction === 'negative'
          ? 'Longer sleep duration is associated with lower resting heart rate.'
          : 'There is no clear relationship between your sleep duration and resting heart rate.'
      });
    }
    
    if (stepsVsHeartRateData.length > 5) {
      const direction = getCorrelationDirection(stepsHeartRateCorrelation);
      const strength = interpretCorrelation(stepsHeartRateCorrelation);
      
      insightsList.push({
        title: 'Activity and Heart Rate',
        description: `There appears to be a ${strength} ${direction} correlation between your daily steps and heart rate.`,
        interpretation: direction === 'positive' 
          ? 'Higher step counts are associated with higher heart rates.'
          : direction === 'negative'
          ? 'Higher step counts are associated with lower heart rates.'
          : 'There is no clear relationship between your step count and heart rate.'
      });
    }
    
    if (sleepVsStepsData.length > 5) {
      const direction = getCorrelationDirection(sleepStepsCorrelation);
      const strength = interpretCorrelation(sleepStepsCorrelation);
      
      insightsList.push({
        title: 'Sleep and Next Day Activity',
        description: `There appears to be a ${strength} ${direction} correlation between your sleep duration and next day's activity level.`,
        interpretation: direction === 'positive' 
          ? 'Getting more sleep tends to lead to higher step counts the next day.'
          : direction === 'negative'
          ? 'Getting more sleep tends to lead to lower step counts the next day.'
          : 'There is no clear relationship between your sleep duration and next day activity.'
      });
    }
    
    return insightsList;
  }, [sleepVsHeartRateData, stepsVsHeartRateData, sleepVsStepsData, sleepHeartRateCorrelation, stepsHeartRateCorrelation, sleepStepsCorrelation]);

  return (
    <div>
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Health Correlations</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Analysis Summary</h3>
          <p className="text-gray-600 mb-3">
            This analysis identifies potential relationships between different health metrics based on correlation patterns in your data.
            Correlation doesn't necessarily imply causation, but can reveal interesting patterns to explore.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${Math.abs(sleepHeartRateCorrelation) > 0.3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Sleep ↔ Heart Rate: {formatCorrelation(sleepHeartRateCorrelation)}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${Math.abs(stepsHeartRateCorrelation) > 0.3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Steps ↔ Heart Rate: {formatCorrelation(stepsHeartRateCorrelation)}</span>
            </div>
            <div className="flex items-center">
              <div className={`w-3 h-3 rounded-full mr-2 ${Math.abs(sleepStepsCorrelation) > 0.3 ? 'bg-blue-500' : 'bg-gray-300'}`}></div>
              <span className="text-sm">Sleep ↔ Next Day Steps: {formatCorrelation(sleepStepsCorrelation)}</span>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 gap-6 mb-6">
          {insights.map((insight, index) => (
            <div key={index} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <h3 className="text-lg font-semibold text-blue-800">{insight.title}</h3>
              <p className="text-gray-700 mb-1">{insight.description}</p>
              <p className="text-sm text-gray-600">{insight.interpretation}</p>
            </div>
          ))}
          
          {insights.length === 0 && (
            <div className="bg-gray-50 rounded-lg p-4 text-center">
              <p className="text-gray-600 mb-2">Not enough data to generate correlation insights. Please ensure you have at least 5 days of overlapping data.</p>
              <p className="text-sm text-blue-600 mb-4">Try the "Generate Sample Data" button on the home page to see how correlation insights work with demo data.</p>
              
              {onTabChange && (
                <button
                  onClick={() => onTabChange('dashboard')}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View Dashboard
                </button>
              )}
            </div>
          )}
        </div>
        
        {sleepVsHeartRateData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sleep Duration vs. Resting Heart Rate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Correlation: {formatCorrelation(sleepHeartRateCorrelation)} ({interpretCorrelation(sleepHeartRateCorrelation)} {getCorrelationDirection(sleepHeartRateCorrelation)} correlation)
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Sleep Duration" 
                    unit="hrs" 
                    domain={['auto', 'auto']}
                    label={{ value: 'Sleep Duration (hours)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Resting Heart Rate" 
                    unit="bpm"
                    label={{ value: 'Resting Heart Rate (bpm)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="category" dataKey="date" name="Date" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Sleep Duration') return [`${value.toFixed(1)} hours`, name];
                      if (name === 'Resting Heart Rate') return [`${value} bpm`, name];
                      return [value, name];
                    }}
                  />
                  <Scatter name="Sleep vs Heart Rate" data={sleepVsHeartRateData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {stepsVsHeartRateData.length > 0 && (
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Daily Steps vs. Heart Rate</h3>
            <p className="text-sm text-gray-600 mb-4">
              Correlation: {formatCorrelation(stepsHeartRateCorrelation)} ({interpretCorrelation(stepsHeartRateCorrelation)} {getCorrelationDirection(stepsHeartRateCorrelation)} correlation)
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Steps" 
                    domain={['auto', 'auto']}
                    label={{ value: 'Daily Steps', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Heart Rate" 
                    unit="bpm"
                    label={{ value: 'Heart Rate (bpm)', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="category" dataKey="date" name="Date" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Steps') return [`${value.toLocaleString()}`, name];
                      if (name === 'Heart Rate') return [`${value} bpm`, name];
                      return [value, name];
                    }}
                  />
                  <Scatter name="Steps vs Heart Rate" data={stepsVsHeartRateData} fill="#82ca9d" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
        
        {sleepVsStepsData.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Sleep Duration vs. Next Day's Steps</h3>
            <p className="text-sm text-gray-600 mb-4">
              Correlation: {formatCorrelation(sleepStepsCorrelation)} ({interpretCorrelation(sleepStepsCorrelation)} {getCorrelationDirection(sleepStepsCorrelation)} correlation)
            </p>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{
                    top: 20,
                    right: 20,
                    bottom: 20,
                    left: 20,
                  }}
                >
                  <CartesianGrid />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="Sleep Duration" 
                    unit="hrs" 
                    domain={['auto', 'auto']}
                    label={{ value: 'Sleep Duration (hours)', position: 'insideBottom', offset: -10 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Steps Next Day" 
                    domain={['auto', 'auto']}
                    label={{ value: 'Next Day Steps', angle: -90, position: 'insideLeft' }}
                  />
                  <ZAxis type="category" dataKey="date" name="Date" />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    formatter={(value: any, name: any) => {
                      if (name === 'Sleep Duration') return [`${value.toFixed(1)} hours`, name];
                      if (name === 'Steps Next Day') return [`${value.toLocaleString()} steps`, name];
                      return [value, name];
                    }}
                  />
                  <Scatter name="Sleep vs Next Day Steps" data={sleepVsStepsData} fill="#f97316" />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
      
      {/* Health Recommendations based on correlations */}
      {insights.length > 0 && (
        <HealthRecommendations 
          healthData={healthData}
          sleepHeartRateCorrelation={sleepHeartRateCorrelation}
          stepsHeartRateCorrelation={stepsHeartRateCorrelation}
          sleepStepsCorrelation={sleepStepsCorrelation}
        />
      )}
    </div>
  );
};

export default CorrelationInsights; 