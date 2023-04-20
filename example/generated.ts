import { useMutation, useQuery, useQueryClient } from 'react-query';
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
  return useQuery<TodoItem, Error>(
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

      return data;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllTodoItems() {
  return useQuery<TodoItem[], Error>(['todo_items'], async () => {
    const { data, error } = await supabase.from('todo_items').select();
    if (error) throw error;
    return data as TodoItem[];
  });
}

export function useAddTodoItem() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: AddTodoItemRequest) => {
      return new Promise<null>((resolve, reject) => {
        supabase
          .from('todo_items')
          .insert(item)
          .single()
          .then(({ error }) => {
            if (error) {
              reject(error);
            }
            resolve(null);
          });
      });
    },
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
    (item: UpdateTodoItemRequest) => {
      return new Promise<null>((resolve, reject) => {
        supabase
          .from('todo_items')
          .update(item.changes)
          .eq('id', item.id)
          .single()
          .then(({ error }) => {
            if (error) {
              reject(error);
            }
            resolve(null);
          });
      });
    },
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
  return useQuery<Profile, Error>(
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

      return data;
    },
    {
      enabled: !!id,
    }
  );
}

export function useGetAllProfiles() {
  return useQuery<Profile[], Error>(['profiles'], async () => {
    const { data, error } = await supabase.from('profiles').select();
    if (error) throw error;
    return data as Profile[];
  });
}

export function useAddProfile() {
  const queryClient = useQueryClient();
  return useMutation(
    (item: AddProfileRequest) => {
      return new Promise<null>((resolve, reject) => {
        supabase
          .from('profiles')
          .insert(item)
          .single()
          .then(({ error }) => {
            if (error) {
              reject(error);
            }
            resolve(null);
          });
      });
    },
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
    (item: UpdateProfileRequest) => {
      return new Promise<null>((resolve, reject) => {
        supabase
          .from('profiles')
          .update(item.changes)
          .eq('id', item.id)
          .single()
          .then(({ error }) => {
            if (error) {
              reject(error);
            }
            resolve(null);
          });
      });
    },
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
