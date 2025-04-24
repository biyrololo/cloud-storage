export const revalidate = 0;

import { getContent } from "@/shared/lib/actions/getContent";
import { redirect } from "next/navigation";
import { getPath } from "@/shared/lib/getPath";
import { Storage } from "@/widgets/storage";
import { Metadata } from "next";
import { getMe } from "@/shared/lib/actions/auth/getMe";

export const generateMetadata = async ({ params }: { params: Promise<{ path: string[], userId: string }> }): Promise<Metadata> => {
    const { path } = await params;
    return {
        title: `BN Storage - ${path.pop()?.replace('%20', ' ')}`,
        description: `Storage of BN Storage - ${path.pop()?.replace('%20', ' ')}`,
    }
}

export default async function StorageV2Page({ params }: { params: Promise<{ path: string[], userId: string }> }) {
    const user = await getMe();
    const { path, userId } = await params;
    const numericUserId = Number(userId);
    if(isNaN(numericUserId)){
        redirect('/');
    }
    const content = await getContent(getPath(path), numericUserId);
    return (
        <Storage
        hasWriteAccess={content.some(f => {
            if(!user){
                return f.writeAccess.includes('all');
            }
            return f.writeAccess.includes(user.email) || f.writeAccess.includes('all');
        })}
        content={content}
        headerProps={{
            actionsProps: { allFiles: content },
            pathProps: { path, userId }
        }}/>
    )
}