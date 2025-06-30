export const revalidate = 0;

import { Metadata } from "next";
import { Storage } from "@/widgets/storage";
import { getContent } from "@/shared/lib/actions/getContent";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { redirect } from "next/navigation";

export const generateMetadata = async ({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> => {
    const { path } = await params;
    return {
        title: `BN Storage - ${decodeURIComponent(path.pop() || 'unknown')}`,
        description: `Storage of BN Storage - ${decodeURIComponent(path.pop() || 'unknown')}`,
    }
}

export default async function StorageV2Page({ params }: { params: Promise<{ path: string[] }> }) {
    const user = await getMe();
    if(!user){
        redirect('/');
    }
    const { path } = await params;
    const numericUserId = Number(user.id);
    if(isNaN(numericUserId)){
        redirect('/');
    }
    const content = await getContent(decodeURIComponent(path.join('/')), numericUserId);
    return (
        <Storage
        content={content}
        headerProps={{
            actionsProps: { allFiles: content },
            pathProps: { path: ['/', ...path] }
        }}
        spaceProps={{
            maxSize: user.maxSpace,
            usedSpace: user.usedSpace
        }}
        />
    )
}