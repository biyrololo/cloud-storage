import { FileTree, findInTree, PathElement } from "@/shared/lib/fileTree";
import { createSlice } from "@reduxjs/toolkit";

interface FileState {
    tree: FileTree | null;
    loaded: boolean;
    error: string | null;
    selectedFiles: string[];    
    currentDir: FileTree | null;
    currentPath: PathElement[];
}

const initialState: FileState = {
    tree: null,
    loaded: false,
    error: null,
    selectedFiles: [],
    currentDir: null,
    currentPath: [],
}

function updateTree(tree: FileTree, parentId: string, newFile: FileTree): FileTree {
    if (tree.id === parentId) {
        if (tree.type === 'folder') {
            tree.children.push(newFile);
            return tree;
            // return {
            //     ...tree,
            //     children: [...tree.children, newFile]
            // };
        }
        return tree;
    }

    if (tree.type === 'folder') {
        tree.children = tree.children.map(child => updateTree(child, parentId, newFile));
        return tree;
        // return {
        //     ...tree,
        //     children: tree.children.map(child => updateTree(child, parentId, newFile))
        // };
    }
    return tree;
}

function editTree(tree: FileTree, parentId: string, newFile: FileTree): FileTree {
    if (tree.id === parentId) {
        if (tree.type === 'folder') {
            tree.children = tree.children.map(child => {
                if(child.id === newFile.id) {
                    return newFile;
                }
                return child;
            })
        }
        return tree;
    }

    if (tree.type === 'folder') {
        tree.children = tree.children.map(child => editTree(child, parentId, newFile));
        return tree;
        // return {
        //     ...tree,
        //     children: tree.children.map(child => updateTree(child, parentId, newFile))
        // };
    }
    return tree;
}
function deleteFromTree(tree: FileTree, parentId: string, id: string): FileTree {
    if (tree.id === parentId) {
        if(tree.type === 'folder') {
            tree.children = tree.children.filter(child => child.id !== id);
        }
        return tree;
    }
    if(tree.type === 'folder') {
        tree.children = tree.children.map(child => deleteFromTree(child, parentId, id));
        return tree;
    }
    return tree;
}

export const fileSlice = createSlice({
    name: 'file',
    initialState,
    reducers: {
        setTree: (state, action) => {
            state.tree = action.payload;
            state.loaded = true;
        },
        setError: (state, action) => {
            state.error = action.payload;
        },
        addInTree: (state, action) => {
            if (!state.tree) {
                return;
            }
            state.tree = updateTree(state.tree, action.payload.parentId, action.payload);
        },
        editInTree: (state, action) => {
            if (!state.tree) {
                return;
            }
            state.tree = editTree(state.tree, action.payload.parentId, action.payload);
        },
        deleteFromTree: (state, action) => {
            if (!state.tree) {
                return;
            }
            state.tree = deleteFromTree(state.tree, action.payload.parentId, action.payload.id);
        },
        updateCurrentDir: (state) => {
            if(state.currentDir && state.tree) {
                const newCurrentDir = findInTree(state.tree, state.currentDir.id);
                if(newCurrentDir.file) {
                    state.currentDir = newCurrentDir.file;
                    state.currentPath = newCurrentDir.path;
                }
            }
        },
        addSelectedFile: (state, action) => {
            state.selectedFiles.push(action.payload);
        },
        removeSelectedFile: (state, action) => {
            state.selectedFiles = state.selectedFiles.filter(file => file !== action.payload);
        },
        setSelectedFiles: (state, action) => {
            state.selectedFiles = action.payload;
        },
        clearSelectedFiles: (state) => {
            state.selectedFiles = [];
        },
        changeDirectory: (state, action) => {
            state.currentPath = action.payload.path;
            state.currentDir = action.payload.dir;
        }
    },
})

export const fileActions = fileSlice.actions;
export const fileReducer = fileSlice.reducer;

