import { getAccess } from "@/shared/lib/auth/checkAccess";
import { prisma } from "@/shared/lib/prisma";
import { NextResponse } from "next/server";
import { GetObjectCommand } from "@aws-sdk/client-s3";
import s3Client from "@/shared/lib/s3/s3-config";
import { getMimeType } from "@/shared/lib/mimeType";

interface Params {
    id: string
}

export async function GET(request: Request, 
    { params }: { params: Promise<Params> }
){
    const { id } = await params;
    const fileId = Number(id);
    if(isNaN(fileId)) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 400 }
        )
    }

    const file = await prisma.file.findUnique({
        where: {
            id: fileId
        }
    })

    if(!file) {
        return NextResponse.json(
            { error: 'File not found' },
            { status: 400 }
        )
    }

    if(!await getAccess(file)){
        return NextResponse.json(
            { error: 'Access declined' },
            { status: 403 }
        )
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
        let mime = getMimeType(file.name);
        if (mime === 'text/html' || mime.includes('javascript')) {
            mime = 'text/plain';
          }
        const isViewable = [
            'image/',
            'application/pdf',
            'text/'
          ].some(type => mime.startsWith(type));
        return new Response(buffer, {
            headers: {
                'Content-Type': mime,
                'Content-Disposition': isViewable 
                ? `inline; filename="${encodeURIComponent(file.name)}"`
                : `attachment; filename="${encodeURIComponent(file.name)}"`,
                'Content-Length': file.size.toString()
            }
        })
    }
    return NextResponse.json(
        { error: 'Server error' },
        { status: 500 }
    )
}