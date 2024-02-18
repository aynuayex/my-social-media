import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import { v2 as cloudinary } from "cloudinary";

import prismadb from "@/lib/prismadb";

// Initialize Cloudinary with your cloud name, API key, and API secret
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY,
  api_secret: process.env.NEXT_PUBLIC_CLOUDINARY_API_SECRET,
});

export async function GET(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params.postId) {
      return new NextResponse("Post id is required", { status: 400 });
    }

    const post = await prismadb.post.findFirst({
      where: {
        id: params.postId,
        userId,
      },
    });

    return NextResponse.json(post);
  } catch (error: any) {
    console.log(["POST_GET"], error);
    return new NextResponse("Internal Server Error, Please try again later",
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    const { title, body, imageUrl } = await req.json();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!title) {
      return new NextResponse("title is required", { status: 400 });
    }
    if (!body) {
      return new NextResponse("body is required", { status: 400 });
    }
    if (!imageUrl) {
      return new NextResponse("Image url is required", { status: 400 });
    }
    if (!params.postId) {
      return new NextResponse("Post id is required", { status: 400 });
    }
    const post = await prismadb.post.update({
      where: {
        id: params.postId,
        userId,
      },
      data: {
        title,
        body,
        imageUrl,
      },
    });
    return NextResponse.json(post);
  } catch (error: any) {
    console.log(["POST_PATCH"], error);
    return new NextResponse("Internal Server Error, Please try again later",
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { postId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    if (!params.postId) {
      return new NextResponse("Post id is required", { status: 400 });
    }

    const post = await prismadb.post.delete({
      where: {
        id: params.postId,
        userId,
      },
    });
    // Extract the public ID of the image from the Cloudinary URL
    //https://res.cloudinary.com/dbetbp08z/image/upload/v1708263472/wawtepzdkqom6axmy1cp.png
    const publicId = post.imageUrl.replace(
      /^(?:https?:\/\/)?(?:res.cloudinary.com\/\w+\/image\/upload\/)?([^/]+)/,
      ""
    );
    // console.log(publicId.slice(1,-4))
    // Delete the image from Cloudinary
    const result = await cloudinary.uploader.destroy(publicId.slice(1, -4));
    console.log("Image deleted successfully:", result);

    return NextResponse.json(post);
  } catch (error: any) {
    console.log(["POST_DELETE"], error);
    return new NextResponse("Internal Server Error, Please try again later",
      { status: 500 }
    );
  }
}
