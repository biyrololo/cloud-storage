import { getContent } from "@/shared/lib/actions/getContent";
import { redirect } from "next/navigation";
import { getMe } from "@/shared/lib/actions/auth/getMe";
import { Storage } from "@/widgets/storage";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'BN Storage - User Storage',
    description: 'Your storage of BN Storage',
}

export default async function StorageV2Page() {
    const user = await getMe();
    if(!user){
        redirect('/');
    }
    const content = await getContent('', user.id);

    return (
        <Storage
        content={content}
        headerProps={{
            actionsProps: { allFiles: content },
            pathProps: { path: ['/'] }
        }}
        />
    )
}