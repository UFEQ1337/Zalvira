import Link from "next/link";
import { siteConfig } from "@/config/site";

interface LogoProps {
  className?: string;
}

export function Logo({ className }: LogoProps) {
  return (
    <Link href="/" className={`flex items-center space-x-2 ${className}`}>
      <span className="text-xl font-bold bg-gradient-to-r from-primary-500 to-secondary-500 bg-clip-text text-transparent">
        {siteConfig.logoText}
      </span>
    </Link>
  );
}
