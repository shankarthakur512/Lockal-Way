import React from "react";
import { HiOutlineMoon, HiOutlineSun } from "react-icons/hi2";
import { useDispatch, useSelector } from "react-redux";
import { toggleDarkMode } from "../../Redux/Darkmode";

const DarkModeToggle = () => {
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);
  const dispatch = useDispatch();

  return (
    <button
      type="button"
      onClick={() => dispatch(toggleDarkMode())}
      className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-sand-dark bg-white text-forest shadow-sm transition hover:bg-sand dark:border-white/10 dark:bg-white/5 dark:text-sand dark:hover:bg-white/10"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
      title={isDarkMode ? "Light mode" : "Dark mode"}
    >
      {isDarkMode ? <HiOutlineSun size={20} /> : <HiOutlineMoon size={20} />}
    </button>
  );
};

export default DarkModeToggle;
