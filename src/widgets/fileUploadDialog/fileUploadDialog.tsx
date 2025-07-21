import { Dialog, DialogContent, DialogTitle } from "@mui/material";

import { DialogProps } from "@/shared/ui/dialog/dialogProps";
import { FileUpload } from "../fileUpload/fileUpload";

export function FileUploadDialog({ open, onClose }: DialogProps){
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