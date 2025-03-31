interface ProcessingStepsProps {
  currentStep: number;
}

export default function ProcessingSteps({ currentStep }: ProcessingStepsProps) {
  const steps = [
    { id: 1, name: 'Reading file' },
    { id: 2, name: 'Parsing XML data' },
    { id: 3, name: 'Extracting health metrics' },
    { id: 4, name: 'Generating visualizations' },
  ];

  return (
    <div className="mt-6">
      <div className="space-y-2">
        {steps.map((step) => (
          <div 
            key={step.id} 
            className={`flex items-center ${currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'}`}
          >
            <div 
              className={`flex-shrink-0 h-5 w-5 relative flex items-center justify-center ${
                currentStep > step.id 
                  ? 'bg-blue-500 rounded-full'
                  : currentStep === step.id
                    ? 'border-2 border-blue-500 rounded-full'
                    : 'border-2 border-gray-300 rounded-full'
              }`}
            >
              {currentStep > step.id ? (
                <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path 
                    fillRule="evenodd" 
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" 
                    clipRule="evenodd" 
                  />
                </svg>
              ) : currentStep === step.id ? (
                <div className="h-2 w-2 bg-blue-500 rounded-full animate-pulse"></div>
              ) : null}
            </div>
            <div className="ml-3">
              <p className={`text-sm font-medium ${currentStep >= step.id ? 'text-gray-900' : 'text-gray-400'}`}>
                {step.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 