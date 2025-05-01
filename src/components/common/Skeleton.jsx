import React from "react";

const Skeleton = ({ height = "200px", width = "100%", className = "" }) => {
  return (
    <div
      className={`animate-pulse bg-gray-200 dark:bg-gray-700 rounded-lg ${className}`}
      style={{ height, width }}
    ></div>
  );
};

export default Skeleton;