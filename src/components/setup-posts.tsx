import Image from "next/image";
import { format } from "date-fns";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";
import { Edit, MoreVertical, Trash } from "lucide-react";

import AlertModal from "./modals/alert-modal";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  getAllPosts,
  selectAllPosts,
  selectLoading,
  selectError,
  deletePost,
} from "@/store/features/post/postSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Skeleton } from "./ui/skeleton";

export default function SetupPosts() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const posts = useAppSelector(selectAllPosts);
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getAllPosts());
  }, []);

  if (error) {
    toast.error(error);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center space-y-6 rounded">
        <Skeleton className="w-2/3 h-44 " />
        <Skeleton className="w-2/3 h-44" />
      </div>
    );
  }

  const onDelete = (id: string) => {
    dispatch(deletePost(id));
    if (error) return toast.error(error);
    setOpen(false);
    router.refresh();
    toast.success("Post deleted successfully!");
  };

  return (
    <div className="flex flex-col items-center justify-center space-y-4">
      {posts && posts.length ? (
        posts.map(
          (post) =>
            post && (
              <div key={post.id} className="w-2/3 relative">
                <AlertModal
                  isOpen={open}
                  onClose={() => setOpen(false)}
                  onConfirm={() => onDelete(post.id)}
                  loading={loading}
                />
                <div className="relative">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        className="w-8 h-8 p-0 absolute top-0 right-0 m-3 cursor-pointer"
                        variant={"ghost"}
                      >
                        <span className="sr-only">Open menu</span>
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuLabel>Actions</DropdownMenuLabel>
                      <DropdownMenuItem
                        onClick={() => router.push(`posts/${post.id}`)}
                      >
                        <Edit className="mr-2 w-4 h-4" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => setOpen(true)}>
                        <Trash className="mr-2 w-4 h-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="border-2 rounded px-8 py-6 lg:flex lg:justify-between ">
                  <div>
                    <h1 className="text-xl font-semibold pb-4">{post.title}</h1>
                    <p className="pb-6">{post.body}</p>
                  </div>
                  <Image
                    width={200}
                    height={200}
                    src={post.imageUrl}
                    alt="post Image"
                    className="pb-4 lg:pr-12"
                  />
                </div>
                <span className="absolute bottom-0 right-0 m-2 text-xs">
                  {post.createdAt === post.updatedAt
                    ? format(post?.createdAt, "MMMM do, yyyy (h:mm a)")
                    : `updated:${format(
                        post.updatedAt,
                        "MMMM do, yyyy (h:mm a)"
                      )}`}
                </span>
              </div>
            )
        )
      ) : (
        <div className="flex flex-col items-center">
          <h1 className="text-2xl font-semibold pb-4">No posts available</h1>
          <small className="text-center px-2">
            Please create a new post by clicking on the Add New button.
          </small>
        </div>
      )}
    </div>
  );
}


