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
  return useQuery<Database['public']['Tables']['todo_items']['Row'], Error>(
    ['todo_items', id],
    async () => {
      const { data, error } = await supabase
        .from<Database['public']['Tables']['todo_items']['Row']>('todo_items')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data found');
      }

      return data;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllTodoItems() {
  return useQuery<Database['public']['Tables']['todo_items']['Row'][], Error>(
    ['todo_items'],
    async () => {
      const { data, error } = await supabase
        .from<Database['public']['Tables']['todo_items']['Row']>('todo_items')
        .select();
      if (error) throw error;
      return data as Database['public']['Tables']['todo_items']['Row'][];
    }
  );
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: Database['public']['Tables']['todo_items']['Insert']) =>
      supabase
        .from<Database['public']['Tables']['todo_items']['Row']>('todo_items')
        .insert(item)
        .single(),
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
    (item: {
      id: string;
      changes: Database['public']['Tables']['todo_items']['Update'];
    }) =>
      supabase
        .from<Database['public']['Tables']['todo_items']['Row']>('todo_items')
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
    (id: string) =>
      supabase
        .from<Database['public']['Tables']['todo_items']['Row']>('todo_items')
        .delete()
        .eq('id', id)
        .single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('todo_items');
      },
    }
  );
}

export function useGetProfile(id: string) {
  return useQuery<Database['public']['Tables']['profiles']['Row'], Error>(
    ['profiles', id],
    async () => {
      const { data, error } = await supabase
        .from<Database['public']['Tables']['profiles']['Row']>('profiles')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      if (!data) {
        throw new Error('No data found');
      }

      return data;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllProfiles() {
  return useQuery<Database['public']['Tables']['profiles']['Row'][], Error>(
    ['profiles'],
    async () => {
      const { data, error } = await supabase
        .from<Database['public']['Tables']['profiles']['Row']>('profiles')
        .select();
      if (error) throw error;
      return data as Database['public']['Tables']['profiles']['Row'][];
    }
  );
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: Database['public']['Tables']['profiles']['Insert']) =>
      supabase
        .from<Database['public']['Tables']['profiles']['Row']>('profiles')
        .insert(item)
        .single(),
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
    (item: {
      id: string;
      changes: Database['public']['Tables']['profiles']['Update'];
    }) =>
      supabase
        .from<Database['public']['Tables']['profiles']['Row']>('profiles')
        .update(item.changes)
        .eq('id', item.id)
        .single(),
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
    (id: string) =>
      supabase
        .from<Database['public']['Tables']['profiles']['Row']>('profiles')
        .delete()
        .eq('id', id)
        .single(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('profiles');
      },
    }
  );
}
