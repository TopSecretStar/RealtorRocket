import {createApi} from "@reduxjs/toolkit/query/react";
import customFetchBase from "./customFetchBase.js";
import {setToken} from "../auth/authSlice.js";


export const authApi = createApi({
    reducerPath: 'authApi',
    baseQuery: customFetchBase,
    endpoints: (build) => ({
        login: build.mutation({
            query: (credentials) => ({
                url: '/login',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
                localStorage.setItem('tokens', JSON.stringify({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
            }

        }),
        register: build.mutation({
            query: (credentials) => ({
                url: '/signup',
                method: 'POST',
                body: credentials,
            }),
            async onQueryStarted(arg, { dispatch, queryFulfilled }) {
                const { data } = await queryFulfilled;
                dispatch(setToken({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
                localStorage.setItem('tokens', JSON.stringify({ accessToken: data.accessToken, refreshToken: data.refreshToken }));
            }

        }),
        refresh: build.mutation({
            query: () => ({
                url: '/refresh',
                method: 'POST',
            }),
        }),
        logout: build.mutation({
            query: () => ({
                url: '/logout',
                method: 'POST',
            }),
        }),
        users: build.query({
            query: () => ({
                url: '/users',
                method: 'GET',
            }),
        })
    }),
})

export const {
    useLoginMutation,
    useRegisterMutation,
    useRefreshMutation,
    useLogoutMutation,
    useUsersQuery,
} = authApi;