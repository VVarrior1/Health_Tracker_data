// src/components/HealthCharts.tsx
'use client';

import React from 'react';
import { HealthData } from '@/types/health';
import StepsChart from './charts/StepsChart';
import HeartRateChart from './charts/HeartRateChart';
import SleepChart from './charts/SleepChart';

interface HealthChartsProps {
  data: HealthData;
}

export default function HealthCharts({ data }: HealthChartsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Health Data Visualization</h2>

      {/* Steps Chart */}
      <StepsChart stepsData={data.steps} />

      {/* Heart Rate Chart */}
      <HeartRateChart 
        heartRateData={data.heartRate} 
        restingHeartRateData={data.restingHeartRate} 
      />

      {/* Sleep Chart */}
      <SleepChart sleepData={data.sleep} />
    </div>
  );
}