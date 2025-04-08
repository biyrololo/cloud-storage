import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

interface UserState {
    user: Omit<User, 'password'> | null;
    isAuth: boolean;
}

const initialState: UserState = {
    user: null,
    isAuth: false,
};

export const userSlice = createSlice({
    name: "user",
    initialState,
    reducers: {
        login: (state, action) => {
            state.user = action.payload;
            state.isAuth = true;
        },
        logout: (state) => {
            state.user = null;
            state.isAuth = false;
        },
    },
});

export const userActions = userSlice.actions;
export default userSlice.reducer;