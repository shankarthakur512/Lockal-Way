import { useEffect } from "react";
import { useSelector } from "react-redux";

const ThemeController = () => {
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", isDarkMode);
    document.body.classList.toggle("dark", isDarkMode);
  }, [isDarkMode]);

  return null;
};

export default ThemeController;
