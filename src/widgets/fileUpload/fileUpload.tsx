"use client";

import { FileUploader } from "react-drag-drop-files";
import { useState } from "react";
import { uploadFile } from "@/shared/lib/actions/storage/uploadFile";
import { useParams, useRouter } from "next/navigation";
import { getPath } from "@/shared/lib/getPath";
import { CircularProgress } from "@mui/material";

export function FileUpload({onClose}: {onClose: () => void}){
    const router = useRouter();
    const { path } : { path: string[] } = useParams();
    const [pending, setPending] = useState(false);
    const handleChange = async (files: File[]) => {
        setPending(true);
        for(const file of files){
            const response = await uploadFile(
                file,
                getPath(path)
            );
            console.log(response); 
        }
        setPending(false);
        onClose();
        router.refresh();
    }

    return (
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
    )
}