import React from "react";

function DaysAgo({ children }: { children: React.ReactNode }) {
  return (
    <div className="mt-6 mb-4 inline-flex w-full items-center justify-center">
      <hr className="my-8 h-px w-64 border-0 bg-gray-200" />
      <span
        className="absolute px-3"
        style={{
          background: "rgb(251 250 252 / 1)",
        }}
      >
        {children}
      </span>
    </div>
  );
}

export default DaysAgo;
