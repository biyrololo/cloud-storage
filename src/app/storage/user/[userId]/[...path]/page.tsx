export const revalidate = 0;

import { Metadata } from "next";
import { Storage } from "@/widgets/storage";
import { getContent } from "@/shared/lib/actions/getContent";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { getPath } from "@/shared/lib/getPath";
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ path: string[], userId: string }> }): Promise<Metadata> => {
    const { path } = await params;
    return {
        title: `BN Storage - ${decodeURIComponent(path.pop() || 'unknown')}`,
        description: `Storage of BN Storage - ${decodeURIComponent(path.pop() || 'unknown')}`,
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