import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

const baseUrl = "/api/posts";

interface PostData {
  title: string;
  body: string;
  imageUrl: string;
}

interface Post extends PostData {
  id: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ErrorResponseData {
  response: {
    data: string;
  };
}

export const createPost = createAsyncThunk(
  "posts/createPost",
  async (postData: PostData, thunkAPI) => {
    try {
      const response = await axios.post(baseUrl, postData);
      return response.data;
    } catch (error: any) {
      const errorData: ErrorResponseData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

export const getAllPosts = createAsyncThunk(
  "posts/getAllPosts",
  async (_, thunkAPI) => {
    try {
      const response = await axios.get(baseUrl);
      return response.data;
    } catch (error: any) {
      const errorData: ErrorResponseData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

export const getPostById = createAsyncThunk(
  "posts/getPostById",
  async (postId: string | string[], thunkAPI) => {
    try {
      const response = await axios.get(`${baseUrl}/${postId}`);
      return response.data;
    } catch (error: any) {
      const errorData: ErrorResponseData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

export const updatePost = createAsyncThunk(
  "posts/updatePost",
  async (
    { postId, postData }: { postId: string | string[]; postData: PostData },
    thunkAPI
  ) => {
    try {
      const response = await axios.patch(`${baseUrl}/${postId}`, postData);
      return response.data;
    } catch (error: any) {
      const errorData: ErrorResponseData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

export const deletePost = createAsyncThunk(
  "posts/deletePost",
  async (postId: string | string[], thunkAPI) => {
    try {
      const response = await axios.delete(`${baseUrl}/${postId}`);
      return response.data;
    } catch (error: any) {
      const errorData: ErrorResponseData = error.response.data;
      return thunkAPI.rejectWithValue(errorData);
    }
  }
);

interface InitialState {
  loading: boolean;
  posts: Post[];
  error: string;
}

const initialState: InitialState = {
  loading: false,
  posts: [],
  error: "",
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPost.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts.push(action.payload);
      })
      .addCase(createPost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Something went wrong,Please try again later!";
      })
      .addCase(getAllPosts.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(
        getAllPosts.fulfilled,
        (state, action: PayloadAction<Post[]>) => {
          state.loading = false;
          state.posts = action.payload;
        }
      )
      .addCase(getAllPosts.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Something went wrong,Please try again later!";
      })
      .addCase(getPostById.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(getPostById.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts = [action.payload];
      })
      .addCase(getPostById.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Something went wrong,Please try again later!";
      })
      .addCase(updatePost.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? action.payload : post
        );
      })
      .addCase(updatePost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Something went wrong,Please try again later!";
      })
      .addCase(deletePost.pending, (state) => {
        state.loading = true;
        state.error = "";
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.loading = false;
        state.posts = state.posts.filter(
          (post) => post.id !== action.payload.id
        );
      })
      .addCase(deletePost.rejected, (state, action) => {
        state.loading = false;
        state.error =
          (action.payload as string) ||
          "Something went wrong,Please try again later!";
      });
  },
});

export default postsSlice.reducer;

type selectorState = {
  posts: InitialState;
};

// Selectors
export const selectAllPosts = (state: selectorState) => state.posts.posts;
export const selectPostById = (state: selectorState) => state.posts.posts[0];
export const selectLoading = (state: selectorState) => state.posts.loading;
export const selectError = (state: selectorState) => state.posts.error;

