import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { supabase } from './supabase';

export type TodoItem = {
  created_at: string;
  description: string;
  id: string;
  name: string;
};
export type AddTodoItemRequest = {
  created_at?: string | undefined;
  description: string;
  id?: string | undefined;
  name: string;
};
export type UpdateTodoItemRequest = {
  id: string;
  changes: {
    created_at?: string | undefined;
    description?: string | undefined;
    id?: string | undefined;
    name?: string | undefined;
  };
};

export type Profile = {
  first_name: string | null;
  id: string;
  last_name: string | null;
};
export type AddProfileRequest = {
  first_name?: string | null | undefined;
  id: string;
  last_name?: string | null | undefined;
};
export type UpdateProfileRequest = {
  id: string;
  changes: {
    first_name?: string | null | undefined;
    id?: string | undefined;
    last_name?: string | null | undefined;
  };
};

export function useGetTodoItem(id: string) {
  return useQuery<TodoItem, Error>({
    queryKey: ['todo_items', id],
    queryFn: async () => {
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
      return data as TodoItem;
    },
  });
}

export function useGetAllTodoItems() {
  return useQuery<TodoItem[], Error>({
    queryKey: ['todo_items'],
    queryFn: async () => {
      const { data, error } = await supabase.from('todo_items').select();
      if (error) {
        throw error;
      }
      return data as TodoItem[];
    },
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddTodoItemRequest) => {
      const { error } = await supabase.from('todo_items').insert(item).single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useUpdateTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateTodoItemRequest) => {
      const { error } = await supabase
        .from('todo_items')
        .update(item.changes)
        .eq('id', item.id)
        .single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useDeleteTodoItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('todo_items')
        .delete()
        .eq('id', id)
        .single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['todo_items'] });
    },
  });
}

export function useGetProfile(id: string) {
  return useQuery<Profile, Error>({
    queryKey: ['profiles', id],
    queryFn: async () => {
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
      return data as Profile;
    },
  });
}

export function useGetAllProfiles() {
  return useQuery<Profile[], Error>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select();
      if (error) {
        throw error;
      }
      return data as Profile[];
    },
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: AddProfileRequest) => {
      const { error } = await supabase.from('profiles').insert(item).single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (item: UpdateProfileRequest) => {
      const { error } = await supabase
        .from('profiles')
        .update(item.changes)
        .eq('id', item.id)
        .single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}

export function useDeleteProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', id)
        .single();
      if (error) {
        throw error;
      }
      return null;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
}
