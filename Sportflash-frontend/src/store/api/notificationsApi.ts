import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { API_BASE_URL } from '@config';
import { NotificationItem } from '@app-types/models/notification';

export const notificationsApi = createApi({
    reducerPath: 'notificationsApi',
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
    tagTypes: ['Notifications'],
    endpoints: (builder) => ({
        getNotifications: builder.query<{ success: boolean; data: NotificationItem[] }, void>({
            query: () => '/notifications',
            transformResponse: (response: { success: boolean; data: any[] }) => {
                return {
                    success: response.success,
                    data: response.data.map(item => ({
                        id: item._id,
                        title: item.title,
                        message: item.body,
                        read: item.read,
                        type: item.type,
                        timestamp: item.createdAt,
                        matchId: item.data?.matchId,
                        sport: item.data?.sport,
                        ...item.data
                    }))
                };
            },
            providesTags: ['Notifications'],
        }),
        markNotificationRead: builder.mutation<{ success: boolean; data: NotificationItem }, string>({
            query: (id) => ({
                url: `/notifications/${id}/read`,
                method: 'PUT',
            }),
            invalidatesTags: ['Notifications'],
        }),
        markAllNotificationsRead: builder.mutation<{ success: boolean }, void>({
            query: () => ({
                url: '/notifications/readall',
                method: 'PUT',
            }),
            invalidatesTags: ['Notifications'],
        }),
    }),
});

export const {
    useGetNotificationsQuery,
    useMarkNotificationReadMutation,
    useMarkAllNotificationsReadMutation,
} = notificationsApi;
