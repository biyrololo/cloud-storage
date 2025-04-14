import { List, Typography } from "@mui/material"
import { StorageElement } from "../storageElement"
import { Content } from "@/entities/file/model";

export type StorageDisplayV2Props = {
    content: Content[];
}

export function StorageDisplayV2({ content }: StorageDisplayV2Props) {

    if(content.length === 0){
        return (
            <div className="flex justify-center items-center mt-10">
                <Typography>No content</Typography>
            </div>
        )
    }

    const sortedContent = content.sort((a, b) => {
        if(!('s3Key' in a) && 's3Key' in b){
            return -1;
        }
        if(a.updatedAt > b.updatedAt){
            return -1;
        }
        return 1;
    });

    return (
        <List>
            {sortedContent.map((item) => (
                <StorageElement key={item.id} item={item} />
            ))}
        </List>
    )
}