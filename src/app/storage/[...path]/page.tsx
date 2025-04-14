import { getContent } from "@/shared/lib/actions/getContent";
import { redirect } from "next/navigation";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { Storage } from "@/widgets/storage";
import { Metadata } from "next";

export const generateMetadata = async ({ params }: { params: Promise<{ path: string[] }> }): Promise<Metadata> => {
    const { path } = await params;
    return {
        title: `BN Storage - ${path.pop()?.replace('%20', ' ')}`,
        description: `Storage of BN Storage - ${path.pop()?.replace('%20', ' ')}`,
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
    const content = await getContent(path.join('/').replace('%20', ' '), numericUserId);
    return (
        <Storage
        content={content}
        headerProps={{
            actionsProps: { allFiles: content },
            pathProps: { path: ['/', ...path] }
        }}
        />
    )
}