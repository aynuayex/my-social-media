"use client";

import { useEffect } from "react";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

import SetupPosts from "@/components/setup-posts";
import { Button } from "@/components/ui/button";
import Heading from "@/components/ui/heading";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { getAllPosts, selectAllPosts, selectLoading } from "@/store/features/post/postSlice";

export default function PostSPage() {
  const router = useRouter();

  const dispatch = useAppDispatch();
  const posts = useAppSelector(selectAllPosts);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(getAllPosts)
  }, []);
  return (
    <>
      <div className="flex items-center justify-between px-4 my-6 md:mr-6">
        <Heading
          title={`Posts ${loading?"":`(${posts.length})`}`}
          description="Manage posts on your social media."
        />
        <Button onClick={() => router.push(`/posts/new`)}>
          <Plus className="mr-2 w-4 h-4" />
          Add New
        </Button>
      </div>
      <SetupPosts />
    </>
  );
}
