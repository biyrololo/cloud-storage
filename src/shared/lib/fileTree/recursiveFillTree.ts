import { FileMetadata } from "@/entities/file";
import { FileTree } from "./fileTree";
import { getMetadata } from "@/entities/file/actions/fileActions";

export async function recursiveFillTree(tree: FileMetadata): Promise<FileTree>{
    if(tree.type === 'file'){
        return {
            ...tree,
            children: []
        }
    }
    const children: (FileTree | null)[] = await Promise.all(tree.children.map(async (child) => {
        const metadata = await getMetadata(child);
        if('error' in metadata){
            return null;
        }
        return await recursiveFillTree(metadata);
    }))
    return {
        ...tree,
        children: children.filter((child) => child !== null)
    }
}