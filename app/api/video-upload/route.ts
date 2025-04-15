import { auth } from '@clerk/nextjs/server';
import { PrismaClient } from '@/generated/prisma';
import { v2 as cloudinary } from 'cloudinary';
import { NextRequest, NextResponse } from 'next/server';

const prisma = new PrismaClient();
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

interface cloudinaryUploadResult{
  public_id: string;
  bytes: number;
  duration? : number;
  [key:string]: any;
}

export async function POST(request: NextRequest){
  const {userId} = await auth();
  if(!userId){
    return new Response('Unauthorized', {status: 401})
  }

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const title=formData.get('title') as string;
    const description=formData.get('description') as string;
    const originalSize= formData.get('originalSize') as string;

    if(!file) {
      return new Response('No file provided', { status: 400 });
    }

    const bytes= await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const result = await new Promise<cloudinaryUploadResult>((resolve,reject)=>{
      const uploadStream=cloudinary.uploader.upload_stream(
        {
            resource_type: 'video',
            folder:"MediaVault",
            transformation:[
                {quality: 'auto', fetch_format: 'mp4'},
            ]
        },
        (error,result)=>{
          if(error){
            reject(error);
          }else{
            resolve(result as cloudinaryUploadResult);
          }
        }
      )
      uploadStream.end(buffer);
    })
    const video= await prisma.video.create({
        data:{
            title,
            description,
            originalSize: originalSize,
            compressedSize: String(result.bytes),
            publicId: result.public_id,
            duration: result.duration || 0,
        }
    })
    return NextResponse.json({video},{status: 200});
  } catch (error) {
    return NextResponse.json({error: 'Error uploading video'},{status: 500});
  } finally {
    await prisma.$disconnect();
  }

}