import React from 'react';
import { FaUser, FaCog, FaSignOutAlt } from 'react-icons/fa';
import ProfileImage from '../../assets/profile.jpg'; // Replace with your profile image path

const GuideSlider = ({ sliderOpen, setSliderOpen }) => {
  return (
    <div className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-800 transition-transform transform ${sliderOpen ? 'translate-x-0' : '-translate-x-full'} z-40 shadow-lg`}>
      {/* Close Button */}
      <div className="flex justify-between p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold dark:text-white">Guide Menu</h2>
        <button onClick={() => setSliderOpen(false)} className="text-gray-600 dark:text-gray-300">
          X
        </button>
      </div>

      {/* Profile Section */}
      <div className="p-4 text-center border-b dark:border-gray-700">
        <img src={ProfileImage} alt="Profile" className="w-24 h-24 rounded-full mx-auto mb-3" />
        <h3 className="text-lg font-semibold dark:text-white">John Doe</h3>
        <p className="text-gray-500 dark:text-gray-400">Local Guide</p>
      </div>

      {/* Menu Options */}
      <div className="p-4">
        <div className="flex items-center mb-4 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
          <FaUser className="mr-3" />
          <span>Account</span>
        </div>
        <div className="flex items-center mb-4 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
          <FaCog className="mr-3" />
          <span>Settings</span>
        </div>
        <div className="flex items-center mb-4 cursor-pointer text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary">
          <FaSignOutAlt className="mr-3" />
          <span>Logout</span>
        </div>
      </div>
    </div>
  );
};

export default GuideSlider;
