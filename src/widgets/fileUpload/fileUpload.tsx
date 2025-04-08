"use client";

import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import { uploadFile } from "@/entities/file";
import { useTypedSelector } from "@/shared/lib/store";
import { fileActions } from "@/entities/file/model/slice";
import { useTypedDispatch } from "@/shared/lib/store";

export function FileUpload({onClose}: {onClose: () => void}){
    const [pending, setPending] = useState(false);
    const currentDir = useTypedSelector(state => state.file.currentDir);
    const dispatch = useTypedDispatch();
    const handleChange = async (file: File) => {
        if(!currentDir){
            return;
        }
        try {
            setPending(true);
            const response = await uploadFile({
                file,
                parentId: currentDir.id
            });
            console.log(response);

            if('error' in response){
                console.error(response.error);
            } else {
                dispatch(fileActions.addInTree({
                    ...response,
                    children: []
                }));
                onClose();
            }
        } catch (error) {
            console.error(error);
        } finally {
            setPending(false);
        }
    }

    return (
        <FileUploader
            handleChange={handleChange}
            name="file"
            disabled={pending}  
        />
    )
}