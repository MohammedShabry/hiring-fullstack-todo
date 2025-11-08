import React from 'react';

/**
 * LoadingSkeleton Component
 * Displays skeleton loaders for better perceived performance
 */
const LoadingSkeleton = () => {
  return (
    <div className="space-y-4">
      {[1, 2, 3].map((item) => (
        <div
          key={item}
          className="bg-white/20 backdrop-blur-md p-5 rounded-xl shadow-md border-2 border-white/30 animate-pulse"
        >
          <div className="flex gap-4">
            {/* Checkbox skeleton */}
            <div className="w-6 h-6 bg-white/30 rounded-md skeleton"></div>
            
            {/* Content skeleton */}
            <div className="flex-1 space-y-3">
              {/* Title */}
              <div className="h-6 bg-white/30 rounded skeleton w-3/4"></div>
              
              {/* Description */}
              <div className="h-4 bg-white/30 rounded skeleton w-full"></div>
              <div className="h-4 bg-white/30 rounded skeleton w-2/3"></div>
              
              {/* Date */}
              <div className="h-3 bg-white/30 rounded skeleton w-24"></div>
            </div>

            {/* Buttons skeleton */}
            <div className="flex gap-2">
              <div className="w-9 h-9 bg-white/30 rounded-lg skeleton"></div>
              <div className="w-9 h-9 bg-white/30 rounded-lg skeleton"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

/**
 * FormSkeleton Component
 * Displays skeleton loader for the form
 */
export const FormSkeleton = () => {
  return (
    <div className="bg-white/20 backdrop-blur-md p-6 rounded-xl shadow-lg animate-pulse">
      <div className="space-y-4">
        <div className="h-12 bg-white/30 rounded-lg skeleton"></div>
        <div className="h-24 bg-white/30 rounded-lg skeleton"></div>
        <div className="h-12 bg-white/30 rounded-lg skeleton"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
