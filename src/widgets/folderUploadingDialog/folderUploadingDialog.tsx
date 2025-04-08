import { Dialog, DialogTitle, DialogContent, TextField, Button, Typography } from "@mui/material";
import { createFolder } from "@/entities/file";
import { useTypedDispatch, useTypedSelector } from "@/shared/lib/store";
import { useState } from "react";
import { fileActions } from "@/entities/file/model/slice";

export interface FolderUploadingDialogProps {
    open: boolean;
    onClose: () => void;
}

export function FolderUploadingDialog({open, onClose}: FolderUploadingDialogProps){
    const currentDir = useTypedSelector(state => state.file.currentDir);
    const tree = useTypedSelector(state => state.file.tree);
    const dispatch = useTypedDispatch();
    const [error, setError] = useState('');
    
    async function handleSubmit(event: React.FormEvent<HTMLFormElement>){
        event.preventDefault();
        if(!tree || !currentDir){
            setError('Tree is not loaded');
            return;
        }

        const formData = new FormData(event.currentTarget);
        const name = formData.get('folderName');

        if(!name){
            setError('Name is required');
            return;
        }

        const folder = await createFolder({
            name: name as string,
            parentId: currentDir.id,
        });

        dispatch(fileActions.addInTree({
            ...folder,
            children: []
        }));
        onClose();
    }
    
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Upload Folder</DialogTitle>
                <DialogContent>
                    <form onSubmit={handleSubmit}>
                        <TextField
                            label="Folder Name"
                            name="folderName"
                            required
                            fullWidth
                        />
                        {
                            error && (
                                <Typography color="error">{error}</Typography>
                            )
                        }
                        <Button type="submit">Upload</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}