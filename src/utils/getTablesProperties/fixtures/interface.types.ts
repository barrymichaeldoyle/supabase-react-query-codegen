export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[];

export interface Database {
  public: {
    Tables: {
      todo_items: {
        Row: {
          created_at: string;
          description: string;
          id: string;
          name: string;
        };
        Insert: {
          created_at?: string;
          description: string;
          id?: string;
          name: string;
        };
        Update: {
          created_at?: string;
          description?: string;
          id?: string;
          name?: string;
        };
      };
      profiles: {
        Row: {
          first_name: string | null;
          id: string;
          last_name: string | null;
        };
        Insert: {
          first_name?: string | null;
          id: string;
          last_name?: string | null;
        };
        Update: {
          first_name?: string | null;
          id?: string;
          last_name?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}
