"use client";

import { FileUploader } from "react-drag-drop-files";
import { useEffect, useRef, useState } from "react";
import { uploadFile } from "@/shared/lib/actions/storage/uploadFile";
import { uploadFileRecursive } from "@/shared/lib/actions/storage/uploadFileRecursive";
import { useParams, useRouter } from "next/navigation";
import { getPath } from "@/shared/lib/getPath";
import { LinearProgress } from "@mui/material";

export function FileUpload({onClose, folder=false}: {onClose: () => void, folder?: boolean}){
    const fileUploadRef = useRef<HTMLDivElement>(null);

    const router = useRouter();
    const { path } : { path: string[] } = useParams();
    const [pending, setPending] = useState(false);
    const [loadedFiles, setLoadedFiles] = useState<number>(0);
    const [totalFiles, setTotalFiles] = useState<number>(0);

    useEffect(() => {
        if(fileUploadRef.current && folder){
            const input = fileUploadRef.current.querySelector('input[type="file"]');
            if(input){
                input.setAttribute('webkitdirectory', '');
                input.setAttribute('directory', '');
            }
        }
    }, [])

    const handleChange = async (files: FileList) => {
        setPending(true);
        setLoadedFiles(0);
        setTotalFiles(files.length);
        for(const file of files){
            if(folder){
                await uploadFileRecursive(
                    file,
                    getPath(path),
                    file.webkitRelativePath
                )
            } else {
                await uploadFile(
                    file,
                    getPath(path)
                );
            }
            setLoadedFiles(prev => prev + 1);
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
                                <div className="grid w-full">
                                    <LinearProgress variant="buffer" value={(loadedFiles / totalFiles) * 100} valueBuffer={(loadedFiles + 1) / totalFiles * 100} />
                                </div>
                            </>
                        ) : (
                            <>
                                Upload or drop {folder ? 'folders' : 'files'}
                            </>
                        )
                    }
                </p>
            </FileUploader>
        </div>
    )
}