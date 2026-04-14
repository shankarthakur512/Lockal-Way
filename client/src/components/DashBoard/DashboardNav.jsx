import React, { useState } from 'react';
import Logo from "../../assets/lokalway-logo.svg";
import { FaBars, FaUser, FaCog, FaSignOutAlt, FaBell } from 'react-icons/fa';
import DarkModeToggle from '../others/DarkMode';
import { NavLink } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { getGuideEntryRoute } from '../../shared/constants/routes';

const DashboardNav = ({ notify, setNotify }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const isLoggedIn = useSelector((state) => Boolean(state.auth.status));

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  const NavbarLinks = [
    { name: "Home", link: "/" },
    { name: "Career", link: "/about" },
    { name: "Blogs", link: "/blogs" },
    { name: "Guide Home", link: getGuideEntryRoute(isLoggedIn) },
  ];

  return (
    <div className="relative flex justify-between items-center p-4 bg-white dark:bg-gray-800 transition-colors duration-300">
      <div className="flex items-center gap-4 font-bold text-2xl">
        <img src={Logo} alt="Lockal Way" className="h-12 w-auto" />
      </div>
      <ul className="flex items-center gap-7">
        {NavbarLinks.map((link) => (
          <li key={link.name} className="py-4">
            <NavLink
              to={link.link}
              className={({ isActive }) =>
                isActive ? 'text-primary' : 'text-black dark:text-white'
              }
            >
              {link.name}
            </NavLink>
          </li>
        ))}
      </ul>

      
      <div className="flex items-center gap-4">
        <div className="cursor-pointer p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700">
          <FaBell size={20} onClick={() => { setNotify(!notify); }} />
        </div>

       
        <DarkModeToggle />

        
        <div className="cursor-pointer p-2 border rounded-full hover:bg-gray-100 dark:hover:bg-gray-700" onClick={toggleMenu}>
          <FaBars size={20} />
        </div>
      </div>

      {/* Dropdown Menu */}
      {menuOpen && (
        <div className="absolute right-0 top-16 bg-white dark:bg-gray-800 text-black dark:text-white w-48 shadow-md rounded-md">
          <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <FaUser className="mr-2" /> Account
          </div>
          <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <FaCog className="mr-2" /> Settings
          </div>
          <div className="flex items-center p-4 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
            <FaSignOutAlt className="mr-2" /> Sign Out
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardNav;
