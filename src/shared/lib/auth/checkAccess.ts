import { Content } from "@/entities/file";
import { getMe } from '../actions/auth/getMe';

export async function getAccess(content: Content, type: 'read' | 'write'='read'){
    const user = await getMe();
    if(type === 'read'){
        if((!user && !content.readAccess.includes('all')) || 
            (user && !content.readAccess.includes(user.email))){
            return false;
        }
    } else {
        if((!user && !content.writeAccess.includes('all')) || 
            (user && !content.writeAccess.includes(user.email))){
            return false;
        }
    }
    return true;
}