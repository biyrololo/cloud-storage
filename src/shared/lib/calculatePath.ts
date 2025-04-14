export function calculatePath(path: string, userId: string | undefined = undefined) {
    if(userId){
        return `/storage/user/${userId}/${path}`;
    }
    return `/storage/${path}`;
}