import React from "react";
import clsx from "clsx";

export const Button = ({
  variant,
  className,
  onClick,
  disabled,
  children,
  ...props
}: {
  variant?: string;
  className?: string;
  onClick: () => void;
  disabled?: boolean;
  children: React.ReactNode;
}) => (
  <button
    className={clsx(
      "flex justify-center items-center px-4 h-12 rounded transition-all w-full sm:w-max",
      variant === "outlined" &&
        "border-2 border-gray-500 text-gray-500 hover:border-gray-400 hover:text-gray-400",
      variant === "contained" && "bg-blue-500 text-white hover:bg-blue-400",
      className
    )}
    onClick={onClick}
    disabled={disabled}
    {...props}
  >
    {children}
  </button>
);
