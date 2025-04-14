"use client"

import { Box, FormControlLabel, Checkbox, Tooltip, IconButton, styled } from "@mui/material";
import { Download } from "@mui/icons-material";
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { Content } from "@/entities/file/model/content";
import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import { fileActions } from "@/entities/file/model/slice";
import { downloadFiles } from "@/shared/lib/actions/storage/downloadFile";
import { useEffect } from "react";
import { deleteFile } from "@/shared/lib/actions/storage/deleteFile";
import { makeFoldersPublic } from "@/shared/lib/actions/storage/changeAccess";
import { Folder } from "@prisma/client";
import { useRouter } from "next/navigation";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

export interface StorageActionsProps {
    allFiles: Content[]
}

export function StorageActions({allFiles}: StorageActionsProps){
    const selectedFiles = useTypedSelector(state => state.file.selectedFiles);
    const dispatch = useTypedDispatch();
    const router = useRouter();
    const handleDownload = async () => {
        if(!selectedFiles.length){
            return;
        }
        const data = await downloadFiles(selectedFiles as Content[]);
        const zipBuffer = data as Buffer;
        const url = URL.createObjectURL(new Blob([zipBuffer], {type: 'application/zip'}));
        const a = document.createElement('a');
        a.href = url;
        a.download = `${selectedFiles[0].name}.zip`;
        a.click();
    }

    const handleDelete = async () => {
        if(!selectedFiles.length){
            return;
        }
        for(const file of selectedFiles){
            await deleteFile(file as Content);
        }
        router.refresh();
    }

    const handleShare = async () => {
        const folders = selectedFiles.filter(file => !('s3Key' in file)) as Folder[];
        if(!folders.length){
            return;
        }
        await makeFoldersPublic(folders, 'read');
        router.refresh();
    }

    const handleChangeSelectedFiles = ()=>{
        if(selectedFiles.length === allFiles.length){
            dispatch(fileActions.clearSelectedFiles());
        } else {
            dispatch(fileActions.setSelectedFiles(allFiles));
        }
    }

    useEffect(() => {
        dispatch(fileActions.clearSelectedFiles());
    }, [allFiles]);

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedFiles.length > 0}
                        indeterminate={selectedFiles.length > 0 && selectedFiles.length < allFiles.length}
                        onChange={handleChangeSelectedFiles}
                    />
                }
                label={<><span className="hidden sm:inline">Selected</span> {selectedFiles.length} of {allFiles.length}</>}
            />
            <Tooltip title="Download">
                <StyledIconButton onClick={handleDownload} >
                    <Download />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Make public">
                <StyledIconButton onClick={handleShare} >
                    <ShareIcon />
                </StyledIconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <StyledIconButton onClick={handleDelete} >
                    <DeleteIcon />
                </StyledIconButton>
            </Tooltip>
        </Box>
    )
}