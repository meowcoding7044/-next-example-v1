import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="animate-pulse text-gray-500">Loading…</div>
    </div>
  );
}
