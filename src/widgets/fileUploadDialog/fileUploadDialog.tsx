import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { FileUpload } from "../fileUpload/fileUpload";

interface FileUploadDialogProps {
    open: boolean;
    onClose: () => void;
}

export function FileUploadDialog({ open, onClose }: FileUploadDialogProps){

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Upload File</DialogTitle>
                <DialogContent>
                    <FileUpload onClose={onClose} />
                </DialogContent>
            </Dialog>
        </>
    )
}