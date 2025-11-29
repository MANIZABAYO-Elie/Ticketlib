
// import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

// const organizerBaseQuery = fetchBaseQuery({
//   baseUrl: `${import.meta.env.VITE_API_URL}`,
//   prepareHeaders: (headers) => {
//     headers.set('Content-Type', 'application/json');
//     const token = localStorage.getItem('access_token');
//     if (token) {
//       headers.set('Authorization', `Bearer ${token}`);
//     }
//     return headers;
//   },
// });

// interface Venue {
//   id: number;
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   capacity: number;
//   created_at: string;
//   google_maps_url: string;
// }

// interface Event {
//   id: number;
//   title: string;
//   description: string;
//   banner_image?:string | null;
//   tags?: string[];
//   start_datetime: string;
//   end_datetime: string;
//   venue: number| Venue;
//   venue_name?: string;
//   category?: string[] | null;
//   created_at?: string;
// }

// interface VenuesResponse {
//   data: Venue[];
// }

// interface EventsResponse {
//   count: number;
//   next: string | null;
//   previous: string | null;
//   results: Event[];
// }

// interface CreateEventData {
//   title: string;
//   description: string;
//   banner_image?: string;
//   tags?: string[];
//   start_datetime: string;
//   end_datetime: string;
//   venue: number;
//   category?: string[];
// }

// interface CreateVenueData {
//   name: string;
//   address: string;
//   city: string;
//   country: string;
//   capacity: number;
//   google_maps_url: string;
// }

// export const organizerApi = createApi({
//   reducerPath: 'organizerApi',
//   baseQuery: organizerBaseQuery,
//   tagTypes: ['Event', 'Venue'],
//   endpoints: (builder) => ({
//     getEvents: builder.query<EventsResponse, void>({
//       query: () => '/events/',
//       providesTags: (result) =>
//         result
//           ? [
//             ...result.results.map((r) => ({ type: 'Event' as const, id: r.id })),
//             { type: 'Event', id: 'LIST' },
//           ]
//           : [{ type: 'Event', id: 'LIST' }],
//     }),

//     createEvent: builder.mutation<Event, CreateEventData>({
//       query: (data) => ({ url: '/events/', method: 'POST', body: data }),
//       invalidatesTags: [{ type: 'Event', id: 'LIST' }],
//     }),
    
//     updateEvent: builder.mutation<Event, { id: string; data: Partial<CreateEventData> }>({
//       query: ({ id, data }) => ({ url: `/events/${id}/`, method: 'PUT', body: data }),
//       invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }],
//     }),
    
//     deleteEvent: builder.mutation<void, string>({
//       query: (id) => ({ url: `/events/${id}/`, method: 'DELETE' }),
//       invalidatesTags: (result, error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
//     }),

//     getEventStats: builder.query<any, void>({
//       query: () => '/stats/',
//     }),

//     getVenues: builder.query<VenuesResponse, void>({
//       query: () => '/venues/',
//       providesTags: ['Venue'],
//     }),

//     createVenue: builder.mutation<Venue, CreateVenueData>({
//       query: (data) => ({
//         url: '/venues/',
//         method: 'POST',
//         body: data,
//       }),
//       invalidatesTags: ['Venue'],
//     }),

//     getVenueDetails: builder.query<Venue, number>({
//       query: (id) => `/venues/${id}/`,
//       providesTags: (result, error, id) => [{ type: 'Venue', id }],
//     }),

//     updateVenue: builder.mutation<Venue, { id: number; data: Partial<CreateVenueData> }>({
//       query: ({ id, data }) => ({
//         url: `/venues/${id}/`,
//         method: 'PUT',
//         body: data,
//       }),
//       invalidatesTags: ['Venue'],
//     }),

//     deleteVenue: builder.mutation<void, number>({
//       query: (id) => ({
//         url: `/venues/${id}/`,
//         method: 'DELETE',
//       }),
//       invalidatesTags: ['Venue'],
//     }),
//   }),
// });

// export const {
//   useGetEventsQuery,
//   useCreateEventMutation,
//   useUpdateEventMutation,
//   useDeleteEventMutation,
//   useGetEventStatsQuery,
//   useGetVenuesQuery,
//   useCreateVenueMutation,
//   useGetVenueDetailsQuery,
//   useUpdateVenueMutation,
//   useDeleteVenueMutation,
// } = organizerApi;


// src/app/organizerApi.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const organizerBaseQuery = fetchBaseQuery({
  baseUrl: API_URL,
  prepareHeaders: (headers) => {
    // fetchBaseQuery's headers is a Headers instance
    headers.set('Content-Type', 'application/json');
    const token = localStorage.getItem('access_token');
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

// --- Types ---
export interface Venue {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  created_at: string;
  google_maps_url?: string | null;
}

export interface EventItem {
  id: number;
  title: string;
  description: string;
  banner_image?: string | null;
  tags?: string[] | { id: number; name: string }[];
  start_datetime: string | null;
  end_datetime: string | null;
  venue: number | Venue;
  venue_name?: string;
  category?: string[] | { id: number; name: string }[] | null;
  created_at?: string;
  status?: string;
  is_featured?: boolean;
  organizer_name?: string;
  is_active?: boolean | string;
}

export interface VenuesResponse {
  data: Venue[];
}

export interface EventsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: EventItem[];
}

export interface CreateEventData {
  title: string;
  description: string;
  banner_image?: string | null;
  tags?: string[] | { id: number }[];
  start_datetime: string;
  end_datetime: string;
  venue: number;
  category: number;
}

export interface CreateVenueData {
  name: string;
  address: string;
  city: string;
  country: string;
  capacity: number;
  google_maps_url?: string;
}

export interface Category {
  id: number;
  name: string;
  description: string;
  created_at: string;
}

export interface CategoriesResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Category[];
}

export interface CreateCategoryData {
  name: string;
  description: string;
}

export interface Tag {
  id: number;
  name: string;
  created_at: string;
}

export interface TagsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Tag[];
}

export interface CreateTagData {
  name: string;
}

// --- API ---
export const organizerApi = createApi({
  reducerPath: 'organizerApi',
  baseQuery: organizerBaseQuery,
  tagTypes: ['Event', 'Venue', 'Category', 'Tag'],
  endpoints: (builder) => ({
    // GET /events/ -> normalize common backend shapes into EventsResponse
    getEvents: builder.query<EventsResponse, void>({
      query: () => '/events/',
      transformResponse: (response: any) => {
        // Try to adapt various backend response shapes.
        // If backend already returns { count, results }, return as-is.
        if (response && response.count !== undefined && response.results !== undefined) {
          return response as EventsResponse;
        }

        // If backend returns { data: { results: [...] } } or { data: [...] }
        if (response && response.data) {
          // Case: data is list
          if (Array.isArray(response.data)) {
            return {
              count: response.data.length,
              next: null,
              previous: null,
              results: response.data,
            } as EventsResponse;
          }
          // Case: data.results
          if (response.data.results) {
            return response.data as EventsResponse;
          }
        }

        // Last fallback: if response is an array of events
        if (Array.isArray(response)) {
          return {
            count: response.length,
            next: null,
            previous: null,
            results: response,
          } as EventsResponse;
        }

        // If nothing matches, try to return a safe default
        return {
          count: 0,
          next: null,
          previous: null,
          results: [],
        } as EventsResponse;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((r) => ({ type: 'Event' as const, id: r.id })),
              { type: 'Event', id: 'LIST' },
            ]
          : [{ type: 'Event', id: 'LIST' }],
    }),

    createEvent: builder.mutation<EventItem, CreateEventData>({
      query: (data) => ({
        url: '/events/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Event', id: 'LIST' }],
    }),

    updateEvent: builder.mutation<EventItem, { id: number; data: Partial<CreateEventData> }>({
      query: ({ id, data }) => ({
        url: `/events/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),

    deleteEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),

    getEventStats: builder.query<any, void>({
      query: () => '/api/stats/',
      // no tags needed (read-only)
    }),

    // Venues
    getVenues: builder.query<VenuesResponse, void>({
      query: () => '/venues/',
      transformResponse: (response: any) => {
        // Handle common shapes:
        if (response && response.data && Array.isArray(response.data)) {
          return { data: response.data } as VenuesResponse;
        }
        if (Array.isArray(response)) {
          return { data: response } as VenuesResponse;
        }
        // If backend returns { results: [...] } or { data: { results: [...] } }
        if (response && response.results && Array.isArray(response.results)) {
          return { data: response.results } as VenuesResponse;
        }
        // If response itself looks like a Venue list
        if (response && Array.isArray(response.venues)) {
          return { data: response.venues } as VenuesResponse;
        }
        // fallback safe default
        return { data: [] } as VenuesResponse;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((v) => ({ type: 'Venue' as const, id: v.id })),
              { type: 'Venue', id: 'LIST' },
            ]
          : [{ type: 'Venue', id: 'LIST' }],
    }),

    createVenue: builder.mutation<Venue, CreateVenueData>({
      query: (data) => ({
        url: '/venues/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Venue', id: 'LIST' }],
    }),

    getVenueDetails: builder.query<Venue, number>({
      query: (id) => `/api/venues/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Venue', id }],
    }),

    updateVenue: builder.mutation<Venue, { id: number; data: Partial<CreateVenueData> }>({
      query: ({ id, data }) => ({
        url: `/venues/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Venue', id }, { type: 'Venue', id: 'LIST' }],
    }),

    deleteVenue: builder.mutation<void, number>({
      query: (id) => ({
        url: `/venues/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Venue', id }, { type: 'Venue', id: 'LIST' }],
    }),

    approveEvent: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/moderator/${id}/approve_event/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),
    
    submitEventForApproval: builder.mutation<void, number>({
      query: (id) => ({
        url: `/events/${id}/submit_for_approval/`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),
    
    rejectEvent: builder.mutation<void, { id: number; reason?: string }>({
      query: ({ id, reason }) => ({
        url: `/events/moderator/${id}/reject_event/`,
        method: 'POST',
        body: { reason: reason || 'Event rejected' },
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Event', id }, { type: 'Event', id: 'LIST' }],
    }),

    // Categories
    getCategories: builder.query<CategoriesResponse, void>({
      query: () => '/categories/',
      transformResponse: (response: any) => {
        // Handle the expected paginated response structure
        if (response && response.count !== undefined && response.results !== undefined) {
          return response as CategoriesResponse;
        }
        
        // Handle if backend returns { data: [...] }
        if (response && response.data && Array.isArray(response.data)) {
          return {
            count: response.data.length,
            next: null,
            previous: null,
            results: response.data,
          } as CategoriesResponse;
        }
        
        // Handle if backend returns array directly
        if (Array.isArray(response)) {
          return {
            count: response.length,
            next: null,
            previous: null,
            results: response,
          } as CategoriesResponse;
        }
        
        // Fallback
        return {
          count: 0,
          next: null,
          previous: null,
          results: [],
        } as CategoriesResponse;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((c) => ({ type: 'Category' as const, id: c.id })),
              { type: 'Category', id: 'LIST' },
            ]
          : [{ type: 'Category', id: 'LIST' }],
    }),

    createCategory: builder.mutation<Category, CreateCategoryData>({
      query: (data) => ({
        url: '/categories/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Category', id: 'LIST' }],
    }),

    updateCategory: builder.mutation<Category, { id: number; data: Partial<CreateCategoryData> }>({
      query: ({ id, data }) => ({
        url: `/categories/${id}/`,
        method: 'PUT',
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [{ type: 'Category', id }, { type: 'Category', id: 'LIST' }],
    }),

    getCategoryDetails: builder.query<Category, number>({
      query: (id) => `/categories/${id}/`,
      providesTags: (result, error, id) => [{ type: 'Category', id }],
    }),

    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Category', id }, { type: 'Category', id: 'LIST' }],
    }),

    // Tags
    getTags: builder.query<TagsResponse, void>({
      query: () => '/tags/',
      transformResponse: (response: any) => {
        if (response && response.count !== undefined && response.results !== undefined) {
          return response as TagsResponse;
        }
        if (response && response.data && Array.isArray(response.data)) {
          return {
            count: response.data.length,
            next: null,
            previous: null,
            results: response.data,
          } as TagsResponse;
        }
        if (Array.isArray(response)) {
          return {
            count: response.length,
            next: null,
            previous: null,
            results: response,
          } as TagsResponse;
        }
        return {
          count: 0,
          next: null,
          previous: null,
          results: [],
        } as TagsResponse;
      },
      providesTags: (result) =>
        result
          ? [
              ...result.results.map((t) => ({ type: 'Tag' as const, id: t.id })),
              { type: 'Tag', id: 'LIST' },
            ]
          : [{ type: 'Tag', id: 'LIST' }],
    }),

    createTag: builder.mutation<Tag, CreateTagData>({
      query: (data) => ({
        url: '/tags/',
        method: 'POST',
        body: data,
      }),
      invalidatesTags: [{ type: 'Tag', id: 'LIST' }],
    }),

    deleteTag: builder.mutation<void, number>({
      query: (id) => ({
        url: `/tags/${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: (result, error, id) => [{ type: 'Tag', id }, { type: 'Tag', id: 'LIST' }],
    }),
  }),
});

export const {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation,
  useGetEventStatsQuery,
  useGetVenuesQuery,
  useCreateVenueMutation,
  useGetVenueDetailsQuery,
  useUpdateVenueMutation,
  useDeleteVenueMutation,
  useApproveEventMutation,
  useSubmitEventForApprovalMutation,
  useRejectEventMutation,
  useGetCategoriesQuery,
  useGetCategoryDetailsQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetTagsQuery,
  useCreateTagMutation,
  useDeleteTagMutation,
} = organizerApi;



