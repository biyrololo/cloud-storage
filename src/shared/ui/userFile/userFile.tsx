"use client";

import { Box, ListItem, ListItemButton, ListItemIcon, ListItemText, Tooltip, Typography, IconButton } from "@mui/material";
import { UserFileIcon } from "../userFileIcon";
import { formatSize } from "@/shared/lib/formatSize";
import { useRouter } from "next/navigation";
import { FileTree } from "@/shared/lib/fileTree";
import LinkIcon from '@mui/icons-material/Link';

export function UserFile({file, selected, onSelect}: {file: FileTree, selected: boolean, onSelect: (file: FileTree) => void}){
    const router = useRouter();
    const handleClick = () => {
        if(file.type === 'folder'){
            router.push(`/storage?d=${file.id}`);
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/storage?s=${file.id}&d=${file.id}`);
    }

    return (
        <ListItem
            disablePadding
            secondaryAction={
                <Box display="flex" alignItems="center" gap={1}>
                    {
                        file.type === 'file' && (
                            <Typography variant="body2" color="text.secondary">
                                {formatSize(file.size)}
                            </Typography>
                        )
                    }
                    {
                        (file.accessUsersRead.length > 1 || file.accessUsersRead.length === 0) && (
                            <Tooltip title="Copy link">
                                <IconButton onClick={handleCopyLink}>
                                    <LinkIcon />
                                </IconButton>
                            </Tooltip>
                        )
                    }
                </Box>
            }
        >
            <ListItemButton dense onClick={handleClick}
                selected={selected}
            >
                <ListItemIcon
                    onClick={e => {
                        e.stopPropagation();
                        onSelect(file);
                    }}
                >
                    <UserFileIcon type={file.type} name={file.name} />
                </ListItemIcon>
                <ListItemText primary={file.name} />
            </ListItemButton>
        </ListItem>
    )
}