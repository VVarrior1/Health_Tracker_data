'use client';

import React from 'react';

export type TimeFrame = 'week' | 'month' | '6months';

export interface TimeFrameControlProps {
  timeFrame: TimeFrame;
  setTimeFrame: (tf: TimeFrame) => void;
  ariaLabel: string;
}

const TimeFrameControl: React.FC<TimeFrameControlProps> = ({ 
  timeFrame, 
  setTimeFrame,
  ariaLabel 
}) => (
  <div className="flex space-x-2" role="group" aria-label={ariaLabel}>
    <button
      onClick={() => setTimeFrame('week')}
      aria-pressed={timeFrame === 'week'}
      className={`px-3 py-1 text-sm rounded-md ${
        timeFrame === 'week' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Last Week
    </button>
    <button
      onClick={() => setTimeFrame('month')}
      aria-pressed={timeFrame === 'month'}
      className={`px-3 py-1 text-sm rounded-md ${
        timeFrame === 'month' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Last Month
    </button>
    <button
      onClick={() => setTimeFrame('6months')}
      aria-pressed={timeFrame === '6months'}
      className={`px-3 py-1 text-sm rounded-md ${
        timeFrame === '6months' 
          ? 'bg-blue-600 text-white' 
          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
      }`}
    >
      Last 6 Months
    </button>
  </div>
);

export default TimeFrameControl; 