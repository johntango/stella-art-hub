import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { ThemeToggle } from "@/components/theme-toggle";

interface NavigationProps {
  currentPage: string;
}

const Navigation = ({ currentPage }: NavigationProps) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigationItems = [
    { id: "home", label: "Home", href: "/" },
    { id: "committee", label: "Committee", href: "/committee" },
    { id: "call-for-papers", label: "Call for Papers", href: "/call-for-papers" },
    { id: "venue", label: "Venue", href: "/venue" },
    { id: "program", label: "Program", href: "/program" },
    { id: "visa", label: "Visa", href: "/visa" },
    { id: "dates", label: "Dates", href: "/dates" },
    { id: "payment", label: "Registration", href: "/payment" },
    { id: "admin", label: "Admin", href: "/admin" },
  ];

  return (
    <>
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-8 rounded-lg gradient-hero shadow-glow"></div>
                <div className="flex flex-col">
                  <span className="text-lg font-bold text-primary">AI & AX Design</span>
                  <span className="text-xs text-muted-foreground">Sponsored by the ICAD 2026</span>
                </div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "outline"}
                  size="sm"
                  asChild
                  className="transition-smooth"
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
              <ThemeToggle />
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <ThemeToggle />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background">
            <div className="container mx-auto px-4 py-4 space-y-2">
              {navigationItems.map((item) => (
                <Button
                  key={item.id}
                  variant={currentPage === item.id ? "default" : "outline"}
                  size="sm"
                  asChild
                  className="w-full justify-start transition-smooth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <a href={item.href}>{item.label}</a>
                </Button>
              ))}
            </div>
          </div>
        )}
      </nav>
    </>
  );
};

export default Navigation;