'use client';

import { useState, useEffect } from 'react';
import FileUpload from '@/components/FileUpload';
import HealthCharts from '@/components/HealthCharts';
import HealthSummary from '@/components/HealthSummary';
import HealthGoals from '@/components/HealthGoals';
import LoadingSpinner from '@/components/LoadingSpinner';
import ProcessingSteps from '@/components/ProcessingSteps';
import { HealthData } from '@/types/health';
import { parseHealthData } from '@/lib/healthDataParser';

export default function Home() {
  const [healthData, setHealthData] = useState<HealthData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [processingStep, setProcessingStep] = useState(0);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'goals'>('dashboard');

  // Reset processing step when not loading
  useEffect(() => {
    if (!isLoading) {
      setProcessingStep(0);
    }
  }, [isLoading]);

  const handleFileUpload = async (file: File) => {
    setIsLoading(true);
    setError(null);
    setProcessingStep(1); // Reading file

    try {
      // Simulate file reading delay for better UX
      await new Promise(resolve => setTimeout(resolve, 800));
      const text = await file.text();
      
      setProcessingStep(2); // Parsing XML data
      await new Promise(resolve => setTimeout(resolve, 600));
      
      setProcessingStep(3); // Extracting health metrics
      const data = await parseHealthData(text);
      
      setProcessingStep(4); // Generating visualizations
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setHealthData(data);
    } catch (err) {
      setError('Error parsing the file. Please make sure it is a valid Apple Watch export.xml file.');
      console.error('Error parsing file:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
            Apple Watch Health Data Analyzer
          </h1>
          <p className="mt-3 text-lg text-gray-500">
            Upload your Apple Watch export.xml file to view detailed health and fitness insights
          </p>
          <p className="mt-2 text-sm text-gray-400">
            All analysis is based on data from the last 6 months only
          </p>
        </div>

        {!healthData ? (
          <div className="max-w-xl mx-auto">
            {isLoading ? (
              <div className="bg-white p-8 rounded-lg shadow">
                <LoadingSpinner />
                <ProcessingSteps currentStep={processingStep} />
              </div>
            ) : (
              <>
                <FileUpload onFileUpload={handleFileUpload} />
                {error && (
                  <div className="mt-4 p-4 bg-red-50 rounded-md">
                    <div className="flex">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3">
                        <p className="text-sm text-red-700">{error}</p>
                      </div>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        ) : (
          <div>
            {/* Navigation Tabs */}
            <div className="border-b border-gray-200 mb-6">
              <nav className="-mb-px flex space-x-8">
                <button
                  onClick={() => setActiveTab('dashboard')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'dashboard'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Dashboard
                </button>
                <button
                  onClick={() => setActiveTab('goals')}
                  className={`pb-4 px-1 border-b-2 font-medium text-sm ${
                    activeTab === 'goals'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Health Goals
                </button>
              </nav>
            </div>

            {activeTab === 'dashboard' ? (
              <div className="space-y-8">
                <HealthSummary summary={healthData.summary} />
                <HealthCharts data={healthData} />
              </div>
            ) : (
              <HealthGoals healthData={healthData} />
            )}

            <div className="text-center mt-8">
              <button
                onClick={() => setHealthData(null)}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Upload New File
              </button>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
