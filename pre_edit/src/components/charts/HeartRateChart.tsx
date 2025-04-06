'use client';

import React, { useMemo, useState } from 'react';
import {
  LineChart,
  Line,
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

interface HeartRateChartProps {
  heartRateData: Array<{ date: string; value: number }>;
  restingHeartRateData: Array<{ date: string; value: number }>;
}

const HeartRateChart: React.FC<HeartRateChartProps> = ({ 
  heartRateData, 
  restingHeartRateData 
}) => {
  const [timeFrame, setTimeFrame] = useState<TimeFrame>('6months');

  const filteredHeartRate = useMemo(() => 
    filterDataByTimeFrame(heartRateData, timeFrame),
    [heartRateData, timeFrame]
  );
  
  const filteredRestingHeartRate = useMemo(() => 
    filterDataByTimeFrame(restingHeartRateData, timeFrame),
    [restingHeartRateData, timeFrame]
  );
  
  const avgHeartRate = useMemo(() => 
    calculateAverage(filteredHeartRate, 'value'),
    [filteredHeartRate]
  );
  
  const avgRestingHeartRate = useMemo(() => 
    calculateAverage(filteredRestingHeartRate, 'value'),
    [filteredRestingHeartRate]
  );

  return (
    <ChartCard 
      title="Heart Rate"
      summary={
        <div className="text-sm text-gray-500 flex items-center">
          <span className="font-medium text-red-600 mr-1">Avg: {avgHeartRate}</span> bpm |
          <span className="font-medium text-purple-600 ml-2 mr-1">Resting: {avgRestingHeartRate}</span> bpm
        </div>
      }
      controls={
        <TimeFrameControl 
          timeFrame={timeFrame}
          setTimeFrame={setTimeFrame}
          ariaLabel="Heart rate time frame selection"
        />
      }
    >
      <div className="h-[400px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={filteredHeartRate}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="date" 
              tickFormatter={formatDate}
              tick={{ fontSize: 12 }}
            />
            <YAxis 
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={formatDate}
              formatter={(value: number) => [`${value} bpm`, 'Heart Rate']}
            />
            <Legend />
            <Line 
              type="monotone" 
              dataKey="value" 
              stroke="#EF4444" 
              name="Heart Rate" 
              dot={false}
              activeDot={{ r: 6 }}
            />
            {filteredRestingHeartRate.length > 0 && (
              <Line 
                type="monotone" 
                data={filteredRestingHeartRate}
                dataKey="value" 
                stroke="#8B5CF6" 
                name="Resting Heart Rate" 
                dot={false}
                activeDot={{ r: 6 }}
              />
            )}
          </LineChart>
        </ResponsiveContainer>
      </div>
    </ChartCard>
  );
};

export default HeartRateChart; 