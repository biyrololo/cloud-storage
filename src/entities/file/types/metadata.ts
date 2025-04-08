
type FileMetadataFolder = {
    type: 'folder';
    children: string[];
}

type FileMetadataFile = {
    type: 'file';
    fileId: string;
    size: number;
}

export type FileMetadata = {
    id: string;
    name: string;
    parentId: string | null;
    accessUsersRead: number[];
    accessUsersWrite: number[];
    ownerId: number;
} & (FileMetadataFolder | FileMetadataFile);
