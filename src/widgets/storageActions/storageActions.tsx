import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import { Box, FormControlLabel, Checkbox, Tooltip, IconButton } from "@mui/material";
import { fileActions } from "@/entities/file";
import { Download } from "@mui/icons-material";
import { downloadFiles, makeAccessToFilePublic, deleteFileAction } from "@/entities/file";
import ShareIcon from '@mui/icons-material/Share';
import DeleteIcon from '@mui/icons-material/Delete';

export function StorageActions(){
    const selectedFiles = useTypedSelector(state => state.file.selectedFiles);
    const currentDir = useTypedSelector(state => state.file.currentDir);
    const currentFiles = currentDir?.children.map(file => file.id) || [];
    const dispatch = useTypedDispatch();

    const handleChange = () => {
        if(selectedFiles.length === currentDir?.children.length){
            dispatch(fileActions.clearSelectedFiles());
            return;
        }
        dispatch(fileActions.setSelectedFiles(currentFiles));
    }

    const handleDownload = async () => {
        if(selectedFiles.length === 0 || !currentDir){
            return;
        }
        const trees = currentDir.children.filter(file => selectedFiles.includes(file.id));
        const zipBuffer = await downloadFiles(trees) as Buffer;
        const url = window.URL.createObjectURL(new Blob([zipBuffer], {type: 'application/zip'}));
        const link = document.createElement('a');
        link.href = url;
        link.download = 'files.zip';
        link.click();
        window.URL.revokeObjectURL(url);
    }

    const recursiveShare = async (fileId: string) => {
        const metadata = await makeAccessToFilePublic(fileId, 'read');
        if('error' in metadata){
            console.error(metadata.error);
            return;
        }
        if(metadata.type === 'file'){
            return;
        }
        for(const child of metadata.children){
            await recursiveShare(child);
        }
    }
    const handleShare = async () => {
        if(selectedFiles.length === 0 || !currentDir){
            return;
        }

        for(const file of selectedFiles){
            await recursiveShare(file);
        }
    }

    const handleDelete = async () => {
        if(selectedFiles.length === 0 || !currentDir){
            return;
        }
        for(const file of selectedFiles){
            await deleteFileAction(file);
        }
        console.log('deleted');
    }

    const isActionsDisabled = selectedFiles.length === 0 || !currentDir;

    return (
        <Box display="flex" alignItems="center" gap={1}>
            <FormControlLabel
                control={
                    <Checkbox
                        checked={selectedFiles.length > 0}
                        indeterminate={selectedFiles.length > 0 && selectedFiles.length < currentFiles.length}
                        onChange={handleChange}
                    />
                }
                label={`Selected ${selectedFiles.length} of ${currentFiles.length}`}
            />
            <Tooltip title="Download">
                <IconButton onClick={handleDownload} disabled={isActionsDisabled}>
                    <Download />
                </IconButton>
            </Tooltip>
            <Tooltip title="Make public">
                <IconButton onClick={handleShare} disabled={isActionsDisabled}>
                    <ShareIcon />
                </IconButton>
            </Tooltip>
            <Tooltip title="Delete">
                <IconButton onClick={handleDelete} disabled={isActionsDisabled}>
                    <DeleteIcon />
                </IconButton>
            </Tooltip>
        </Box>
    )
}