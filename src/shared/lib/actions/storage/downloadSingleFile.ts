"use server";

import { File as FileModel } from "@prisma/client";
import { getMe } from "../auth/getMe";
import s3Client from "../../s3/s3-config";
import { GetObjectCommand } from "@aws-sdk/client-s3";

export async function downloadSingleFile(file: FileModel) {
    const me = await getMe();

    if(!me && !file.readAccess.includes('all')){
        return {
            error: 'You don\'t have access to this file'
        }
    } 
    if(me && !file.readAccess.includes(me.email) && !file.readAccess.includes('all')){
        return {
            error: 'You don\'t have access to this file'
        }
    }
    const command = new GetObjectCommand({
        Bucket: process.env.S3_BUCKET_NAME,
        Key: file.s3Key
    })
    const response = await s3Client.send(command);
    if(response.Body){
        const chunks: Uint8Array[] = [];
        for await (const chunk of response.Body as AsyncIterable<Uint8Array>) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);
        return buffer;
    }
    return {
        error: 'File not found'
    }
}