import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const organizerBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}/organizer`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

interface Event {
  id: string;
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
  status: 'draft' | 'published' | 'cancelled';
  created_at: string;
}

interface CreateEventData {
  title: string;
  description: string;
  date: string;
  location: string;
  price: number;
  capacity: number;
}

export const organizerApi = createApi({
  reducerPath: 'organizerApi',
  baseQuery: organizerBaseQuery,
  tagTypes: ['Event'],
  endpoints: (builder) => ({
    getEvents: builder.query<Event[], void>({
      query: () => '/events/',
      providesTags: ['Event'],
    }),
    
    createEvent: builder.mutation<Event, CreateEventData>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    
    updateEvent: builder.mutation<Event, { id: string; data: Partial<CreateEventData> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    
    deleteEvent: builder.mutation<void, string>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Event'],
    }),
    
    getEventStats: builder.query<any, void>({
      query: () => '/stats/',
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventStatsQuery,
} = organizerApi;