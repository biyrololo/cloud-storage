export type SizeUnit = 'B' | 'KB' | 'MB' | 'GB' | 'TB' | 'PB' | 'EB' | 'ZB' | 'YB';
const units: SizeUnit[] = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

export type Size = `${number}${SizeUnit}`;

export function getSize(size: Size): number {
    const unit = size.slice(-2);
    const value = parseInt(size);
    const index = units.indexOf(unit as SizeUnit);
    if (index === -1) {
        throw new Error('Invalid size unit');
    }
    return value * Math.pow(1000, index);
}

export function formatSize(size: number): Size {
    const len = size.toString().length;
    const index = Math.floor((len - 1) / 3);
    const value = Math.round(size / Math.pow(1000, index));
    if(index >= units.length) {
        return `${value}${units[units.length - 1]}`;
    }
    return `${value}${units[index]}`;
}