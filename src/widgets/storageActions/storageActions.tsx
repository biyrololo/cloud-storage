"use client"

import { Box, FormControlLabel, Checkbox, Tooltip, IconButton, styled } from "@mui/material";
import { Download } from "@mui/icons-material";
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';
import { Content } from "@/entities/file/model/content";
import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import { fileActions } from "@/entities/file/model/slice";
import { downloadFiles } from "@/shared/lib/actions/storage/downloadFile";
import { useEffect, useState } from "react";
import { deleteFile } from "@/shared/lib/actions/storage/deleteFile";
import { Folder, File as FileModel } from "@prisma/client";
import { useRouter } from "next/navigation";
import { contentDTO } from "@/entities/file/model/dto";
import DoDisturbIcon from '@mui/icons-material/DoDisturb';
import { downloadSingleFile } from "@/shared/lib/actions/storage/downloadSingleFile";
import { changeFoldersAccess } from "@/shared/lib/actions/storage/changeAccess";

const StyledIconButton = styled(IconButton)(({ theme }) => ({
    color: theme.palette.primary.main,
}));

export interface StorageActionsProps {
    allFiles: Content[];
    hasWriteAccess?: boolean
}

enum PENDING {
    NONE = -1,
    DOWNLOAD = 0,
    DELETE = 1,
    SHARE = 2,
    UNSHARE = 3
}

export function StorageActions({allFiles, hasWriteAccess=true}: StorageActionsProps){
    const [pending, setPending] = useState<PENDING>(PENDING.NONE);
    const selectedFiles = useTypedSelector(state => state.file.selectedFiles);
    const dispatch = useTypedDispatch();
    const router = useRouter();
    const handleDownload = async () => {
        if(!selectedFiles.length){
            return;
        }
        setPending(PENDING.DOWNLOAD);
        if(selectedFiles.length === 1 && 's3Key' in selectedFiles[0]){
            await downloadFile();
        } else {
            await downloadArchive();
        }
        setPending(PENDING.NONE);
    }

    const downloadFile = async () => {
        const data = await downloadSingleFile(selectedFiles[0] as FileModel);
        if('error' in data){
            return;
        }
        const blob = new Blob([data]);
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = selectedFiles[0].name;
        a.click();
        URL.revokeObjectURL(url);
    }

    const downloadArchive = async () => {
        const data = await downloadFiles(selectedFiles as Content[]);
        const zipBuffer = data as Buffer;
        const url = URL.createObjectURL(new Blob([zipBuffer], {type: 'application/zip'}));
        const a = document.createElement('a');
        a.href = url;
        const name = selectedFiles.length === 1 ? selectedFiles[0].name : selectedFiles[0].path.split('/').slice(-1);
        a.download = `${name}.zip`;
        a.click();
        URL.revokeObjectURL(url);
    }

    const handleDelete = async () => {
        if(!selectedFiles.length){
            return;
        }
        setPending(PENDING.DELETE);
        for(const file of allFiles.filter(f => selectedFiles.some(t => t.id === f.id))){
            await deleteFile(file as Content);
        }
        setPending(PENDING.NONE);
        router.refresh();
    }

    const handleShare = async () => {
        setPending(PENDING.SHARE);
        const selectedFiles_ = selectedFiles.filter(file => !('s3Key' in file)) as Folder[];;
        const folders = allFiles.filter(f => selectedFiles_.some(t => t.id === f.id));
        if(!folders.length){
            return;
        }
        await changeFoldersAccess(folders, 'public', 'read');
        setPending(PENDING.NONE);
        router.refresh();
    }

    const handleUnshare = async () => {
        setPending(PENDING.UNSHARE);
        const selectedFiles_ = selectedFiles.filter(file => !('s3Key' in file)) as Folder[];;
        const folders = allFiles.filter(f => selectedFiles_.some(t => t.id === f.id));
        if(!folders.length){
            return;
        }
        await changeFoldersAccess(folders, 'private', 'read');
        setPending(PENDING.NONE);
        router.refresh();
    }

    const handleChangeSelectedFiles = ()=>{
        if(selectedFiles.length === allFiles.length){
            dispatch(fileActions.clearSelectedFiles());
        } else {
            dispatch(fileActions.setSelectedFiles(allFiles.map(contentDTO)));
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
                <StyledIconButton onClick={handleDownload} loading={pending === PENDING.DOWNLOAD} disabled={!selectedFiles.length || (pending !== PENDING.NONE && pending !== PENDING.DOWNLOAD)}>
                    <Download />
                </StyledIconButton>
            </Tooltip>
            {
                hasWriteAccess && (
                    <>
                        <Tooltip title="Make public">
                            <StyledIconButton onClick={handleShare} loading={pending === PENDING.SHARE} disabled={!selectedFiles.length || (pending !== PENDING.NONE && pending !== PENDING.SHARE)}>
                                <ShareIcon />
                            </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Make private">
                            <StyledIconButton onClick={handleUnshare} loading={pending === PENDING.UNSHARE} disabled={!selectedFiles.length || (pending !== PENDING.NONE && pending !== PENDING.UNSHARE)}>
                                <DoDisturbIcon />
                            </StyledIconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                            <StyledIconButton onClick={handleDelete} loading={pending === PENDING.DELETE} disabled={!selectedFiles.length || (pending !== PENDING.NONE && pending !== PENDING.DELETE)}>
                                <DeleteIcon />
                            </StyledIconButton>
                        </Tooltip>
                    </>
                )
            }
        </Box>
    )
}