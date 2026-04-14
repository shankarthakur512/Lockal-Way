import { getErrorMessage } from "../../shared/lib/error";
import { toastService } from "../../shared/services/toast";

const ErrorHandler = {
    showError: (message, duration = 5000) => {
        toastService.error(message, { autoClose: duration });
    },

    showSuccess: (message, duration = 5000) => {
        toastService.success(message, { autoClose: duration });
    },

    showWarning: (message, duration = 5000) => {
        toastService.warning(message, { autoClose: duration });
    },

    showInfo: (message, duration = 5000) => {
        toastService.info(message, { autoClose: duration });
    },

    handleApiError: (error) => {
        const message = getErrorMessage(error);
        ErrorHandler.showError(message);
    },
};

export default ErrorHandler;
