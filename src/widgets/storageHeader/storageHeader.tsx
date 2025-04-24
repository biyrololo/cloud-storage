import { Path } from "../path/path";
import { StorageActions, StorageActionsProps } from "../storageActions/storageActions";
import { PathProps } from "../path/path";

export interface StorageHeaderProps {
    pathProps: PathProps;
    actionsProps: StorageActionsProps;
    hasWriteAccess?: boolean
}

export function StorageHeader({ pathProps, actionsProps, hasWriteAccess }: StorageHeaderProps){
    return (
        <div className="flex justify-between items-center flex-wrap">
            <Path {...pathProps} />
            <StorageActions {...actionsProps} hasWriteAccess={hasWriteAccess}/>
        </div>
    )
}