import { Link, NavLink, useLocation } from "react-router-dom";
import { Button } from "./ui/button";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import logo from "figma:asset/9f81ed77f1d1b1fce6de57ec26fc06cd89a9a112.png";

const nav = [
  { label: "Home", to: "/" },
  { label: "Services", to: "/services" },
  { label: "Projects", to: "/projects" },
  { label: "Insights", to: "/insights" },
  { label: "About", to: "/about" },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    setIsMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-black/95 backdrop-blur-md border-b border-[#CCFF00]/20">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-20">
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="ACT Creative" className="h-12 w-auto" />
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            {nav.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  `relative group transition-colors ${
                    isActive ? "text-[#CCFF00]" : "text-white hover:text-[#CCFF00]"
                  }`
                }
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-[#CCFF00] group-hover:w-full transition-all" />
              </NavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-3">
            <Button
              asChild
              className="bg-[#CCFF00] hover:bg-[#b8e600] text-black shadow-lg hover:shadow-[#CCFF00]/50 transition-all"
            >
              <Link to="/request-a-quote">Request a Quote</Link>
            </Button>
          </div>

          <div className="flex md:hidden items-center gap-2">
            <motion.button
              className="p-2 rounded-lg bg-[#1a1a1a]"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              whileTap={{ scale: 0.9 }}
              aria-label={isMenuOpen ? "Close menu" : "Open menu"}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6 text-[#CCFF00]" />
              ) : (
                <Menu className="w-6 h-6 text-[#CCFF00]" />
              )}
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {isMenuOpen && (
            <motion.nav
              className="md:hidden py-4 border-t border-[#CCFF00]/20"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex flex-col space-y-2">
                {nav.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === "/"}
                    className={({ isActive }) =>
                      `text-left px-4 py-2 rounded-lg transition-colors ${
                        isActive
                          ? "text-[#CCFF00] bg-[#1a1a1a]"
                          : "text-white hover:text-[#CCFF00] hover:bg-[#1a1a1a]"
                      }`
                    }
                  >
                    {item.label}
                  </NavLink>
                ))}
                <Button
                  asChild
                  className="w-full bg-[#CCFF00] hover:bg-[#b8e600] text-black mt-2"
                >
                  <Link to="/request-a-quote">Request a Quote</Link>
                </Button>
              </div>
            </motion.nav>
          )}
        </AnimatePresence>
      </div>
    </header>
  );
}
