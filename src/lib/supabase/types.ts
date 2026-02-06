export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          full_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          full_name?: string | null;
          avatar_url?: string | null;
          bio?: string | null;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      invites: {
        Row: {
          id: string;
          email: string;
          role_id: string;
          invited_by_id: string;
          created_at: string;
          used_at: string | null;
        };
        Insert: {
          id?: string;
          email: string;
          role_id: string;
          invited_by_id: string;
          created_at?: string;
          used_at?: string | null;
        };
        Update: {
          id?: string;
          email?: string;
          role_id?: string;
          invited_by_id?: string;
          created_at?: string;
          used_at?: string | null;
        };
      };
      role_audit_log: {
        Row: {
          id: string;
          target_user_id: string;
          action: string;
          role_name: string;
          performed_by_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          target_user_id: string;
          action: string;
          role_name: string;
          performed_by_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          target_user_id?: string;
          action?: string;
          role_name?: string;
          performed_by_id?: string;
          created_at?: string;
        };
      };
      permissions: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      role_permissions: {
        Row: {
          role_id: string;
          permission_id: string;
          created_at: string;
        };
        Insert: {
          role_id: string;
          permission_id: string;
          created_at?: string;
        };
        Update: {
          role_id?: string;
          permission_id?: string;
          created_at?: string;
        };
      };
      roles: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      user_roles: {
        Row: {
          id: string;
          user_id: string;
          role_id: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role_id: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role_id?: string;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          created_at?: string;
        };
      };
      post_categories: {
        Row: {
          post_id: string;
          category_id: string;
          created_at: string;
        };
        Insert: {
          post_id: string;
          category_id: string;
          created_at?: string;
        };
        Update: {
          post_id?: string;
          category_id?: string;
          created_at?: string;
        };
      };
      posts: {
        Row: {
          id: string;
          title: string;
          slug: string;
          content: Json | null;
          excerpt: string | null;
          cover_image: string | null;
          status: "draft" | "published";
          author_id: string;
          published_at: string | null;
          read_time_minutes: number | null;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          content?: Json | null;
          excerpt?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published";
          author_id: string;
          published_at?: string | null;
          read_time_minutes?: number | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          slug?: string;
          content?: Json | null;
          excerpt?: string | null;
          cover_image?: string | null;
          status?: "draft" | "published";
          author_id?: string;
          published_at?: string | null;
          read_time_minutes?: number | null;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}

export type PostStatus = "draft" | "published";
export type RoleName = "admin" | "moderator" | "author";
