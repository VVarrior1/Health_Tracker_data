import React from 'react';
import { HealthSummary as HealthSummaryType } from '@/types/health';
import { formatNumber, formatDuration, getSleepQuality } from './utils/summaryUtils';

interface HealthSummaryProps {
  summary: HealthSummaryType;
}

export default function HealthSummary({ summary }: HealthSummaryProps) {
  const hasSleepData = !isNaN(summary.averageSleepDuration) && summary.averageSleepDuration > 0;

  const stats = [
    {
      name: 'Average Daily Steps',
      value: formatNumber(summary.averageSteps),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
    },
    {
      name: 'Total Workouts',
      value: summary.totalWorkouts.toString(),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
        </svg>
      ),
    },
    {
      name: 'Avg. Workout Duration',
      value: formatDuration(summary.averageWorkoutDuration),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
    {
      name: 'Average Heart Rate',
      value: `${formatNumber(summary.averageHeartRate)} bpm`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
    },
    {
      name: 'Resting Heart Rate',
      value: `${formatNumber(summary.averageRestingHeartRate)} bpm`,
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
        </svg>
      ),
      className: "bg-purple-100",
    },
    {
      name: 'Sleep',
      value: hasSleepData ? formatDuration(summary.averageSleepDuration) : 'No data',
      subtitle: getSleepQuality(summary.averageSleepDuration),
      icon: (
        <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
        </svg>
      ),
      className: hasSleepData ? '' : 'bg-gray-50',
    }
  ];

  return (
    <div className="bg-white shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Health Summary <span className="text-sm text-gray-500 font-normal">(Last 6 Months)</span></h3>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {stats.map((stat) => (
            <div
              key={stat.name}
              className={`relative bg-white pt-5 px-4 pb-12 sm:pt-6 sm:px-6 shadow rounded-lg overflow-hidden ${stat.className || ''}`}
            >
              <dt>
                <div className={`absolute rounded-md ${stat.name === 'Sleep' && !hasSleepData ? 'bg-gray-400' : 'bg-blue-500'} p-3`}>
                  <div className="text-white">{stat.icon}</div>
                </div>
                <p className="ml-16 text-sm font-medium text-gray-500 truncate">{stat.name}</p>
              </dt>
              <dd className="ml-16 pb-6 flex flex-col items-baseline sm:pb-7">
                <p className={`text-2xl font-semibold ${stat.name === 'Sleep' && !hasSleepData ? 'text-gray-500' : 'text-gray-900'}`}>
                  {stat.value}
                </p>
                {stat.subtitle && (
                  <p className={`text-sm ${stat.name === 'Sleep' && !hasSleepData ? 'text-gray-400' : 'text-gray-500'} mt-1`}>
                    {stat.subtitle}
                  </p>
                )}
              </dd>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
} 