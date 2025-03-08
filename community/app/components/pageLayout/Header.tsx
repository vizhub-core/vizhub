import { useState, useEffect } from 'react';
import { Link } from 'react-router';
import { Button } from '~/components/ui/button';
import {
  Search,
  Menu,
  X,
  ChevronDown,
  User,
  Bell,
  LogIn,
  Home,
  Compass,
  LineChart,
  BookOpen,
  Plus,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu';

export interface HeaderProps {
  isAuthenticated?: boolean;
  onLogout?: () => void;
}

export const Header = ({
  isAuthenticated = false,
  onLogout = () => {},
}: HeaderProps) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] =
    useState(false);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () =>
      window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'py-3 bg-white/80 dark:bg-card/80 backdrop-blur-lg shadow-subtle'
          : 'py-5 bg-transparent'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link
          to="/"
          className="flex items-center space-x-2"
        >
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-viz-blue to-viz-indigo flex items-center justify-center">
            <LineChart className="w-5 h-5 text-white" />
          </div>
          <span className="font-display font-bold text-xl">
            VizHub
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-1">
          <Link
            to="/"
            className={`px-3 py-2 rounded-md transition-colors ${
              location.pathname === '/'
                ? 'text-primary font-medium'
                : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
            }`}
          >
            Home
          </Link>
          <Link
            to="/explore"
            className={`px-3 py-2 rounded-md transition-colors ${
              location.pathname === '/explore'
                ? 'text-primary font-medium'
                : 'text-foreground/80 hover:text-foreground hover:bg-secondary'
            }`}
          >
            Explore
          </Link>

          {/* Dropdown for more navigation items */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="px-3 py-2 rounded-md text-foreground/80 hover:text-foreground hover:bg-secondary flex items-center space-x-1">
                <span>More</span>
                <ChevronDown className="w-4 h-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem asChild>
                <Link
                  to="/community"
                  className="flex items-center w-full"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Community</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  to="/help"
                  className="flex items-center w-full"
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  <span>Help & Docs</span>
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  to="/premium"
                  className="flex items-center w-full"
                >
                  <LineChart className="w-4 h-4 mr-2" />
                  <span>Premium</span>
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </nav>

        {/* Search and Actions */}
        <div className="hidden md:flex items-center space-x-3">
          {/* Search */}
          <button
            className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-secondary transition-colors cursor-pointer"
            aria-label="Search"
          >
            <Search className="w-5 h-5" />
          </button>

          {/* Create New Viz Button (always shown) */}
          <Button
            asChild
            className="bg-primary hover:bg-primary/90 text-white rounded-full px-4 transition-all duration-200"
            size="sm"
          >
            <Link to="/create">
              <Plus className="w-4 h-4 mr-1.5" />
              <span className="mr-1">Create</span>
            </Link>
          </Button>

          {/* Auth section - conditionally rendered */}
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <button
                className="p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-secondary transition-colors relative"
                aria-label="Notifications"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-1 right-1 w-2 h-2 bg-viz-red rounded-full"></span>
              </button>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button
                    className="flex items-center justify-center w-9 h-9 rounded-full bg-secondary hover:bg-secondary/80 transition-colors"
                    aria-label="User menu"
                  >
                    <User className="w-5 h-5" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>
                    My Account
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link
                      to="/dashboard"
                      className="w-full"
                    >
                      Dashboard
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/settings" className="w-full">
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={onLogout}>
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="rounded-full hover:bg-secondary/80 transition-all duration-200"
            >
              <Link to="/login">
                <LogIn className="w-4 h-4 mr-1.5" />
                <span className="mr-1">Login</span>
              </Link>
            </Button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="md:hidden p-2 text-foreground/70 hover:text-foreground rounded-full hover:bg-secondary transition-colors"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label={
            mobileMenuOpen ? 'Close menu' : 'Open menu'
          }
        >
          {mobileMenuOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <Menu className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden absolute top-full left-0 right-0 bg-white dark:bg-card border-b border-border shadow-subtle overflow-hidden transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? 'max-h-screen' : 'max-h-0'
        }`}
      >
        <div className="px-4 py-4 space-y-4">
          {/* Mobile Navigation */}
          <nav className="flex flex-col space-y-1">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-secondary"
            >
              <Home className="w-5 h-5 mr-3" />
              <span>Home</span>
            </Link>
            <Link
              to="/explore"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-secondary"
            >
              <Compass className="w-5 h-5 mr-3" />
              <span>Explore</span>
            </Link>
            <Link
              to="/community"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-secondary"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Community</span>
            </Link>
            <Link
              to="/help"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-secondary"
            >
              <BookOpen className="w-5 h-5 mr-3" />
              <span>Help & Docs</span>
            </Link>
            <Link
              to="/premium"
              className="flex items-center px-4 py-3 rounded-lg hover:bg-secondary"
            >
              <LineChart className="w-5 h-5 mr-3" />
              <span>Premium</span>
            </Link>
          </nav>

          {/* Mobile Action Buttons */}
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-border">
            <Button
              asChild
              variant="default"
              className="w-full"
            >
              <Link to="/create">
                <Plus className="w-4 h-4 mr-2" />
                <span className="mr-1">Create</span>
              </Link>
            </Button>

            {isAuthenticated ? (
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link to="/dashboard">
                  <User className="w-4 h-4 mr-2" />
                  <span>Dashboard</span>
                </Link>
              </Button>
            ) : (
              <Button
                asChild
                variant="outline"
                className="w-full"
              >
                <Link to="/login">
                  <LogIn className="w-4 h-4 mr-2" />
                  <span className="mr-1">Login</span>
                </Link>
              </Button>
            )}
          </div>

          {/* Mobile Search */}
          <div className="pt-3 border-t border-border">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-muted-foreground" />
              <input
                type="search"
                placeholder="Search visualizations..."
                className="w-full bg-secondary pl-10 pr-4 py-2.5 rounded-lg"
              />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
