export function getPath(...path: (string | string[] | undefined)[]){
    return decodeURIComponent(path.filter(Boolean).map(item => Array.isArray(item) ? item.filter(Boolean).join('/') : item).join('/'));
}