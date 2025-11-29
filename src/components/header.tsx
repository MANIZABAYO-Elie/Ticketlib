// import React, { useEffect, useRef, useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
// import { IoIosNotifications } from "react-icons/io";
// import { FaUser, FaChevronDown } from "react-icons/fa";
// import { useAppSelector, useAppDispatch } from "../app/hooks";
// import { logout } from "../app/authSlice";
// import { useLogoutMutation } from "../app/authApi";

// interface NavLink {
//   name: string;
//   path: string;
//   icon?: React.ReactNode;
//   onClick?: () => void;
// }

// interface HeaderProps {
//   brandName: string;
//   navLinks: NavLink[];
// }

// const Header: React.FC<HeaderProps> = ({ brandName, navLinks }) => {
//   const [mobileOpen, setMobileOpen] = useState(false);
//   const [dropdownOpen, setDropdownOpen] = useState(false);
//   const mobileMenuRef = useRef<HTMLDivElement | null>(null);
//   const dropdownRef = useRef<HTMLDivElement | null>(null);
//   const buttonRef = useRef<HTMLButtonElement | null>(null);
//   const navigate = useNavigate();
//   const dispatch = useAppDispatch();
  
//   const { isLoggedIn, user } = useAppSelector((state) => state.auth);
//   const [logoutMutation] = useLogoutMutation();

//   useEffect(() => {
//     function handleClickOutside(e: MouseEvent) {
//       const target = e.target as Node | null;
//       if (
//         mobileOpen &&
//         mobileMenuRef.current &&
//         !mobileMenuRef.current.contains(target) &&
//         buttonRef.current &&
//         !buttonRef.current.contains(target)
//       ) {
//         setMobileOpen(false);
//       }
//       if (
//         dropdownOpen &&
//         dropdownRef.current &&
//         !dropdownRef.current.contains(target)
//       ) {
//         setDropdownOpen(false);
//       }
//     }

//     function handleEsc(e: KeyboardEvent) {
//       if (e.key === "Escape") {
//         if (mobileOpen) setMobileOpen(false);
//         if (dropdownOpen) setDropdownOpen(false);
//       }
//     }

//     document.addEventListener("mousedown", handleClickOutside);
//     document.addEventListener("keydown", handleEsc);
//     return () => {
//       document.removeEventListener("mousedown", handleClickOutside);
//       document.removeEventListener("keydown", handleEsc);
//     };
//   }, [mobileOpen, dropdownOpen]);

//   const toggleMobile = () => setMobileOpen((v) => !v);
//   const toggleDropdown = () => setDropdownOpen((v) => !v);

//   const handleNavClick = (link: NavLink) => {
//     if (link.onClick) {
//       link.onClick();
//     } else if (link.path) {
//       navigate(link.path);
//     }
//     setMobileOpen(false);
//   };

//   const handleUserIconClick = () => {
//     if (isLoggedIn) {
//       toggleDropdown();
//     } else {
//       navigate("/profile");
//     }
//   };

//   const handleSignOut = async () => {
//     try {
//       await logoutMutation().unwrap();
//     } catch (error) {
//       console.error('Logout failed:', error);
//     } finally {
//       dispatch(logout());
//       setDropdownOpen(false);
//       navigate('/');
//     }
//   };

//   const getInitials = (name?: string) => {
//     if (!name) return "U";
//     const parts = name.trim().split(" ").filter(Boolean);
//     const initials = parts.length === 1 ? parts[0][0] : `${parts[0][0]}${parts[parts.length - 1][0]}`;
//     return initials.toUpperCase();
//   };

//   const displayName = user?.fullName || user?.email || 'User';

//   return (
//     <header className="bg-gradient-to-r from-blue-800 to-blue-500 shadow-lg sticky top-0 z-50">
//       <div className="max-w-7xl mx-auto px-3 sm:px-4 md:px-6 lg:px-8">
//         <div className="flex items-center justify-between h-16 sm:h-18 md:h-20">
//           {/* Brand/Logo Section */}
//           <div
//             className="cursor-pointer text-xl sm:text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-wider hover:text-blue-200 transition duration-300 flex-shrink-0"
//             onClick={() => navigate("/")}
//           >
//             {brandName}
//           </div>

//           {/* Desktop Navigation */}
//           <div className="hidden lg:flex items-center flex-1 ml-6 xl:ml-10">
//             <nav className="flex-1">
//               <div className="flex space-x-2 xl:space-x-4">
//                 {navLinks.map((link) => (
//                   <button
//                     key={link.name}
//                     onClick={() => handleNavClick(link)}
//                     className="flex items-center px-2 xl:px-3 py-2 rounded-md text-sm xl:text-lg font-medium text-white hover:bg-blue-600 transition duration-300"
//                   >
//                     {link.icon && <span className="mr-1 xl:mr-2">{link.icon}</span>}
//                     <span className="hidden xl:inline">{link.name}</span>
//                   </button>
//                 ))}
//               </div>
//             </nav>

//             {/* User Actions */}
//             <div className="flex items-center space-x-2 xl:space-x-4">
//               {/* Notifications */}
//               <button className="p-1.5 xl:p-2 text-white hover:text-blue-200 transition duration-300" title="Notifications">
//                 <IoIosNotifications className="w-5 h-5 xl:w-7 xl:h-7" />
//               </button>

//               {/* User Avatar */}
//               <div className="relative" ref={dropdownRef}>
//                 <button
//                   onClick={handleUserIconClick}
//                   className="flex items-center gap-1 xl:gap-2 p-1.5 xl:p-2 text-white hover:text-blue-200 transition duration-300"
//                   title={isLoggedIn ? `Signed in as ${displayName}` : "Open profile"}
//                 >
//                   {isLoggedIn ? (
//                     <>
//                       <div className="w-6 h-6 xl:w-8 xl:h-8 rounded-full bg-white/20 flex items-center justify-center text-xs xl:text-sm font-semibold">
//                         {getInitials(displayName)}
//                       </div>
//                       <FaChevronDown className="w-3 h-3 xl:w-4 xl:h-4" />
//                     </>
//                   ) : (
//                     <FaUser className="w-4 h-4 xl:w-6 xl:h-6" />
//                   )}
//                 </button>

//                 {/* Dropdown Menu */}
//                 {isLoggedIn && dropdownOpen && (
//                   <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
//                     <div className="px-4 py-2 text-sm text-gray-700 border-b">
//                       <div className="font-medium">{displayName}</div>
//                       <div className="text-gray-500">{user?.email}</div>
//                     </div>
//                     <button
//                       onClick={() => {
//                         navigate("/logged-in-profile");
//                         setDropdownOpen(false);
//                       }}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Profile
//                     </button>
//                     <button
//                       onClick={handleSignOut}
//                       className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
//                     >
//                       Sign out
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Sign In Button - only show when not logged in */}
//               {!isLoggedIn && (
//                 <Link to={"/signIn"}>
//                   <button className="bg-white text-blue-700 px-2 xl:px-4 py-1 xl:py-2 rounded-md text-sm xl:text-lg font-medium hover:bg-blue-100 transition duration-300">
//                     <span className="hidden xl:inline">Sign In</span>
//                     <span className="xl:hidden">Sign</span>
//                   </button>
//                 </Link>
//               )}
//             </div>
//           </div>

//           {/* Tablet/Mobile User Actions */}
//           <div className="flex lg:hidden items-center space-x-2 mr-2">
//             {/* User Avatar for tablet/mobile */}
//             <button
//               onClick={handleUserIconClick}
//               className="p-1.5 text-white hover:text-blue-200 transition duration-300"
//               title={isLoggedIn ? `Profile` : "Open profile"}
//             >
//               {isLoggedIn ? (
//                 <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white/20 flex items-center justify-center text-xs sm:text-sm font-semibold">
//                   {getInitials(displayName)}
//                 </div>
//               ) : (
//                 <FaUser className="w-5 h-5 sm:w-6 sm:h-6" />
//               )}
//             </button>

//             {/* Notifications for tablet/mobile */}
//             <button className="p-1.5 text-white hover:text-blue-200 transition duration-300" title="Notifications">
//               <IoIosNotifications className="w-5 h-5 sm:w-6 sm:h-6" />
//             </button>
//           </div>

//           {/* Mobile Menu Button */}
//           <div className="lg:hidden">
//             <button
//               ref={buttonRef}
//               type="button"
//               onClick={toggleMobile}
//               aria-controls="mobile-menu"
//               aria-expanded={mobileOpen}
//               className="inline-flex items-center justify-center p-2 rounded-md text-blue-200 hover:text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
//             >
//               <span className="sr-only">Open main menu</span>
//               {mobileOpen ? (
//                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile Menu */}
//         {mobileOpen && (
//           <div ref={mobileMenuRef} className="lg:hidden" id="mobile-menu">
//             <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-blue-700 rounded-b-lg">
//               {navLinks.map((link) => (
//                 <button
//                   key={link.name}
//                   onClick={() => handleNavClick(link)}
//                   className="flex items-center w-full px-3 py-2 rounded-md text-base font-medium text-white hover:bg-blue-600 transition duration-300"
//                 >
//                   {link.icon && <span className="mr-2">{link.icon}</span>}
//                   {link.name}
//                 </button>
//               ))}
              
//               {!isLoggedIn && (
//                 <Link to={"/signIn"} onClick={() => setMobileOpen(false)}>
//                   <button className="w-full bg-white text-blue-700 px-3 py-2 rounded-md text-base font-medium hover:bg-blue-100 transition duration-300 mt-2">
//                     Sign In
//                   </button>
//                 </Link>
//               )}
              
//               {isLoggedIn && (
//                 <div className="border-t border-blue-600 pt-2 mt-2">
//                   <div className="px-3 py-2 text-sm text-blue-100">
//                     <div className="font-medium">{displayName}</div>
//                     <div className="text-blue-200">{user?.email}</div>
//                   </div>
//                   <button
//                     onClick={() => {
//                       navigate("/logged-in-profile");
//                       setMobileOpen(false);
//                     }}
//                     className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-blue-600 transition duration-300"
//                   >
//                     Profile
//                   </button>
//                   <button
//                     onClick={handleSignOut}
//                     className="block w-full text-left px-3 py-2 text-base font-medium text-white hover:bg-blue-600 transition duration-300"
//                   >
//                     Sign out
//                   </button>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </div>
//     </header>
//   );
// };

// export default Header;

import React, { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { IoIosNotifications } from "react-icons/io";
import { FaUser } from "react-icons/fa";
import { useAppSelector, useAppDispatch } from "../app/hooks";
import { logout } from "../app/authSlice";
import { useLogoutMutation } from "../app/authApi";

interface NavLink {
  name: string;
  path: string;
  icon?: React.ReactNode;
  onClick?: () => void;
}

interface HeaderProps {
  brandName?: string;
  navLinks?: NavLink[];
  logoUrl?: string;
}

const Header: React.FC<HeaderProps> = ({
  brandName = "TiCQet",
  navLinks = [
    { name: "Events", path: "/events" },
    { name: "My Tickets", path: "/tickets" },
    { name: "Discover", path: "/discover" },
    { name: "Contact us", path: "/contact" },
  ],
  logoUrl = "/mnt/data/41a11ca4-c39e-4a32-b61e-49beee6a126d.png",
}) => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const chevronRef = useRef<HTMLButtonElement | null>(null);
  const hamburgerRef = useRef<HTMLButtonElement | null>(null);

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const [logoutMutation] = useLogoutMutation();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      const target = e.target as Node | null;
      if (
        mobileOpen &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(target) &&
        hamburgerRef.current &&
        !hamburgerRef.current.contains(target)
      ) {
        setMobileOpen(false);
      }

      if (
        dropdownOpen &&
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        chevronRef.current &&
        !chevronRef.current.contains(target)
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
  

  const handleNavClick = (link: NavLink) => {
    if (link.onClick) link.onClick();
    else if (link.path) navigate(link.path);
    setMobileOpen(false);
  };

  const handleAvatarClick = () => {
    if (isLoggedIn) {
      navigate("/logged-in-profile");
    } else {
      navigate("/profile");
    }
    setMobileOpen(false);
  };

  const handleSignOut = async () => {
    try {
      await logoutMutation().unwrap();
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      dispatch(logout());
      setDropdownOpen(false);
      navigate("/");
    }
  };

  const getInitials = (name?: string) => {
    if (!name) return "U";
    const parts = name.trim().split(" ").filter(Boolean);
    const initials =
      parts.length === 1 ? parts[0][0] : `${parts[0][0]}${parts[parts.length - 1][0]}`;
    return initials.toUpperCase();
  };

  const displayName = user?.fullName || user?.email || "User";

  return (
    <header className="bg-[#fff8fb] border-b border-[#f0ebf0] sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* LEFT: logo / brand */}
          <div
            className="flex items-center gap-3 cursor-pointer"
            onClick={() => navigate("/")}
            aria-label="Home"
          >
            {logoUrl ? (
              <img src={logoUrl} alt={brandName} className="h-18 w-auto" />
            ) : (
              <div className="flex items-center gap-2">
                <div className="grid grid-cols-3 gap-0.5">
                  <div className="w-3 h-3 bg-red-500 rounded-sm" />
                  <div className="w-3 h-3 bg-yellow-400 rounded-sm" />
                  <div className="w-3 h-3 bg-green-400 rounded-sm" />
                  <div className="w-3 h-3 bg-blue-500 rounded-sm" />
                  <div className="w-3 h-3 bg-indigo-400 rounded-sm" />
                  <div className="w-3 h-3 bg-pink-400 rounded-sm" />
                </div>
                <span className="text-xl font-semibold text-gray-800 ml-2">{brandName}</span>
              </div>
            )}
          </div>

          {/* CENTER: nav (desktop) */}
          <nav className="hidden lg:flex lg:flex-1 lg:justify-center">
            <ul className="flex space-x-6">
              {navLinks.map((link) => (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link)}
                    className="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 focus:outline-none"
                    title={link.name}
                  >
                    {link.icon && <span className="text-lg">{link.icon}</span>}
                    <span>{link.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          {/* RIGHT: actions */}
          <div className="flex items-center gap-4 justify-end">
            <button
              className="p-1 text-gray-700 hover:text-blue-600 focus:outline-none"
              title="Notifications"
              aria-label="Notifications"
            >
              <IoIosNotifications className="w-7 h-7" />
            </button>

            {/* User icon */}
            <button
              onClick={handleAvatarClick}
              className="p-1 text-gray-700 hover:text-blue-600 focus:outline-none"
              title={isLoggedIn ? `Go to profile (${displayName})` : "Go to profile"}
              aria-label="User profile"
            >
              <FaUser className="w-7 h-7" />
            </button>

            {/* Sign in button - hidden when logged in */}
            {!isLoggedIn && (
              <Link to="/signIn">
                <button className="hidden sm:inline-flex items-center px-4 sm:px-8 py-2 rounded-full bg-blue-600 text-white text-sm sm:text-lg font-semibold hover:bg-blue-700 focus:outline-none">
                  Sign in
                </button>
              </Link>
            )}

            {/* Hamburger for mobile */}
            <div className="lg:hidden">
              <button
                ref={hamburgerRef}
                onClick={toggleMobile}
                aria-controls="mobile-menu"
                aria-expanded={mobileOpen}
                className="p-2 rounded-md text-gray-700 hover:text-gray-900 focus:outline-none"
              >
                <span className="sr-only">Open menu</span>
                {mobileOpen ? (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg className="h-6 w-6" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* MOBILE MENU */}
        {mobileOpen && (
          <div ref={mobileMenuRef} id="mobile-menu" className="lg:hidden">
            <div className="pt-3 pb-4 space-y-1 bg-white">
              {navLinks.map((link) => (
                <button
                  key={link.name}
                  onClick={() => handleNavClick(link)}
                  className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50"
                >
                  {link.name}
                </button>
              ))}

              {/* Sign in button - only shown when logged out */}
              {!isLoggedIn && (
                <Link to="/signIn" onClick={() => setMobileOpen(false)}>
                  <button className="w-full text-left px-4 py-2 text-base font-medium bg-blue-600 text-white rounded-md">
                    Sign in
                  </button>
                </Link>
              )}

              {/* Profile section - only shown when logged in */}
              {isLoggedIn && (
                <div className="border-t border-gray-200 mt-2 pt-2 px-4">
                  <div className="text-sm text-gray-800">
                    <div className="font-medium">{displayName}</div>
                    {user?.email && <div className="text-xs text-gray-500">{user.email}</div>}
                  </div>

                  <div className="mt-2 space-y-1">
                    <Link
                      to="/logged-in-profile"
                      onClick={() => setMobileOpen(false)}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      Profile
                    </Link>

                    <button
                      onClick={() => {
                        setMobileOpen(false);
                        handleSignOut();
                      }}
                      className="block w-full text-left px-4 py-2 text-base font-medium text-gray-700 hover:bg-gray-50 rounded-md"
                    >
                      Sign out
                    </button>
                  </div>
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