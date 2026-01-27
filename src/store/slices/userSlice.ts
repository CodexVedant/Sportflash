import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface UserState {
    viewingProfileId: string | null;
}

const initialState: UserState = {
    viewingProfileId: null,
};

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setViewingProfileId: (state, action: PayloadAction<string | null>) => {
            state.viewingProfileId = action.payload;
        },
    },
});

export const { setViewingProfileId } = userSlice.actions;
export default userSlice.reducer;
