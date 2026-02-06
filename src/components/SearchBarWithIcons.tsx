import React from "react";
import {Search, User,MoreHorizontal,Globe,SlidersHorizontal} from "lucide-react";
import { FaGuitar } from "react-icons/fa";
import { FaBasketball } from "react-icons/fa6";
import { TbUserScreen } from "react-icons/tb";
import { BiMoviePlay } from "react-icons/bi";
import { FaGlassCheers } from "react-icons/fa";




const SearchBarWithIcons: React.FC = () => {
  return (
    <div className="flex items-center justify-between bg-gray-100 p-2 sm:p-3 lg:p-4 rounded-full shadow-sm w-full max-w-6xl mx-auto">
      {/* Search Bar */}
      <div className="flex items-center bg-white rounded-full px-3 py-2 sm:px-4 sm:py-3 flex-1 max-w-md lg:max-w-lg">
        <Search className="text-gray-500 w-4 h-4 sm:w-5 sm:h-5 mr-2" />
        <input
          type="text"
          placeholder="Search event..."
          className="flex-1 text-sm sm:text-base outline-none bg-transparent placeholder-gray-400"
        />
      </div>

      {/* Icons for large screens */}
      <div className="hidden lg:flex items-center space-x-3 xl:space-x-4 ml-4 text-blue-600">
        < FaGuitar  className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
        <FaBasketball className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
        <TbUserScreen className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
        <BiMoviePlay className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
        <FaGlassCheers className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
        <MoreHorizontal className="w-5 h-5 xl:w-6 xl:h-6 cursor-pointer hover:text-blue-800" />
      </div>

      {/* Reduced icons for medium screens */}
      <div className="hidden md:flex lg:hidden items-center space-x-2 ml-3 text-blue-600">
        <Search className="w-5 h-5 cursor-pointer hover:text-blue-800" />
        <Globe className="w-5 h-5 cursor-pointer hover:text-blue-800" />
        <User className="w-5 h-5 cursor-pointer hover:text-blue-800" />
        <MoreHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-800" />
      </div>

      {/* Filter/Settings Icon for small screens */}
      <div className="md:hidden ml-3 text-blue-600">
        <SlidersHorizontal className="w-5 h-5 cursor-pointer hover:text-blue-800" />
      </div>
    </div>
  );
};

export default SearchBarWithIcons;
