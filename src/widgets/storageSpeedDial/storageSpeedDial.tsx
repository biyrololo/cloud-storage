"use client";

import { SpeedDial, SpeedDialAction } from "@mui/material";
import { FileUploadDialog } from "../fileUploadDialog";
import AddIcon from '@mui/icons-material/Add';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { useState } from "react";
import { FolderUploadingDialog } from "../folderUploadingDialog";
import CreateNewFolderIcon from '@mui/icons-material/CreateNewFolder';

export function StorageSpeedDial(){
    const [open, setOpen] = useState('');

    const handleClose = () => {
        setOpen('');
    }

    return (
        <>
            <SpeedDial ariaLabel="SpeedDial"
                icon={<AddIcon />}
                sx={{
                    position: 'absolute',
                    bottom: 16,
                    right: 16,
                }}
                direction="up"
            >
                <SpeedDialAction
                    icon={<CloudUploadIcon />}
                    slotProps={
                        {
                            tooltip: {
                                title: "Upload File"
                            }
                        }
                    }
                    onClick={() => setOpen('upload')}
                />
                <SpeedDialAction
                    icon={<CreateNewFolderIcon />}
                    slotProps={
                        {
                            tooltip: {
                                title: "Create Folder"
                            }
                        }
                    }
                    onClick={() => setOpen('folder')}
                />
            </SpeedDial>
            <FileUploadDialog open={open==='upload'} onClose={handleClose} />
            <FolderUploadingDialog open={open==='folder'} onClose={handleClose} />
        </>
    )
}