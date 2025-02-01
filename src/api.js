import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "https://blog-platform.kata.academy/api/",
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("jwt_token");
      if (token) {
        headers.set("Authorization", `Token ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    getArticles: builder.query({
      query: ({ page = 1 }) => ({
        url: "articles",
        params: {
          offset: (page - 1) * 5,
          limit: 5,
        },
      }),
      transformResponse: (response) => response,
      providesTags: (result) =>
          result?.articles
              ? [
                ...result.articles.map(({ slug }) => ({
                  type: "Articles",
                  id: slug,
                })),
                { type: "Articles", id: "LIST" },
              ]
              : [{ type: "Articles", id: "LIST" }],
    }),

    createArticle: builder.mutation({
      query: (articleData) => {
        return {
          url: "articles",
          method: "POST",
          body: { article: articleData },
        };
      },
      transformResponse: (response) => response,
      // invalidates cache for the list of articles after creating a new article
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),

    updateArticle: builder.mutation({
      query: ({ slug, articleData }) => {
        if (!articleData) {
          return;
        }
        return {
          url: `articles/${slug}`,
          method: "PUT",
          body: { article: articleData },
        };
      },
      transformResponse: (response) => response,
      // invalidates cache for the list of articles after updating an article
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),

    deleteArticle: builder.mutation({
      query: (slug) => {
        return {
          url: `articles/${slug}`,
          method: "DELETE",
        };
      },
      transformResponse: (response) => response,
      // invalidates cache for the list of articles after deleting an article
      invalidatesTags: [{ type: "Articles", id: "LIST" }],
    }),

    getArticle: builder.query({
      query: (slug) => {
        return `articles/${slug}`;
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    createUser: builder.mutation({
      query: (userData) => {
        return {
          url: "users",
          method: "POST",
          body: { user: userData },
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),
    getCurrentUser: builder.query({
      query: () => "user",
      transformResponse: (response) => response,
      keepUnusedDataFor: 60,
      providesTags: ["User"],
    }),
    login: builder.mutation({
      query: (loginData) => {
        return {
          url: "users/login",
          method: "POST",
          body: { user: loginData },
        };
      },
      transformResponse: (response) => {
        return response;
      },
    }),

    updateUser: builder.mutation({
      query: (userData) => {
        return {
          url: "/user",
          method: "PUT",
          body: { user: userData },
        };
      },
      transformResponse: (response) => response,
      invalidatesTags: ["User"],
    }),


    favoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: "POST",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Articles", id: slug },
      ],
    }),
    unFavoriteArticle: builder.mutation({
      query: (slug) => ({
        url: `articles/${slug}/favorite`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, slug) => [
        { type: "Articles", id: slug },
      ],
    }),
  }),
});

export const {
  useGetArticlesQuery,
  useGetArticleQuery,
  useCreateUserMutation,
  useLoginMutation,
  useUpdateUserMutation,
  useGetCurrentUserQuery,
  useCreateArticleMutation,
  useUpdateArticleMutation,
  useDeleteArticleMutation,
  useFavoriteArticleMutation,
  useUnFavoriteArticleMutation,
} = api;

export default api;
