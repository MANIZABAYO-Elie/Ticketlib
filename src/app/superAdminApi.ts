import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const superAdminBaseQuery = fetchBaseQuery({
  baseUrl: `${import.meta.env.VITE_API_URL}`,
  prepareHeaders: (headers) => {
    headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  created_at: string;
  google_maps_url: string;
}

interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

interface Tag {
  id: number;
  name: string;
  created_at: string;
}

interface Event {
  id: number;
  title: string;
  description: string;
  start_datetime: string;
  end_datetime: string;
  status: 'draft' | 'published' | 'cancelled';
  is_featured: boolean;
  venue: Venue;
  category: Category;
  tags: Tag[];
  banner_image: string;
  organizer_name: string;
  is_active: string;
  created_at: string;
}

interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Event[];
}

interface CreateEventData {
  title: string;
  description: string;
  venue: number;
  start_datetime: string;
  end_datetime: string;
}

interface CreateVenueData {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  google_maps_url: string;
}

export const superAdminApi = createApi({
  reducerPath: 'superAdminApi',
  baseQuery: superAdminBaseQuery,
  tagTypes: ['Event', 'Venue'],
  endpoints: (builder) => ({
    getAllEvents: builder.query<EventsResponse, void>({
      query: () => '/api/events/events/',
      providesTags: ['Event'],
    }),
    
    createEvent: builder.mutation<Event, CreateEventData>({
      query: (data) => ({
        url: '/api/events/events/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Event'],
    }),
    
    createVenue: builder.mutation<Venue, CreateVenueData>({
      query: (data) => ({
        url: '/api/events/venues/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: ['Venue'],
    }),
    
    getVenues: builder.query<Venue[], void>({
      query: () => '/api/events/venues/',
      providesTags: ['Venue'],
    }),
  }),
});

export const {
  useGetAllEventsQuery,
  useCreateEventMutation,
  useCreateVenueMutation,
  useGetVenuesQuery,
} = superAdminApi;