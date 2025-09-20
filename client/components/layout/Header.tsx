import { Link, NavLink, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Leaf, MapPin, User2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Header() {
  const location = useLocation();
  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Leaf className="h-5 w-5" />
          </span>
          <span className="text-xl font-extrabold tracking-tight">
            Ayursutra
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm">
          <NavLink
            to="/"
            className={({ isActive }) =>
              cn(
                "transition-colors hover:text-foreground/80",
                isActive || location.pathname === "/"
                  ? "text-foreground"
                  : "text-foreground/60",
              )
            }
          >
            Home
          </NavLink>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              cn(
                "transition-colors hover:text-foreground/80",
                isActive ? "text-foreground" : "text-foreground/60",
              )
            }
          >
            Dashboard
          </NavLink>
        </nav>
        <div className="flex items-center gap-3">
          <Button asChild variant="default" size="sm" className="gap-2">
            <Link to="/dashboard">
              <MapPin className="h-4 w-4" /> Find Centres
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-2">
            <Link to="/dashboard">
              <User2 className="h-4 w-4" /> My Account
            </Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
