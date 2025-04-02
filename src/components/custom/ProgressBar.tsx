export const ProgressBar = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => (
  <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
    <div 
      className="bg-blue-600 h-2 rounded-full transition-all duration-300 ease-out"
      style={{ width: `${(currentStep / totalSteps) * 100}%` }}
    />
  </div>
);