import { StorageHeaderProps } from "../storageHeader/storageHeader";
import { Content } from "@/entities/file/model";
import { Header } from "../header";
import { StorageSpeedDial } from "../storageSpeedDial";
import { StorageDisplayV2 } from "../storageDisplay";
import { StorageHeader } from "../storageHeader/storageHeader";
import { StorageSpaceProps } from "../storageSpace/storageSpace";
import { StorageSpace } from "../storageSpace/storageSpace";
export interface StorageProps {
    content: Content[];
    headerProps: StorageHeaderProps;
    spaceProps?: StorageSpaceProps;
    hasWriteAccess?: boolean
}

export function Storage({content, headerProps, spaceProps, hasWriteAccess=true}: StorageProps){
    return (
        <>
        <Header />
        <main 
        className="box-border mx-4 md:mx-20 my-3 grid gap-2"
        >
            {hasWriteAccess && (
                <StorageSpeedDial />
            )}
            {
                spaceProps && (
                    <StorageSpace {...spaceProps}/>
                )
            }
            <StorageHeader {...headerProps} hasWriteAccess={hasWriteAccess}/>
            <StorageDisplayV2 content={content} />
        </main>
    </>
    )
}