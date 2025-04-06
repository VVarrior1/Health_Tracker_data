export const formatNumber = (num: number): string => {
  return Math.round(num * 100) / 100 > 100 
    ? Math.round(num).toLocaleString() 
    : (Math.round(num * 100) / 100).toLocaleString();
};

export const formatDuration = (minutes: number): string => {
  // Ensure the input is a valid number
  if (isNaN(minutes) || minutes < 0) {
    minutes = 0;
  }
  
  const hours = Math.floor(minutes / 60);
  const mins = Math.round(minutes % 60);
  return `${hours}h ${mins}m`;
};

export const getSleepQuality = (duration: number): string => {
  if (isNaN(duration) || duration === 0) return 'No data';
  if (duration < 360) return 'Not enough sleep';
  if (duration >= 360 && duration < 420) return 'Adequate';
  if (duration >= 420 && duration < 540) return 'Good';
  return 'Excellent';
}; 