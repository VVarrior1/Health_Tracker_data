import React from 'react';
import { GoalData } from '@/types/health';
import { deleteGoal } from '@/lib/goalService';
import GoalIcon from './GoalIcon';
import { formatTarget, formatPeriod } from '../utils/goalUtils';

interface GoalsListProps {
  goals: GoalData[];
  onGoalDeleted: () => void;
  onGoalSelected: (goal: GoalData) => void;
}

const GoalsList: React.FC<GoalsListProps> = ({ goals, onGoalDeleted, onGoalSelected }) => {
  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this goal?')) {
      deleteGoal(id);
      onGoalDeleted();
    }
  };

  if (goals.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <p>You don't have any health goals yet.</p>
        <p className="text-sm mt-2">Create your first goal to start tracking your progress!</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {goals.map((goal) => (
        <div 
          key={goal.id} 
          className="bg-white p-4 rounded-lg shadow border border-gray-200 hover:shadow-md transition-shadow"
        >
          <div className="flex justify-between items-start">
            <div className="flex items-start space-x-3" onClick={() => onGoalSelected(goal)}>
              <div className="mt-1">
                <GoalIcon type={goal.type} />
              </div>
              <div>
                <h3 className="text-lg font-medium text-gray-900">{goal.title}</h3>
                {goal.description && (
                  <p className="text-sm text-gray-500 mt-1">{goal.description}</p>
                )}
                <div className="flex space-x-4 mt-2 text-sm text-gray-500">
                  <div>
                    <span className="font-medium">Target:</span> {formatTarget(goal)}
                  </div>
                  <div>
                    <span className="font-medium">Period:</span> {formatPeriod(goal.period)}
                  </div>
                </div>
              </div>
            </div>
            <button
              onClick={() => handleDelete(goal.id)}
              className="text-gray-400 hover:text-red-500"
              aria-label="Delete goal"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
          
          {/* Progress bar */}
          <div className="mt-4">
            <div className="flex justify-between text-xs text-gray-600 mb-1">
              <span>Progress</span>
              <span>{Math.round(goal.progress)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className={`h-2 rounded-full ${
                  goal.completed 
                    ? 'bg-green-500' 
                    : goal.progress > 66 
                    ? 'bg-blue-500' 
                    : goal.progress > 33 
                    ? 'bg-yellow-500' 
                    : 'bg-red-500'
                }`}
                style={{ width: `${goal.progress}%` }}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GoalsList; 