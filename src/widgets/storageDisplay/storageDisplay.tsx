"use client";

import { useEffect, useState } from "react";
import { getMyFiles, getMetadata } from "@/entities/file";
import { Box, Breadcrumbs, CircularProgress, Typography } from "@mui/material";
import { findInTree } from "@/shared/lib/fileTree";
import { useTypedSelector, useTypedDispatch } from "@/shared/lib/store";
import { fileActions } from "@/entities/file";
import { FilesList } from "../filesList";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { StorageText } from "@/shared/ui/storageText";
import { StorageActions } from "../storageActions/storageActions";
import { recursiveFillTree } from "@/shared/lib/fileTree/recursiveFillTree";

export function StorageDisplay(){
    const searchParams = useSearchParams();
    const loaded = useTypedSelector(state => state.file.loaded);
    const tree = useTypedSelector(state => state.file.tree);
    const currentPath = useTypedSelector(state => state.file.currentPath);
    const currentDir = useTypedSelector(state => state.file.currentDir);
    const dispatch = useTypedDispatch();
    
    const [pending, setPending] = useState(false);
    const router = useRouter();
    
    useEffect(() => {
        const fetchFiles = async () => {
            setPending(true);
            const rootFiles = (
                searchParams.get('s') ? await getMetadata(searchParams.get('s')!) : await getMyFiles()
            );
            if('error' in rootFiles){
                console.error(rootFiles.error);
            } else if(rootFiles.type === 'folder'){
                
                const root = await recursiveFillTree(rootFiles);
                console.log(root);
                
                dispatch(fileActions.setTree(root));
            }
            setPending(false);
        }
        if(!loaded){
            fetchFiles();
        }
    }, []);

    useEffect(() => {
        if(!tree){
            return;
        }
        const directory = searchParams.get('d');
        const baseDir = directory || 'root';
        if(baseDir === currentDir?.id){
            return;
        }
        console.log(baseDir, tree);
        const newDir = findInTree(tree, baseDir);
        console.log(newDir);
        if(!newDir.file){
            return;
        }
        dispatch(fileActions.changeDirectory({path: newDir.path, dir: newDir.file}));

    }, [searchParams, tree, currentDir]);

    useEffect(() => {
        dispatch(fileActions.clearSelectedFiles());
    }, [searchParams]);

    const handlePathClick = (path: {id: string, name: string}) => {
        router.push(`/storage?d=${path.id}`);
    }

    return (
        <div>
            <h1>Storage</h1>
            <Box sx={{px: 2, py: 1, display: 'flex', alignItems: 'center', justifyContent: 'space-between'}}>
                <Breadcrumbs>
                    {
                        currentPath.map((p, i) => (
                            <Typography key={i}
                            sx={{
                                '&:hover': {
                                    textDecoration: 'underline'
                                },
                                color: i === currentPath.length - 1 ? 'text.primary' : ''
                            }}
                            onClick={() => {
                                if(i === currentPath.length - 1){
                                    return;
                                }
                                handlePathClick(p);
                            }}
                            >{p.name}</Typography>
                        ))
                    }
                </Breadcrumbs>
                <StorageActions />
            </Box>
            
            {
                pending ? (
                    <StorageText text={<CircularProgress />} />
                ) : (
                    <>
                        {
                            tree && (
                                <FilesList />
                            )
                        }
                    </>
                )
            }
        </div>
    )
}