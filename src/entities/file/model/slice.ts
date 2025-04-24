import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Content } from "./content";

export type SerializedContent = Omit<Content, 'createdAt' | 'updatedAt' | 'size'>

interface FileState {
    selectedFiles: SerializedContent[]
}

const initialState: FileState = {
    selectedFiles: []
}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        selectFile: (state, action: PayloadAction<SerializedContent>) => {
            if(state.selectedFiles.find(file => file.id === action.payload.id)){
                state.selectedFiles = state.selectedFiles.filter(file => file.id !== action.payload.id);
            } else {
                state.selectedFiles.push(action.payload);
            }
        },
        setSelectedFiles: (state, action: PayloadAction<SerializedContent[]>) => {
            state.selectedFiles = action.payload;
        },
        clearSelectedFiles: (state) => {
            state.selectedFiles = [];
        }
    },
})

export const fileActions = fileSlice.actions;
export const fileReducer = fileSlice.reducer;

