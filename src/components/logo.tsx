import { cn } from "@/lib/utils";
import logoImage from "@/assets/ChatGPT Image Jun 19, 2026, 04_18_57 AM.png";

interface LogoProps {
  variant?: "horizontal" | "vertical" | "icon" | "monogram";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function Logo({ variant = "horizontal", size = "md", className }: LogoProps) {
  const sizes = {
    sm: { width: 120, height: 60 },
    md: { width: 180, height: 90 },
    lg: { width: 240, height: 120 },
    xl: { width: 300, height: 150 },
  };

  const { width, height } = sizes[size];

  return (
    <img
      src={logoImage}
      alt="OBB Store Logo"
      className={cn(className, "object-contain")}
      style={{ width, height }}
    />
  );
}
