import React, { useState, useEffect } from 'react';
import { GoalData, GoalType, GoalPeriod } from '@/types/health';
import { createGoal, updateGoal } from '@/lib/goalService';
import { getTargetPlaceholder, getTargetUnit } from './GoalFormUtils';

interface GoalFormProps {
  onGoalSaved: () => void;
  existingGoal?: GoalData;
  onCancel: () => void;
}

const GoalForm: React.FC<GoalFormProps> = ({ onGoalSaved, existingGoal, onCancel }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<GoalType>('steps');
  const [target, setTarget] = useState('');
  const [period, setPeriod] = useState<GoalPeriod>('daily');
  const [error, setError] = useState<string | null>(null);

  // Load existing goal data if editing
  useEffect(() => {
    if (existingGoal) {
      setTitle(existingGoal.title);
      setDescription(existingGoal.description || '');
      setType(existingGoal.type);
      setTarget(existingGoal.target.toString());
      setPeriod(existingGoal.period);
    }
  }, [existingGoal]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!title.trim()) {
      setError('Please enter a title for your goal');
      return;
    }

    const targetValue = parseFloat(target);
    if (isNaN(targetValue) || targetValue <= 0) {
      setError('Please enter a valid positive number for your target');
      return;
    }

    try {
      if (existingGoal) {
        // Update existing goal
        const updatedGoal: GoalData = {
          ...existingGoal,
          title,
          description: description || undefined,
          type,
          target: targetValue,
          period,
        };
        updateGoal(updatedGoal);
      } else {
        // Create new goal
        createGoal(
          type,
          targetValue,
          period,
          title,
          description || undefined
        );
      }
      
      onGoalSaved();
    } catch (err) {
      setError('Failed to save goal. Please try again.');
      console.error('Error saving goal:', err);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">
        {existingGoal ? 'Edit Goal' : 'Create New Goal'}
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 text-red-700 rounded-md text-sm">
            {error}
          </div>
        )}
        
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Title
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., 10,000 steps per day"
            required
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description (optional)
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="e.g., Walk more to improve cardiovascular health"
            rows={2}
          />
        </div>
        
        <div>
          <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-1">
            Goal Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as GoalType)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="steps">Steps</option>
            <option value="sleep">Sleep</option>
            <option value="heartRate">Heart Rate</option>
            <option value="workout">Workout</option>
          </select>
        </div>
        
        <div>
          <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-1">
            Target {getTargetUnit(type)}
          </label>
          <input
            type="number"
            id="target"
            value={target}
            onChange={(e) => setTarget(e.target.value)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder={getTargetPlaceholder(type)}
            min="1"
            step="any"
            required
          />
        </div>
        
        <div>
          <label htmlFor="period" className="block text-sm font-medium text-gray-700 mb-1">
            Time Period
          </label>
          <select
            id="period"
            value={period}
            onChange={(e) => setPeriod(e.target.value as GoalPeriod)}
            className="w-full border border-gray-300 rounded-md px-3 py-2 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
            <option value="monthly">Monthly</option>
          </select>
        </div>
        
        <div className="flex justify-end space-x-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            {existingGoal ? 'Update Goal' : 'Create Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default GoalForm; 