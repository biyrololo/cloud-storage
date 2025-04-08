const units = ['Б', 'КБ', 'МБ', 'ГБ', 'ТБ'];

export function formatSize(size: number){
    if(size === 0) return '0 Б';
    const i = Math.floor(Math.log(size) / Math.log(1024));
    return (size / Math.pow(1024, i)).toFixed(2) + ' ' + units[i];
}
