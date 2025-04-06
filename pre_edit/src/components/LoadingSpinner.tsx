export default function LoadingSpinner() {
  return (
    <div className="flex flex-col items-center justify-center h-64">
      <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
      <p className="text-gray-600 font-medium">Processing health data...</p>
      <p className="text-gray-500 text-sm mt-2">This may take a moment depending on file size</p>
    </div>
  );
} 