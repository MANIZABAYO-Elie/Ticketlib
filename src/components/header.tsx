import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUser, FaChevronDown } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { type  RootState } from "../app/store";
import { logout } from "../app/authSlice";
import { useLogoutMutation, useGetMeQuery } from "../app/authApi";

interface NavLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface HeaderProps {
  brandName: string;
  navLinks: NavLink[];
}

const Header: React.FC<HeaderProps> = ({ brandName, navLinks }) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { isAuthenticated, user } = useSelector((state: RootState) => state.auth);
  const [logoutMutation] = useLogoutMutation();
  
  // Fetch user data when authenticated
  const { data: userData } = useGetMeQuery(undefined, {
    skip: !isAuthenticated,
  });

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
      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target)
      ) {
        setDropdownOpen(false);
      }
    }

    function handleEsc(e: KeyboardEvent) {
      if (e.key === "Escape") {
        if (mobileOpen) setMobileOpen(false);
        if (dropdownOpen) setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [mobileOpen, dropdownOpen]);

  const toggleMobile = () => setMobileOpen((v) => !v);
  const toggleDropdown = () => setDropdownOpen((v) => !v);

  const handleNavClick = (link: NavLink) => {
    if (link.onClick) {
      link.onClick();
    } else if (link.path) {
      navigate(link.path);
    }
    setMobileOpen(false);
  };

  const handleUserIconClick = () => {
    if (isAuthenticated) {
      toggleDropdown();
    } else {
      navigate("/profile");
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (error) {
      console.error('Logout failed:', error);
    } finally {
      dispatch(logout());
      setDropdownOpen(false);
      navigate('/');
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    const initials = parts.length === 1 ? parts[0][0] : `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return initials.toUpperCase();
  };

  const displayName = userData?.full_name || user?.full_name || userData?.email || user?.email || 'User';

  return (
    <header className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
          {/* Brand/Logo Section */}
          <div
            className="cursor-pointer text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wider hover:text-blue-200 transition duration-300 flex-shrink-0"
            onClick={() => navigate("/")}
          >
            {brandName}
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center flex-1 ml-6 xl:ml-10">
            <nav className="flex-1">
              <div className="flex space-x-2 xl:space-x-4">
                {navLinks.map((link) => (
                  <button
                    key={link.name}
                    onClick={() => handleNavClick(link)}
                    className="flex items-center px-2 xl:px-3 py-2 rounded-md text-sm xl:text-lg font-medium text-white hover:bg-blue-600 transition duration-300"
                  >
                    {link.icon && <span className="mr-1 xl:mr-2">{link.icon}</span>}
                    <span className="hidden xl:inline">{link.name}</span>
                  </button>
                ))}
              </div>
            </nav>

            {/* User Actions */}
            <div className="flex items-center space-x-2 xl:space-x-4">
              {/* Notifications */}
              <button className="p-1.5 xl:p-2 text-white hover:text-blue-200 transition duration-300" title="Notifications">
                <IoIosNotifications className="w-5 h-5 xl:w-7 xl:h-7" />
              </button>

              {/* User Avatar */}
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={handleUserIconClick}
                  className="flex items-center gap-1 xl:gap-2 p-1.5 xl:p-2 text-white hover:text-blue-200 transition duration-300"
                  title={isAuthenticated ? `Signed in as ${displayName}` : "Open profile"}
                >
                  {isAuthenticated ? (
                    <>
                      <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs xl:text-sm font-semibold">
                        {getInitials(displayName)}
                      </div>
                      <FaChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
                    </>
                  ) : (
                    <FaUser className="w-4 h-4 xl:w-6 xl:h-6" />
                  )}
                </button>

                {/* Dropdown Menu */}
                {isAuthenticated && dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 text-sm text-gray-700 border-b">
                      <div className="font-medium">{displayName}</div>
                      <div className="text-gray-500">{userData?.email || user?.email}</div>
                    </div>
                    <button
                      onClick={() => {
                        navigate("/logged-in-profile");
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Profile
                    </button>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>

              {/* Sign In Button - only show when not logged in */}
              {!isAuthenticated && (
                <Link to={"/signIn"}>
                  <button className="bg-white text-blue-700 px-2 xl:px-4 py-1 xl:py-2 rounded-md text-sm xl:text-lg font-medium hover:bg-blue-100 transition duration-300">
                    <span className="hidden xl:inline">Sign In</span>
                    <span className="xl:hidden">Sign</span>
                  </button>
                </Link>
              )}
            </div>
          </div>

          {/* Tablet/Mobile User Actions */}
          <div className="flex lg:hidden items-center space-x-2 mr-2">
            {/* User Avatar for tablet/mobile */}
            <button
              onClick={handleUserIconClick}
              className="p-1.5 text-white hover:text-blue-200 transition duration-300"
              title={isAuthenticated ? `Profile` : "Open profile"}
            >
              {isAuthenticated ? (
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
                  {getInitials(displayName)}
                </div>
              ) : (
                <FaUser className="w-5 h-5 sm:w-6 sm:h-6" />
              )}
            </button>

            {/* Notifications for tablet/mobile */}
            <button className="p-1.5 text-white hover:text-blue-200 transition duration-300" title="Notifications">
              <IoIosNotifications className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden">
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
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileOpen && (
          <div ref={mobileMenuRef} className="lg:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700 rounded-b-lg">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 transition duration-300"
                >
                  {link.icon && <span className="mr-2">{link.icon}</span>}
                  {link.name}
                </button>
              ))}
              
              {!isAuthenticated && (
                <Link to={"/signIn"} onClick={() => setMobileOpen(false)}>
                  <button className="w-full bg-white text-blue-700 px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition duration-300 mt-2">
                    Sign In
                  </button>
                </Link>
              )}
              
              {isAuthenticated && (
                <div className="border-t border-blue-600 pt-2 mt-2">
                  <div className="px-3 py-2 text-sm text-blue-100">
                    <div className="font-medium">{displayName}</div>
                    <div className="text-blue-200">{userData?.email || user?.email}</div>
                  </div>
                  <button
                    onClick={() => {
                      navigate("/logged-in-profile");
                      setMobileOpen(false);
                    }}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-blue-600 transition duration-300"
                  >
                    Profile
                  </button>
                  <button
                    onClick={handleSignOut}
                    className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-blue-600 transition duration-300"
                  >
                    Sign out
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;