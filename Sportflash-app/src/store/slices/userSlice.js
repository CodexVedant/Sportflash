import { createSlice } from '@reduxjs/toolkit';

const userSlice = createSlice({
    name: 'user',
    initialState: {
        viewingProfileId: null,
    },
    reducers: {
        setViewingProfileId: (state, action) => {
            state.viewingProfileId = action.payload;
        },
    },
});

export const { setViewingProfileId } = userSlice.actions;
export default userSlice.reducer;
