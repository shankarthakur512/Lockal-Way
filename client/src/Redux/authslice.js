import { createSlice } from "@reduxjs/toolkit";
import { createLogger } from "../shared/lib/logger";

const authLogger = createLogger("auth-slice");

const initialState = {
    status : false,
    userData: null,
    accessToken: null,
}

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        login: (state, action) => {
            authLogger.debug("login", action.payload.userData);
            state.status = true;
            state.userData = action.payload.userData;
            state.accessToken = action.payload.accessToken || null;
        },
        logout: (state) => {
            authLogger.debug("logout");
            state.status = false;
            state.userData = null;
            state.accessToken = null;
        }
     }
})

export const {login, logout} = authSlice.actions;

export default authSlice.reducer;
