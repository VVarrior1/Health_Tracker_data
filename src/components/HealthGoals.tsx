import React, { useState, useEffect } from 'react';
import { GoalData, HealthData } from '@/types/health';
import { getGoals, updateAllGoals } from '@/lib/goalService';
import GoalsList from './goals/GoalsList';
import GoalForm from './goals/GoalForm';

interface HealthGoalsProps {
  healthData: HealthData;
}

const HealthGoals: React.FC<HealthGoalsProps> = ({ healthData }) => {
  const [goals, setGoals] = useState<GoalData[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<GoalData | undefined>(undefined);

  // Load goals and update progress when component mounts or health data changes
  useEffect(() => {
    loadGoals();
  }, [healthData]);

  const loadGoals = () => {
    // Update goals progress based on health data
    const updatedGoals = updateAllGoals(healthData);
    setGoals(updatedGoals);
  };

  const handleGoalSaved = () => {
    loadGoals();
    setShowForm(false);
    setSelectedGoal(undefined);
  };

  const handleGoalSelected = (goal: GoalData) => {
    setSelectedGoal(goal);
    setShowForm(true);
  };

  const handleAddNewGoal = () => {
    setSelectedGoal(undefined);
    setShowForm(true);
  };

  const handleCancel = () => {
    setShowForm(false);
    setSelectedGoal(undefined);
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="p-6 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-800">Health Goals</h2>
          {!showForm && (
            <button
              onClick={handleAddNewGoal}
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <svg
                className="-ml-1 mr-2 h-5 w-5"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                />
              </svg>
              Add New Goal
            </button>
          )}
        </div>
      </div>

      <div className="p-6">
        {showForm ? (
          <GoalForm
            onGoalSaved={handleGoalSaved}
            existingGoal={selectedGoal}
            onCancel={handleCancel}
          />
        ) : (
          <GoalsList
            goals={goals}
            onGoalDeleted={loadGoals}
            onGoalSelected={handleGoalSelected}
          />
        )}
      </div>
    </div>
  );
};

export default HealthGoals; 