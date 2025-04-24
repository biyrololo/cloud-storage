import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { FileUpload } from "../fileUpload/fileUpload";
import { DialogProps } from "@/shared/lib/dialog/dialogProps";

export function FolderUploadDialog({ open, onClose }: DialogProps){
    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Upload Folders</DialogTitle>
                <DialogContent>
                    <FileUpload onClose={onClose} folder/>
                </DialogContent>
            </Dialog>
        </>
    )
}