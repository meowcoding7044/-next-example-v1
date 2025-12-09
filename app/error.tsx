"use client";
import React from 'react';

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  // In production you might send this to a logging endpoint.
  React.useEffect(() => {
    console.error('Unhandled error in app:', error);
  }, [error]);

  return (
    <html>
      <body>
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
          <div className="max-w-lg w-full bg-white p-6 rounded shadow">
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="mt-2 text-sm text-gray-600">An unexpected error occurred. Try again or contact support.</p>
            <div className="mt-4 flex gap-2">
              <button onClick={() => reset()} className="btn btn-primary">Try again</button>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
