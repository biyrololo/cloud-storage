import { FileTree } from "./fileTree";

const MAX_DEPTH = 100;

export type PathElement = {
    id: string;
    name: string;
}

export function findInTree(tree: FileTree, id: string, depth = 0, path: PathElement[] = []): {
    file: FileTree | null;
    path: PathElement[];
} {
    console.log('FIND IN TREE', tree, id);
    const currentPath = [...path, {id: tree.id, name: tree.name}];
    if(tree.id === id){
        return {
            file: tree,
            path: currentPath
        };
    }

    if(tree.children.length === 0 || depth > MAX_DEPTH){
        return {
            file: null,
            path: []
        };
    }

    for(const child of tree.children){
        const result = findInTree(child, id, depth + 1, currentPath);
        if(result.file){
            return result;
        }
    }

    return {
        file: null,
        path: []
    };
}