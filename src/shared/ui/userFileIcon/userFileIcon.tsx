import FolderIcon from '@mui/icons-material/Folder';
import ImageIcon from '@mui/icons-material/Image';
import AudioFileIcon from '@mui/icons-material/AudioFile';
import VideoFileIcon from '@mui/icons-material/VideoFile';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';

export type UserFileIconProps = {
    filename: string;
    isFolder?: boolean;
    className?: string;
}

const icons = {
    'png': ImageIcon,
    'jpg': ImageIcon,
    'jpeg': ImageIcon,
    'gif': ImageIcon,
    'bmp': ImageIcon,
    'ico': ImageIcon,
    'webp': ImageIcon,
    'svg': ImageIcon,
    'tiff': ImageIcon,
    'mp3': AudioFileIcon,
    'wav': AudioFileIcon,
    'mp4': VideoFileIcon,
    'avi': VideoFileIcon,
    'mov': VideoFileIcon,
    'wmv': VideoFileIcon    
}

export function UserFileIcon(props: UserFileIconProps){
    if(props.isFolder){
        return <FolderIcon className={props.className} />;
    }

    const extension = props.filename.split('.').pop();

    if(extension && extension in icons){
        const Icon = icons[extension as keyof typeof icons];
        return <Icon className={props.className} />;
    }

    return <InsertDriveFileIcon className={props.className} />;
}