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
      lakehouse_leads: {
        Row: {
          id: string;
          email: string;
          consent: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          consent?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          consent?: boolean;
          created_at?: string;
        };
      };
      leads: {
        Row: {
          id: string;
          email: string;
          phone: string | null;
          country_code: string | null;
          name: string | null;
          message: string | null;
          source: string;
          project: string | null;
          consent: boolean | null;
          contact_id: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          phone?: string | null;
          country_code?: string | null;
          name?: string | null;
          message?: string | null;
          source: string;
          project?: string | null;
          consent?: boolean | null;
          contact_id?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          phone?: string | null;
          country_code?: string | null;
          name?: string | null;
          message?: string | null;
          source?: string;
          project?: string | null;
          consent?: boolean | null;
          contact_id?: string | null;
          created_at?: string;
        };
      };
      contacts: {
        Row: {
          id: string;
          email: string;
          name: string | null;
          phone: string | null;
          country_code: string | null;
          company: string | null;
          source: string | null;
          status: string;
          do_not_contact: boolean;
          unsubscribed: boolean;
          tags: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name?: string | null;
          phone?: string | null;
          country_code?: string | null;
          company?: string | null;
          source?: string | null;
          status?: string;
          do_not_contact?: boolean;
          unsubscribed?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string | null;
          phone?: string | null;
          country_code?: string | null;
          company?: string | null;
          source?: string | null;
          status?: string;
          do_not_contact?: boolean;
          unsubscribed?: boolean;
          tags?: string[];
          created_at?: string;
          updated_at?: string;
        };
      };
      contact_activities: {
        Row: {
          id: string;
          contact_id: string;
          type: string;
          metadata: Json;
          created_at: string;
          created_by_id: string | null;
        };
        Insert: {
          id?: string;
          contact_id: string;
          type: string;
          metadata?: Json;
          created_at?: string;
          created_by_id?: string | null;
        };
        Update: {
          id?: string;
          contact_id?: string;
          type?: string;
          metadata?: Json;
          created_at?: string;
          created_by_id?: string | null;
        };
      };
      admin_lead_views: {
        Row: {
          user_id: string;
          last_viewed_at: string;
        };
        Insert: {
          user_id: string;
          last_viewed_at?: string;
        };
        Update: {
          user_id?: string;
          last_viewed_at?: string;
        };
      };
      email_templates: {
        Row: {
          id: string;
          name: string;
          subject: string;
          body_html: string;
          variables: string[];
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          subject: string;
          body_html: string;
          variables?: string[];
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          subject?: string;
          body_html?: string;
          variables?: string[];
          created_at?: string;
        };
      };
      campaigns: {
        Row: {
          id: string;
          name: string;
          type: string;
          template_id: string | null;
          status: string;
          send_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type?: string;
          template_id?: string | null;
          status?: string;
          send_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          template_id?: string | null;
          status?: string;
          send_at?: string | null;
          created_at?: string;
        };
      };
      campaign_emails: {
        Row: {
          id: string;
          campaign_id: string;
          contact_id: string;
          step_index: number;
          status: string;
          sent_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          campaign_id: string;
          contact_id: string;
          step_index?: number;
          status?: string;
          sent_at?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          campaign_id?: string;
          contact_id?: string;
          step_index?: number;
          status?: string;
          sent_at?: string | null;
          created_at?: string;
        };
      };
    };
  };
}

export type PostStatus = "draft" | "published";
export type RoleName = "admin" | "moderator" | "author";

export type ContactStatus =
  | "new_lead"
  | "contacted"
  | "engaged"
  | "qualified"
  | "negotiation"
  | "converted"
  | "dormant";

export type ContactActivityType =
  | "form_submit"
  | "email_sent"
  | "email_received"
  | "note"
  | "call"
  | "meeting";
