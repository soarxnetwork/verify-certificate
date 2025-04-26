import React from "react";

interface ResponsiveContainerProps {
  children: React.ReactNode;
  className?: string;
}

const ResponsiveContainer: React.FC<ResponsiveContainerProps> = ({
  children,
  className = "",
}) => {
  return (
    <div
      className={` px-4 sm:px-4 md:px-6 lg:px-10 xl:px-16 py-6 sm:py-8 md:py-10 ${className}`}
    >
      {children}
    </div>
  );
};

export default ResponsiveContainer;
