import { User } from "@prisma/client";
import { createSlice } from "@reduxjs/toolkit";

type SerializedUser = Omit<User, 'password' | 'maxSpace' | 'usedSpace'>;

interface UserState {
    user: SerializedUser | null;
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