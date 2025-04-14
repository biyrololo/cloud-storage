import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Content } from "./content";

type SerializedContent = Omit<Content, 'createdAt' | 'updatedAt'>

interface FileState {
    selectedFiles: SerializedContent[]
}

const initialState: FileState = {
    selectedFiles: []
}

function contentDTO(content: Content): SerializedContent{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {createdAt, updatedAt, ...dto} = content;
    return dto;
}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        selectFile: (state, action: PayloadAction<Content>) => {
            const dto = contentDTO(action.payload);
            if(state.selectedFiles.find(file => file.id === dto.id)){
                state.selectedFiles = state.selectedFiles.filter(file => file.id !== dto.id);
            } else {
                console.log(dto);
                state.selectedFiles.push(dto);
            }
        },
        setSelectedFiles: (state, action: PayloadAction<Content[]>) => {
            state.selectedFiles = action.payload.map(contentDTO);
        },
        clearSelectedFiles: (state) => {
            state.selectedFiles = [];
        }
    },
})

export const fileActions = fileSlice.actions;
export const fileReducer = fileSlice.reducer;

