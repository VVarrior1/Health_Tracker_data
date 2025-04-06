'use client';

import React, { useMemo, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import ChartCard from './ChartCard';
import TimeFrameControl, { TimeFrame } from '../utils/TimeFrameControl';
import { formatDate, formatDuration, filterDataByTimeFrame, calculateAverage } from '../utils/dateUtils';

interface SleepChartProps {
  sleepData: Array<{ date: string; duration: number }>;
}

const SleepChart: React.FC<SleepChartProps> = ({ sleepData }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6months');

  const filteredSleep = useMemo(() => 
    filterDataByTimeFrame(sleepData, timeFrame),
    [sleepData, timeFrame]
  );
  
  const avgSleepDuration = useMemo(() => 
    calculateAverage(filteredSleep, 'duration'),
    [filteredSleep]
  );

  return (
    <ChartCard 
      title="Sleep Duration"
      summary={
        <div className="text-sm text-gray-500 flex items-center">
          <span className="font-medium text-indigo-600 mr-1">
            Avg: {formatDuration(avgSleepDuration)}
          </span> per night
        </div>
      }
      controls={
        <TimeFrameControl 
          timeFrame={timeFrame} 
          setTimeFrame={setTimeFrame}
          ariaLabel="Sleep time frame selection"
        />
      }
    >
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredSleep}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tickFormatter={(value) => `${Math.floor(value / 60)}h`}
              tick={{ fontSize: 12 }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: number) => [formatDuration(value), 'Sleep']}
            />
            <Legend />
            <Bar 
              dataKey="duration" 
              fill="#6366F1" 
              name="Sleep Duration" 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default SleepChart; 