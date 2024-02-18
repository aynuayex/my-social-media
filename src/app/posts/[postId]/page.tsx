"use client";

import { useEffect, useState } from "react";

import PostForm from "./components/post-form";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getPostById,
  selectLoading,
  selectPostById,
} from "@/store/features/post/postSlice";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";

const PostPage = ({ params }: { params: { postId: string } }) => {
  // const [load, setLoad] = useState(true);
  const dispatch = useAppDispatch();
  const post = useAppSelector(selectPostById);
  const loading = useAppSelector(selectLoading);

  useEffect(() => {
    dispatch(getPostById(params.postId));
  }, []);

  if (loading) {
    return (
      <div className="space-y-4 px-4 my-6">
        <Skeleton className="h-20 w-48" />
        <Separator />

        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-20 w-20" />
        <div className="h-20 grid grid-cols-2 gap-8">
          <div className="flex">
            <Skeleton className="h-20 w-5" />
            <Skeleton className="h-20 w-20" />
          </div>
          <div className="flex">
            <Skeleton className="h-20 w-5" />
            <Skeleton className="h-20 w-20" />
          </div>
        </div>
        <div className="h-20 grid grid-cols-2 gap-8">
          <Skeleton className="h-20 w-5" />
          <Skeleton className="h-20 w-5" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 m-8 mt-6">
        <PostForm initialData={post} />
      </div>
    </div>
  );
};

export default PostPage;
