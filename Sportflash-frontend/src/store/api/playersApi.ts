import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { Player } from '@app-types/models/player';
import { ApiResponse } from '@app-types/models/user';

export const playersApi = createApi({
    reducerPath: 'playersApi',
    baseQuery: fetchBaseQuery({
        baseUrl: API_BASE_URL,
        prepareHeaders: (headers, { getState }) => {
            const token = (getState() as any).auth.token;
            if (token) {
                headers.set('authorization', `Bearer ${token}`);
            }
            return headers;
        },
    }),
    endpoints: (builder) => ({
        getPlayerDetails: builder.query<Player, { id: string; sport: string }>({
            query: ({ id, sport }) => `/players/${id}?sport=${sport}`,
            transformResponse: (response: ApiResponse<Player>) => response.data,
        }),
    }),
});

export const { useGetPlayerDetailsQuery } = playersApi;

