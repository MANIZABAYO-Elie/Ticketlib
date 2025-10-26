import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";

// Define the structure for a navigation link
interface NavLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
}

// Define the props for the Header component
interface HeaderProps {
  brandName: string;
  navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ brandName, navLinks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();

  const toggleMobile = () => setMobileOpen((v) => !v);

  // Close menu when clicking outside or pressing Escape
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape" && mobileOpen) setMobileOpen(false);
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileOpen]);

  const handleNavClick = (path: string) => {
    navigate(path);
    setMobileOpen(false);
  };

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-6 sm:px-6 lg:px-8">
        <div className="flex items-center h-20">
          {/* Brand/Logo Section */}
          <div
            className="cursor-pointer text-4xl font-bold text-white tracking-wider hover:text-blue-200 transition duration-300"
            onClick={() => handleNavClick("/")}
          >
            {brandName}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex justify-between items-center flex-1 ml-10">
            <nav>
              <div className="flex space-x-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link.path)}
                    className="flex items-center px-3 py-2 rounded-md text-lg font-medium text-white hover:bg-blue-600 hover:text-white transition duration-300"
                  >
                    {link.icon}
                    {link.name}
                  </button>
                ))}
              </div>
            </nav>
            
            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button className="p-2 text-white hover:text-blue-200 transition duration-300">
                 <IoIosNotifications className="w-7 h-7"/>
              </button>
              
              {/* User Avatar */}
              <button className="p-2 text-white hover:text-blue-200 transition duration-300">
                <FaUser className="w-6 h-6"/>
              </button>
              
              {/* Sign In Button */}
              <button className="bg-white text-blue-700 px-4 py-2 rounded-md text-lg font-medium hover:bg-blue-100 transition duration-300">
                Sign In
              </button>
            </div>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden ml-auto">
            <button
              ref={buttonRef}
              type="button"
              onClick={toggleMobile}
              aria-controls="mobile-menu"
              aria-expanded={mobileOpen}
              className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
            >
              <span className="sr-only">Open main menu</span>
              {mobileOpen ? (
                // Close (X) Icon
                <svg
                  className="h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                // Hamburger Icon
                <svg
                  className="h-7 w-7"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M4 6h16M4 12h16M4 18h16"
                  />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        id="mobile-menu"
        className={`md:hidden transition-max-h duration-300 ease-in-out overflow-hidden ${
          mobileOpen ? "max-h-[400px]" : "max-h-0"
        }`}
        aria-hidden={!mobileOpen}
      >
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNavClick(link.path)}
              className="flex items-center w-full text-left px-3 py-2 rounded-md text-xl font-medium text-white hover:bg-blue-700 transition duration-300"
            >
              {link.icon}
              {link.name}
            </button>
          ))}
        </div>
      </div>
    </header>
  );
};

export default Header;
