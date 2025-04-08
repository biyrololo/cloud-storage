import { Header } from '@/widgets/header';
import { Storage } from '@/widgets/storage';
import { Suspense } from 'react';

export default async function StoragePage(){

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <Header />
            <Storage />
        </Suspense>
    )
}