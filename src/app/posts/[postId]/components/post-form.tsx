"use client";

import * as z from "zod";
import { useState } from "react";
import toast from "react-hot-toast";
import { Trash } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useParams, useRouter } from "next/navigation";

import { Post } from "@prisma/client";
import Heading from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import AlertModal from "@/components/modals/alert-modal";
import ImageUpload from "@/components/ui/image-upload";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  createPost,
  deletePost,
  selectError,
  selectLoading,
  updatePost,
} from "@/store/features/post/postSlice";

const formSchema = z.object({
  title: z.string().min(3),
  body: z.string().min(10),
  imageUrl: z.string().min(5),
});

type PostFormValues = z.infer<typeof formSchema>;

interface PostFormProps {
  initialData: Post | null;
}

const PostForm: React.FC<PostFormProps> = ({ initialData }) => {
  const params = useParams();
  const router = useRouter();

  const error = useAppSelector(selectError);
  const loading = useAppSelector(selectLoading);
  const dispatch = useAppDispatch();

  const [open, setOpen] = useState(false);

  const title = initialData ? "Edit post" : "Create post";
  const description = initialData ? "Update a post" : "Add a new post";
  const toastMessage = initialData
    ? "Post updated successfully!"
    : "Post created successfully!";
  const action = initialData ? "Save changes" : "Create";

  const form = useForm<PostFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      title: "",
      body: "",
      imageUrl: "",
    },
  });

  const onSubmit = (data: PostFormValues) => {
    if (initialData) {
      dispatch(updatePost({ postId: params.postId, postData: data }));
    } else {
      dispatch(createPost(data));
    }
    if (error) return toast.error(error);
    router.refresh();
    router.push(`/posts`);
    toast.success(toastMessage);
  };

  const onDelete = () => {
    dispatch(deletePost(params.postId));
    if (error) return toast.error(error);
    setOpen(false);
    router.refresh();
    router.push(`/posts`);
    toast.success("Post deleted successfully!");
  };

  return (
    <>
      <AlertModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {initialData && (
          <Button
            disabled={loading}
            variant={"destructive"}
            size={"icon"}
            onClick={() => {
              setOpen(true);
            }}
          >
            <Trash className="w-4 h-4" />
          </Button>
        )}
      </div>
      <Separator />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8 w-full"
        >
          <FormField
            control={form.control}
            name="imageUrl"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Post image</FormLabel>
                <FormControl>
                  <ImageUpload
                    disabled={loading}
                    onChange={(url) => field.onChange(url)}
                    onRemove={() => field.onChange("")}
                    value={field.value ? [field.value] : []}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Post title"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input
                      disabled={loading}
                      placeholder="Post detail"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex space-x-8">
            <Button
              type="button"
              onClick={() => router.push("/posts")}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {action}
            </Button>
          </div>
        </form>
      </Form>
    </>
  );
};

export default PostForm;
