import { Link } from 'react-router';
import {
  LineChart,
  Github,
  Twitter,
  Linkedin,
  Heart,
} from 'lucide-react';

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-white dark:bg-card border-t border-border py-12 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and About */}
          <div className="space-y-4">
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
            <p className="text-muted-foreground text-sm max-w-xs">
              Create, share, and explore interactive data
              visualizations with our intuitive platform.
            </p>
            <div className="flex space-x-3 pt-2">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-foreground/70 hover:text-foreground transition-colors"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Explore */}
          <div>
            <h3 className="font-semibold text-base mb-4">
              Explore
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/explore"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Visualizations
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?trending=true"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Trending
                </Link>
              </li>
              <li>
                <Link
                  to="/explore?latest=true"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Latest
                </Link>
              </li>
              <li>
                <Link
                  to="/topics"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Topics
                </Link>
              </li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h3 className="font-semibold text-base mb-4">
              Resources
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/help"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Documentation
                </Link>
              </li>
              <li>
                <Link
                  to="/community"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Community
                </Link>
              </li>
              <li>
                <Link
                  to="/help/faq"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  FAQ
                </Link>
              </li>
              <li>
                <Link
                  to="/help/tutorials"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Tutorials
                </Link>
              </li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-base mb-4">
              Company
            </h3>
            <ul className="space-y-2.5">
              <li>
                <Link
                  to="/about"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  to="/premium"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Premium
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/terms"
                  className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                >
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border mt-10 pt-6 flex flex-col md:flex-row items-center justify-between">
          <p className="text-muted-foreground text-sm">
            © {currentYear} VizHub. All rights reserved.
          </p>
          <p className="text-muted-foreground text-sm flex items-center mt-4 md:mt-0">
            <span>Made with</span>
            <Heart className="w-4 h-4 mx-1 text-viz-red" />
            <span>for data visualization enthusiasts</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
