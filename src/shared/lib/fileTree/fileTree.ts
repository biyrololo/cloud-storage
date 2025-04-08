export type FileTree = {
    id: string;
    name: string;
    parentId: string | null;
    accessUsersRead: number[];
    accessUsersWrite: number[];
    ownerId: number;
    children: FileTree[];
} & (
    | {
        type: 'file';
        size: number;
        fileId: string;
        children: [];
    }
    | {
        type: 'folder';
    }
);