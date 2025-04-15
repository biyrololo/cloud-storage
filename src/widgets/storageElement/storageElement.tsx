'use client';

import { Avatar, ListItem, ListItemAvatar, ListItemButton, ListItemText, Typography, Tooltip, IconButton } from "@mui/material";
import { File as FileModel, Folder, Folder as FolderModel } from "@prisma/client"
import { UserFileIcon } from "@/shared/ui/userFileIcon";
import { formatSize } from "@/shared/lib/size/getSize";
import { calculatePath } from "@/shared/lib/calculatePath";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { fileActions } from "@/entities/file/model/slice";
import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import LinkIcon from '@mui/icons-material/Link';
import { getPath } from "@/shared/lib/getPath";

export type StorageElementProps = {
    item: FileModel | FolderModel;
}

export function StorageElement({ item }: StorageElementProps) {
    const selectedFiles = useTypedSelector(state => state.file.selectedFiles);
    const dispatch = useTypedDispatch();
    const params = useParams();
    const router = useRouter();
    const userId = params.userId as string;
    const isFolder = 's3Key' in item ? false : true;

    const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
        switch(e.detail){
            case 1:
                dispatch(fileActions.selectFile(item));
                break;
            case 2:
                if(isFolder){
                    router.push(calculatePath(`${item.path}/${item.name}`, userId));
                }
                break;
        }
    }

    const handleCopyLink = () => {
        navigator.clipboard.writeText(window.location.origin + calculatePath(getPath(item.path, item.name), (item as Folder).ownerId.toString()));
    }

    return (
        <ListItem
            disablePadding
            secondaryAction={
                'size' in item ? (
                    <Typography variant="body2">
                        {formatSize(Number(item.size))}
                    </Typography>
                ) : item.readAccess.includes('all') && (
                    <Tooltip title="Copy link">
                        <IconButton onClick={handleCopyLink}>
                            <LinkIcon />
                        </IconButton>
                    </Tooltip>
                )
            }
        >
            <ListItemButton
                selected={selectedFiles.some(file => file.id === item.id)}
                onClick={handleClick}
                dense
            >
                <ListItemAvatar>
                    <Avatar>
                        <UserFileIcon filename={item.name} isFolder={isFolder} />
                    </Avatar>
                </ListItemAvatar>
                <ListItemText 
                    primary={item.name} 
                    secondary={!isFolder ? item.updatedAt.toLocaleDateString() : ''} 
                />
            </ListItemButton>
        </ListItem>
    )
}