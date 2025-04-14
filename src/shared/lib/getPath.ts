export function getPath(...path: (string | string[] | undefined)[]){
    return path.filter(Boolean).map(item => Array.isArray(item) ? item.filter(Boolean).join('/') : item).join('/').replace('%20', ' ');
}