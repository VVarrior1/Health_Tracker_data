// src/components/utils/dateUtils.tsx

export type TimeFrame = 'week' | 'month' | '6months';

export const formatDate = (dateStr: string): string => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

export const filterDataByTimeFrame = <T extends { date: string }>(items: T[], timeFrame: TimeFrame): T[] => {
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

export const calculateAverage = <T extends { [key: string]: any }>(items: T[], key: string): number => {
  if (items.length === 0) return 0;
  const sum = items.reduce((acc, item) => acc + item[key], 0);
  return Math.round((sum / items.length) * 10) / 10;
}; 