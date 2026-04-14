import { Bounce, toast } from "react-toastify";

const defaultOptions = {
  position: "bottom-right",
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  transition: Bounce,
};

export const notify = ({ type = "default", message, options = {} }) => {
  if (!message) {
    return;
  }

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  if (typeof toast[type] === "function") {
    toast[type](message, mergedOptions);
    return;
  }

  toast(message, mergedOptions);
};

export const toastService = {
  show: notify,
  success: (message, options) => notify({ type: "success", message, options }),
  error: (message, options) => notify({ type: "error", message, options }),
  warning: (message, options) => notify({ type: "warning", message, options }),
  info: (message, options) => notify({ type: "info", message, options }),
};
