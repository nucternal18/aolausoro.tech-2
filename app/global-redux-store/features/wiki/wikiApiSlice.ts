import { wikiApiSlice } from "@app/GlobalReduxStore/api";
import type { WikiProps } from "schema/Wiki";

export const wikiApi = wikiApiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getWikis: builder.query<WikiProps[], void>({
      query: () => `/wiki`,
      providesTags: (result) =>
        result
          ? [
              ...(result?.map(
                (wiki) =>
                  ({
                    type: "Wiki",
                    id: wiki?.id,
                  }) as const,
              ) ?? []),
              { type: "Wiki", id: "LIST" },
            ]
          : [{ type: "Wiki", id: "LIST" }],
    }),
    getWikiById: builder.query<WikiProps, string>({
      query: (id) => `/wiki/${id}`,
      providesTags: (result, error, arg) => [{ type: "Wiki", id: arg }],
    }),
    createWiki: builder.mutation<
      { success: boolean; message: string },
      Partial<WikiProps>
    >({
      query: (wiki) => ({
        url: "/wiki/create",
        method: "POST",
        body: { ...wiki },
      }),
      invalidatesTags: (result, error, arg) => [{ type: "Wiki", id: "LIST" }],
    }),

    deleteWiki: builder.mutation<{ success: boolean; message: string }, string>(
      {
        query: (id) => ({
          url: `/wiki/${id}`,
          method: "DELETE",
        }),
        invalidatesTags: (result, error, arg) => [{ type: "Wiki", id: arg }],
      },
    ),
  }),
  overrideExisting: true,
});

export const {
  useGetWikisQuery,
  useGetWikiByIdQuery,
  useCreateWikiMutation,
  useDeleteWikiMutation,
} = wikiApi;
