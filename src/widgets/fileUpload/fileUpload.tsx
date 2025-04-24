"use client";

import { FileUploader } from "react-drag-drop-files";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/shared/lib/actions/storage/uploadFile";
import { uploadFileRecursive } from "@/shared/lib/actions/storage/uploadFileRecursive";
import { useParams, useRouter } from "next/navigation";
import { getPath } from "@/shared/lib/getPath";
import { CircularProgress } from "@mui/material";

export function FileUpload({onClose, folder=false}: {onClose: () => void, folder?: boolean}){
    const fileUploadRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { path } : { path: string[] } = useParams();
    const [pending, setPending] = useState(false);

    useEffect(() => {
        if(fileUploadRef.current && folder){
            const input = fileUploadRef.current.querySelector('input[type="file"]');
            console.log(input);
            if(input){
                input.setAttribute('webkitdirectory', '');
                input.setAttribute('directory', '');
            }
        }
    }, [])

    const handleChange = async (files: FileList) => {
        console.log('files', files);
        setPending(true);
        for(const file of files){
            if(folder){
                const response = await uploadFileRecursive(
                    file,
                    getPath(path),
                    file.webkitRelativePath
                )
                console.log('res', response);
            } else {
                const response = await uploadFile(
                    file,
                    getPath(path)
                );
                console.log('res', response);
            }
        }
        setPending(false);
        onClose();
        router.refresh();
    }

    return (
        <div ref={fileUploadRef}>
            <FileUploader
                handleChange={handleChange}
                name="file"
                label="Upload or drop files"
                disabled={pending}
                multiple
                classes="!overflow-hidden !block !w-full"
            >
                <p className={`rounded-md cursor-pointer border border-[var(--primary-color)] p-3 text-primary md:min-w-[300px] flex items-center opacity-${pending ? 50 : 100}`}>
                    {
                        pending ? (
                            <>
                                <CircularProgress size={20} />
                                <span className="ml-2">Uploading...</span>
                            </>
                        ) : (
                            <>
                                Upload or drop files
                            </>
                        )
                    }
                </p>
            </FileUploader>
        </div>
    )
}