import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";

import prismadb from "@/lib/prismadb";

export async function GET(req: Request) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse("unAuthorized", { status: 401 });
    }
    const posts = await prismadb.post.findMany({
      where: {
        userId
      },
    });
    
    // Sort the posts array from newest to oldest based on updatedAt
    posts.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());

    return NextResponse.json(posts);
  } catch (error:any) {
    console.log(["POSTS_GET"], error);
    return new NextResponse("Internal Server Error, Please try again later", { status: 500 });
  }
}

export async function POST(req: Request) {
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

    const post = await prismadb.post.create({
      data: {
        userId,
        title,
        body,
        imageUrl,
      },
    });
    return NextResponse.json(post);
  } catch (error:any) {
    console.log("[POST_POST]", error);
    return new NextResponse("Internal Server Error, Please try again later", { status: 500 });
  }
}


