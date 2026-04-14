import "react-toastify/dist/ReactToastify.css";
import { Bounce, ToastContainer } from "react-toastify";
import { useSelector } from "react-redux";

const AppToastContainer = () => {
  const isDarkMode = useSelector((state) => state.darkMode.isDarkMode);

  return (
    <ToastContainer
      position="bottom-right"
      autoClose={5000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme={isDarkMode ? "dark" : "light"}
      transition={Bounce}
    />
  );
};

export default AppToastContainer;
