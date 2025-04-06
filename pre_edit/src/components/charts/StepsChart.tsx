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
import { formatDate, filterDataByTimeFrame, calculateAverage } from '../utils/dateUtils';

interface StepsChartProps {
  stepsData: Array<{ date: string; count: number }>;
}

const StepsChart: React.FC<StepsChartProps> = ({ stepsData }) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6months');

  const filteredSteps = useMemo(() => 
    filterDataByTimeFrame(stepsData, timeFrame),
    [stepsData, timeFrame]
  );
  
  const avgSteps = useMemo(() => 
    calculateAverage(filteredSteps, 'count'),
    [filteredSteps]
  );

  return (
    <ChartCard 
      title="Daily Steps"
      summary={
        <div className="text-sm text-gray-500 flex items-center">
          <span className="font-medium text-blue-600 mr-1">Avg: {avgSteps.toLocaleString()}</span> steps per day
        </div>
      }
      controls={
        <TimeFrameControl 
          timeFrame={timeFrame} 
          setTimeFrame={setTimeFrame}
          ariaLabel="Steps time frame selection" 
        />
      }
    >
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={filteredSteps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
              domain={[0, 'auto']}
            />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: number) => [value.toLocaleString(), 'Steps']}
            />
            <Legend />
            <Bar 
              dataKey="count" 
              fill="#3B82F6" 
              name="Steps"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default StepsChart; 