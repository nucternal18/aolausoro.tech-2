import { wikiApiSlice } from "@app/GlobalReduxStore/api";

export const wikiApi = wikiApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWiki: builder.query<string, void>({
      query: () => `/wiki`,
      providesTags: (result, error, arg) => [{ type: "Wiki", id: "LIST" }],
    }),
    getWikiById: builder.query<string, string>({
      query: (id) => `/wiki/${id}`,
      providesTags: (result, error, arg) => [{ type: "Wiki", id: arg }],
    }),
    createWiki: builder.mutation<string, string>({
      query: (wiki) => ({
        url: "/wiki",
        method: "POST",
        body: { wiki },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Wiki", id: "LIST" }],
    }),
    updateWiki: builder.mutation<string, { id: string; wiki: string }>({
      query: ({ id, wiki }) => ({
        url: `/wiki/${id}`,
        method: "PUT",
        body: { wiki },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Wiki", id: arg.id }],
    }),
    deleteWiki: builder.mutation<string, string>({
      query: (id) => ({
        url: `/wiki/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Wiki", id: arg }],
    }),
  }),
});

export const {
  useGetWikiQuery,
  useGetWikiByIdQuery,
  useCreateWikiMutation,
  useUpdateWikiMutation,
  useDeleteWikiMutation,
} = wikiApi;
