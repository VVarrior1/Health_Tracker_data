import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  ReferenceLine,
} from 'recharts';
import { HealthData } from '@/types/health';
import { useMemo, useState } from 'react';

interface HealthChartsProps {
  data: HealthData;
}

export default function HealthCharts({ data }: HealthChartsProps) {
  const [timeFrame, setTimeFrame] = useState<'week' | 'month' | '6months'>('6months');

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = Math.round(minutes % 60);
    return `${hours}h ${mins}m`;
  };

  // Apply time frame filter
  const filterDataByTimeFrame = <T extends { date: string }>(items: T[]): T[] => {
    const now = new Date();
    const cutoffDate = new Date();
    
    if (timeFrame === 'week') {
      cutoffDate.setDate(now.getDate() - 7);
    } else if (timeFrame === 'month') {
      cutoffDate.setMonth(now.getMonth() - 1);
    } else {
      // '6months' - default to all data (already filtered to 6 months)
      return items;
    }
    
    return items.filter(item => new Date(item.date) >= cutoffDate);
  };

  const filteredSteps = filterDataByTimeFrame(data.steps);
  const filteredHeartRate = filterDataByTimeFrame(data.heartRate);
  const filteredRestingHeartRate = filterDataByTimeFrame(data.restingHeartRate);
  const filteredSleep = filterDataByTimeFrame(data.sleep);

  // Calculate averages for the current time frame
  const calculateAverage = <T extends { [key: string]: any }>(items: T[], key: string): number => {
    if (items.length === 0) return 0;
    const sum = items.reduce((acc, item) => acc + item[key], 0);
    return Math.round((sum / items.length) * 10) / 10;
  };

  const avgSteps = calculateAverage(filteredSteps, 'count');
  const avgHeartRate = calculateAverage(filteredHeartRate, 'value');
  const avgRestingHeartRate = calculateAverage(filteredRestingHeartRate, 'value');
  const avgSleepDuration = calculateAverage(filteredSleep, 'duration');

  // Group step data by day to avoid overcrowding
  const groupedSteps = useMemo(() => {
    const grouped = new Map();
    
    data.steps.forEach(step => {
      const date = new Date(step.date);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { date: dateKey, count: 0 });
      }
      
      grouped.get(dateKey).count += step.count;
    });
    
    return Array.from(grouped.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.steps]);

  // Group heart rate data by day to get average
  const groupedHeartRate = useMemo(() => {
    const grouped = new Map();
    
    data.heartRate.forEach(hr => {
      const date = new Date(hr.date);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { date: dateKey, values: [], unit: hr.unit });
      }
      
      grouped.get(dateKey).values.push(hr.value);
    });
    
    return Array.from(grouped.values())
      .map(({ date, values, unit }) => ({ 
        date, 
        value: Math.round((values.reduce((sum: number, v: number) => sum + v, 0) / values.length) * 100) / 100,
        unit 
      }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.heartRate]);

  // Group resting heart rate data by day
  const groupedRestingHeartRate = useMemo(() => {
    const grouped = new Map();
    
    data.restingHeartRate.forEach(hr => {
      const date = new Date(hr.date);
      const dateKey = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
      
      if (!grouped.has(dateKey)) {
        grouped.set(dateKey, { date: dateKey, value: hr.value, unit: hr.unit });
      } else if (hr.value < grouped.get(dateKey).value) {
        // Keep the lowest resting heart rate for the day
        grouped.get(dateKey).value = hr.value;
      }
    });
    
    return Array.from(grouped.values())
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [data.restingHeartRate]);

  return (
    <div className="space-y-8">
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Health Data Visualization</h2>
          <div className="flex space-x-2">
            <button
              onClick={() => setTimeFrame('week')}
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
              className={`px-3 py-1 text-sm rounded-md ${
                timeFrame === '6months' 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Last 6 Months
            </button>
          </div>
        </div>
      </div>

      {/* Steps Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Daily Steps</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-blue-600 mr-1">Avg: {avgSteps.toLocaleString()}</span> steps per day
          </div>
        </div>
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
      </div>

      {/* Heart Rate Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Heart Rate</h3>
          <div className="text-sm text-gray-500 flex items-center">
            <span className="font-medium text-red-600 mr-1">Avg: {avgHeartRate}</span> bpm |
            <span className="font-medium text-purple-600 ml-2 mr-1">Resting: {avgRestingHeartRate}</span> bpm
          </div>
        </div>
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
                domain={['dataMin - 10', 'dataMax + 10']}
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
              />
              {filteredRestingHeartRate.length > 0 && (
                <Line 
                  type="monotone" 
                  data={filteredRestingHeartRate} 
                  dataKey="value" 
                  stroke="#8B5CF6" 
                  name="Resting Heart Rate"
                  dot={true}
                  strokeDasharray="5 5"
                />
              )}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Sleep Chart */}
      <div className="bg-white p-6 rounded-lg shadow">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-lg font-semibold">Sleep Duration ({timeFrame === 'week' ? 'Last Week' : timeFrame === 'month' ? 'Last Month' : 'Last 6 Months'})</h3>
          <div className="flex items-center text-sm text-gray-500">
            <span className="font-medium text-indigo-600 mr-1">Avg: {formatDuration(avgSleepDuration)}</span>
            <span className="text-xs text-gray-400 ml-3">Sessions under 3h filtered out</span>
          </div>
        </div>
        
        {filteredSleep.length > 0 ? (
          <>
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
                    tickFormatter={formatDuration}
                    tick={{ fontSize: 12 }}
                  />
                  <Tooltip
                    labelFormatter={formatDate}
                    formatter={(value: number) => [formatDuration(value), 'Sleep Duration']}
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
            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-3">
              <div className="bg-indigo-50 p-3 rounded-md text-sm flex items-start">
                <div className="h-5 w-5 rounded-full bg-indigo-500 flex-shrink-0 mt-0.5 mr-2"></div>
                <div>
                  <p className="font-medium text-indigo-900">Sleep Duration</p>
                  <p className="text-indigo-700 text-xs mt-1">Total time recorded as asleep from your Apple Watch</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-md text-sm">
                <p className="flex items-center text-blue-900">
                  <svg className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Sleep data from: {filteredSleep.length} nights
                </p>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-[300px] bg-gray-50 rounded-lg">
            <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">No Sleep Data Available</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Your uploaded health data doesn't contain sleep records over 3 hours in the selected time frame.
              To track sleep, enable sleep tracking on your Apple Watch or use Sleep features in the Health app.
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 