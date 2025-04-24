import { Content } from "./content";
import { SerializedContent } from "./slice";

export function contentDTO(content: Content): SerializedContent{
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {createdAt, updatedAt, ...dto} = content;
    if('size' in dto){
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const {size, ...rest} = dto;
        return rest;
    }
    return dto;
}