"use client";

import { UserFile } from "@/shared/ui/userFile";
import { List } from "@mui/material";
import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import { FileTree } from "@/shared/lib/fileTree";
import { StorageText } from "@/shared/ui/storageText";
import { fileActions } from "@/entities/file";

export function FilesList(){
    const currentDir = useTypedSelector(state => state.file.currentDir);
    const selectedFiles = useTypedSelector(state => state.file.selectedFiles);
    const dispatch = useTypedDispatch();

    const onFileSelect = (file: FileTree) => {
        if(selectedFiles.includes(file.id)){
            dispatch(fileActions.removeSelectedFile(file.id));
        } else {
            dispatch(fileActions.addSelectedFile(file.id));
        }
    }

    if(!currentDir){
        return (
            <StorageText text="No dir found" />
        )
    }

    return (
        <List>
            {
                currentDir.children.length === 0 ? (
                    <StorageText text="No files found" />
                ) : (
                    currentDir.children.map((file) => (
                        <UserFile 
                        key={file.id} file={file} 
                        selected={selectedFiles.includes(file.id)}
                        onSelect={onFileSelect}
                        />
                    ))
                )
            }
        </List>
    )
}