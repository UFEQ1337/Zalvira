"use client";

import { Fragment } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { authService } from "@/lib/auth/auth-service";
import { navigationConfig } from "@/config/navigation";
import {
  User,
  LogOut,
  CreditCard,
  Settings,
  User as UserIcon,
} from "lucide-react";

interface UserDropdownProps {
  user: {
    id?: number;
    username?: string;
    email?: string;
  };
}

export function UserDropdown({ user }: UserDropdownProps) {
  const router = useRouter();

  const handleLogout = async () => {
    await authService.logout();
    router.push("/");
    router.refresh();
  };

  // Get initials from username or email for the avatar
  const getInitials = () => {
    if (user.username) {
      return user.username.substring(0, 2).toUpperCase();
    } else if (user.email) {
      return user.email.substring(0, 2).toUpperCase();
    }
    return "U";
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 rounded-full">
          <Avatar className="h-8 w-8">
            <AvatarImage
              src="/placeholder-avatar.png"
              alt={user.username || "User"}
            />
            <AvatarFallback>{getInitials()}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {user.username || "Użytkownik"}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          {navigationConfig.accountSubmenu.map((item) => (
            <Fragment key={item.href}>
              {item.action === "logout" ? (
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Wyloguj</span>
                </DropdownMenuItem>
              ) : (
                <DropdownMenuItem asChild>
                  <Link href={item.href} className="flex items-center">
                    {getIconForMenuItem(item.icon)}
                    <span>{item.label}</span>
                  </Link>
                </DropdownMenuItem>
              )}
              {item.label === "Portfel" && <DropdownMenuSeparator />}
            </Fragment>
          ))}
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

// Helper function to get the correct icon based on the icon name
function getIconForMenuItem(iconName: string) {
  switch (iconName) {
    case "user":
      return <UserIcon className="mr-2 h-4 w-4" />;
    case "wallet":
      return <CreditCard className="mr-2 h-4 w-4" />;
    case "settings":
      return <Settings className="mr-2 h-4 w-4" />;
    default:
      return <User className="mr-2 h-4 w-4" />;
  }
}
