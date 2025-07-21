import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { DialogProps } from "@/shared/ui/dialog/dialogProps";
import { FileUpload } from "../fileUpload/fileUpload";

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