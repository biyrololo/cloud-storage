import { StorageHeaderProps } from "../storageHeader/storageHeader";
import { Content } from "@/entities/file/model";
import { Header } from "../header";
import { StorageSpeedDial } from "../storageSpeedDial";
import { StorageDisplayV2 } from "../storageDisplayV2";
import { StorageHeader } from "../storageHeader/storageHeader";

export interface StorageProps {
    content: Content[];
    headerProps: StorageHeaderProps;
}

export function Storage({content, headerProps}: StorageProps){
    return (
        <>
        <Header />
        <main 
        className="box-border mx-4 md:mx-20 my-3 grid gap-2"
        >
            <StorageSpeedDial />
            <StorageHeader {...headerProps} />
            <StorageDisplayV2 content={content} />
        </main>
    </>
    )
}