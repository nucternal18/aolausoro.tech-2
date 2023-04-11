"use client";
import {
  createApi,
  fetchBaseQuery,
  BaseQueryFn,
  FetchArgs,
  FetchBaseQueryError,
  FetchBaseQueryMeta,
} from "@reduxjs/toolkit/query/react";
import { QueryReturnValue } from "@reduxjs/toolkit/dist/query/baseQueryTypes";
import { RootState } from "./store";
import { UserInfoProps } from "../../lib/types";

const dev = process.env.NODE_ENV !== "production";

export const NEXT_URL = dev
  ? "http://localhost:3000"
  : "https://aolausoro.tech";

interface RefreshResult {
  error?: FetchBaseQueryError | undefined;
  data?:
    | {
        token: string;
      }
    | undefined;
  meta?: FetchBaseQueryMeta | undefined;
}

function checkIsError(obj: unknown): obj is Error {
  return (
    typeof obj === "object" && obj !== null && "data" in obj && "status" in obj
  );
}

const baseQuery: BaseQueryFn<
  string | FetchArgs,
  any,
  FetchBaseQueryError,
  Record<string, unknown>,
  FetchBaseQueryMeta
> = fetchBaseQuery({
  baseUrl: `${NEXT_URL}/api`,
  credentials: "include",
  prepareHeaders: (headers, api) => {
    headers.set("Content-Type", "application/json");
    return headers;
  },
});

const baseQueryWithReAuth: BaseQueryFn = async (
  args: string | FetchArgs,
  api,
  extraOptions
) => {
  let result = await baseQuery(args, api, extraOptions);
  if (result?.error?.status === 400) {
    result = await baseQuery(args, api, extraOptions);
  }
  if (result?.error?.status === 401 || result?.error?.status === 403) {
    // send refresh token to get new token
    const refreshResult: RefreshResult = await baseQuery(
      "/refresh/",
      api,
      extraOptions
    );
    if (refreshResult?.data) {
      const { user } = api.getState() as RootState;
      const currentUser = user.currentUser as UserInfoProps;
      console.log("🚀 ~ file: api.ts:71 ~ user:", user);
      // store new token

      // retry original request
      result = await baseQuery(args, api, extraOptions);
    } else {
      if (refreshResult?.error?.status === 403) {
        if (checkIsError(refreshResult?.error?.data)) {
          refreshResult.error.data.message =
            "You Session has expired. Please login again. ";
        }
      }
    }
  }
  return result;
};

export const userApiSlice = createApi({
  reducerPath: "User",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["User"],
  keepUnusedDataFor: 5000,
  endpoints: (builder) => ({}),
});
export const messageApiSlice = createApi({
  reducerPath: "Message",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Message"],
  keepUnusedDataFor: 5000,
  endpoints: (builder) => ({}),
});
export const projectApiSlice = createApi({
  reducerPath: "Project",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Project"],
  keepUnusedDataFor: 5000,
  endpoints: (builder) => ({}),
});
export const jobsApiSlice = createApi({
  reducerPath: "Jobs",
  baseQuery: baseQueryWithReAuth,
  tagTypes: ["Jobs"],
  keepUnusedDataFor: 5000,
  endpoints: (builder) => ({}),
});
