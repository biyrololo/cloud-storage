import { Dialog, DialogTitle, DialogContent, TextField, Button } from "@mui/material";
import { useActionState } from "react";
import { createFolder } from "@/shared/lib/actions/storage/createFolder";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { getPath } from "@/shared/lib/getPath";
import { DialogProps } from "@/shared/lib/dialog/dialogProps";

export function FolderCreateDialog({open, onClose}: DialogProps){
    const router = useRouter();
    const { path } : { path: string[] } = useParams();
    const createFolderWithPath = createFolder.bind(null, getPath(path));
    // @ts-expect-error - NEXT SHOULD FIX THIS
    const [state, formAction, isPending] = useActionState(createFolderWithPath, {
        error: {},
        values: {
            folderName: '',
        },
    });

    useEffect(() => {
        if(state.success){
            onClose();
            router.refresh();
        }
    }, [state.success]);

    return (
        <>
            <Dialog open={open} onClose={onClose}>
                <DialogTitle>Create folder</DialogTitle>
                <DialogContent>
                    <form
                    action={formAction}
                    className="grid gap-7 md:min-w-[300px]"
                    >
                        <TextField
                            label="Folder Name"
                            name="folderName"
                            required
                            fullWidth
                            autoComplete="off"
                            variant="standard"
                            error={!!state.error?.folderName}
                            helperText={state.error?.folderName}
                        />
                        <Button loading={isPending} variant="contained" type="submit">Upload</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    )
}