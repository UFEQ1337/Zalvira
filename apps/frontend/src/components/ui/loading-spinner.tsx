import { RotateCw } from "lucide-react";

interface LoadingSpinnerProps {
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function LoadingSpinner({
  size = "md",
  className = "",
}: LoadingSpinnerProps) {
  let sizeClass = "";

  switch (size) {
    case "sm":
      sizeClass = "h-4 w-4";
      break;
    case "md":
      sizeClass = "h-6 w-6";
      break;
    case "lg":
      sizeClass = "h-10 w-10";
      break;
  }

  return (
    <div className={`animate-spin ${sizeClass} ${className}`}>
      <RotateCw className="w-full h-full text-primary-500" />
    </div>
  );
}
