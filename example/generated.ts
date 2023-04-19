import { useMutation, useQuery, useQueryClient } from 'react-query';
import { Database } from './database.types';
import { supabase } from './supabase';

export type GetTodoItemRequest = string;
export type GetTodoItemResponse = {
  created_at: string;
  description: string;
  id: string;
  name: string;
};
export type GetAllTodoItemsResponse = {
  created_at: string;
  description: string;
  id: string;
  name: string;
}[];
export type AddTodoItemRequest = {
  created_at?: string;
  description: string;
  id?: string;
  name: string;
};
export type UpdateTodoItemRequest = {
  id: string;
  changes: {
    created_at?: string;
    description?: string;
    id?: string;
    name?: string;
  };
};
export type DeleteTodoItemRequest = string;
export type GetProfileRequest = string;
export type GetProfileResponse = {
  first_name: string;
  id: string;
  last_name: string;
};
export type GetAllProfilesResponse = {
  first_name: string;
  id: string;
  last_name: string;
}[];
export type AddProfileRequest = {
  first_name?: string;
  id: string;
  last_name?: string;
};
export type UpdateProfileRequest = {
  id: string;
  changes: { first_name?: string; id?: string; last_name?: string };
};
export type DeleteProfileRequest = string;

export function useGetTodoItem(id: string) {
  return useQuery<GetTodoItemResponse, Error>(
    ['todo_items', id],
    async () => {
      const { data, error } = await supabase
        .from('todo_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data found');
      }

      return data as GetTodoItemResponse;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllTodoItems() {
  return useQuery<GetTodoItemResponse[], Error>(['todo_items'], async () => {
    const { data, error } = await supabase.from('todo_items').select();
    if (error) throw error;
    return data as GetTodoItemResponse[];
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: GetTodoItemResponse) =>
      supabase.from('todo_items').insert(item).single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todo_items');
      },
    }
  );
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: { id: string; changes: GetTodoItemResponse }) =>
      supabase
        .from('todo_items')
        .update(item.changes)
        .eq('id', item.id)
        .single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todo_items');
      },
    }
  );
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) => supabase.from('todo_items').delete().eq('id', id).single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todo_items');
      },
    }
  );
}

export function useGetProfile(id: string) {
  return useQuery<GetProfileResponse, Error>(
    ['profiles', id],
    async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data found');
      }

      return data as GetProfileResponse;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllProfiles() {
  return useQuery<GetProfileResponse[], Error>(['profiles'], async () => {
    const { data, error } = await supabase.from('profiles').select();
    if (error) throw error;
    return data as GetProfileResponse[];
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: GetProfileResponse) =>
      supabase.from('profiles').insert(item).single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
      },
    }
  );
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: { id: string; changes: GetProfileResponse }) =>
      supabase.from('profiles').update(item.changes).eq('id', item.id).single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
      },
    }
  );
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (id: string) => supabase.from('profiles').delete().eq('id', id).single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
      },
    }
  );
}
