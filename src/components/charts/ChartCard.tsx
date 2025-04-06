'use client';

import React from 'react';

export interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  summary?: React.ReactNode;
  controls?: React.ReactNode;
}

const ChartCard: React.FC<ChartCardProps> = ({ title, children, summary, controls }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
      <h3 className="text-lg font-semibold">{title}</h3>
      {(summary || controls) && (
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          {summary}
          {controls}
        </div>
      )}
    </div>
    {children}
  </div>
);

export default ChartCard; 