import React, { Fragment } from "react";

const ProjectCardNew = () => {
  return (
    <div className="w-[200px] h-[80px] bg-card-bg rounded-tl-lg rounded-br-lg border border-white/10 shadow-lg flex items-center p-4 mb-8 relative">
      <div className="mr-3">
        <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-accent"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
      </div>
      <div>
        <h2 className="text-lg font-bold">Developer Portal</h2>
        <p className="text-secondary-text text-sm">Latest: v1.2.3</p>
      </div>
      <div className="absolute -bottom-1 -right-1 h-3 w-3 bg-accent"></div>
    </div>
  );
};

export default ProjectCardNew;
