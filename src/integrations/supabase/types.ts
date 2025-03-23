export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_sessions: {
        Row: {
          created_at: string
          expires_at: string
          id: string
        }
        Insert: {
          created_at?: string
          expires_at: string
          id?: string
        }
        Update: {
          created_at?: string
          expires_at?: string
          id?: string
        }
        Relationships: []
      }
      billy_jennings_blog_posts: {
        Row: {
          author: string | null
          content: string
          cover_image: string | null
          created_at: string
          excerpt: string | null
          id: string
          published: boolean | null
          slug: string | null
          title: string
          updated_at: string
        }
        Insert: {
          author?: string | null
          content: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title: string
          updated_at?: string
        }
        Update: {
          author?: string | null
          content?: string
          cover_image?: string | null
          created_at?: string
          excerpt?: string | null
          id?: string
          published?: boolean | null
          slug?: string | null
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      blog_media: {
        Row: {
          alt_text: string | null
          caption: string | null
          created_at: string | null
          id: string
          media_type: string
          post_id: string | null
          url: string
        }
        Insert: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          media_type: string
          post_id?: string | null
          url: string
        }
        Update: {
          alt_text?: string | null
          caption?: string | null
          created_at?: string | null
          id?: string
          media_type?: string
          post_id?: string | null
          url?: string
        }
        Relationships: [
          {
            foreignKeyName: "blog_media_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
        ]
      }
      blog_posts: {
        Row: {
          archived: boolean | null
          canonical_url: string | null
          category: string | null
          content: string
          created_at: string
          created_by: string | null
          document_url: string | null
          excerpt: string | null
          id: string
          image_alt: string | null
          image_url: string | null
          og_image_url: string | null
          published: boolean | null
          published_at: string | null
          reading_time: number | null
          scheduled_for: string | null
          schema_json: Json | null
          seo_description: string | null
          seo_title: string | null
          slug: string | null
          tags: string[] | null
          title: string
          toc: Json | null
          updated_at: string
          view_count: number | null
        }
        Insert: {
          archived?: boolean | null
          canonical_url?: string | null
          category?: string | null
          content: string
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          og_image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          schema_json?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          tags?: string[] | null
          title: string
          toc?: Json | null
          updated_at?: string
          view_count?: number | null
        }
        Update: {
          archived?: boolean | null
          canonical_url?: string | null
          category?: string | null
          content?: string
          created_at?: string
          created_by?: string | null
          document_url?: string | null
          excerpt?: string | null
          id?: string
          image_alt?: string | null
          image_url?: string | null
          og_image_url?: string | null
          published?: boolean | null
          published_at?: string | null
          reading_time?: number | null
          scheduled_for?: string | null
          schema_json?: Json | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string | null
          tags?: string[] | null
          title?: string
          toc?: Json | null
          updated_at?: string
          view_count?: number | null
        }
        Relationships: []
      }
      books: {
        Row: {
          affiliate_link: string | null
          author: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          title: string
        }
        Insert: {
          affiliate_link?: string | null
          author: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title: string
        }
        Update: {
          affiliate_link?: string | null
          author?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          title?: string
        }
        Relationships: []
      }
      business_lead_credits: {
        Row: {
          business_id: string
          created_at: string
          credits_remaining: number
          id: string
          notes: string | null
          updated_at: string
        }
        Insert: {
          business_id: string
          created_at?: string
          credits_remaining?: number
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Update: {
          business_id?: string
          created_at?: string
          credits_remaining?: number
          id?: string
          notes?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "business_lead_credits_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "tree_service_companies"
            referencedColumns: ["id"]
          },
        ]
      }
      city_seo: {
        Row: {
          city: string
          created_at: string
          id: string
          meta_description: string
          meta_title: string
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          meta_description: string
          meta_title: string
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          meta_description?: string
          meta_title?: string
          updated_at?: string
        }
        Relationships: []
      }
      distractions: {
        Row: {
          autoplay: boolean | null
          content: string
          content_type: string
          created_at: string
          description: string | null
          id: string
          image_url: string | null
          media_url: string | null
          website_url: string | null
        }
        Insert: {
          autoplay?: boolean | null
          content: string
          content_type: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          media_url?: string | null
          website_url?: string | null
        }
        Update: {
          autoplay?: boolean | null
          content?: string
          content_type?: string
          created_at?: string
          description?: string | null
          id?: string
          image_url?: string | null
          media_url?: string | null
          website_url?: string | null
        }
        Relationships: []
      }
      favorites: {
        Row: {
          content_id: string
          content_type: string
          created_at: string
          id: string
          user_id: string | null
        }
        Insert: {
          content_id: string
          content_type: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Update: {
          content_id?: string
          content_type?: string
          created_at?: string
          id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "favorites_books_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "books"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_distractions_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "distractions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_quotes_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "quotes"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_suggestions_fkey"
            columns: ["content_id"]
            isOneToOne: false
            referencedRelation: "suggestions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      file_downloads: {
        Row: {
          downloaded_at: string | null
          downloaded_by: string
          file_id: string
          id: string
          session_id: string
        }
        Insert: {
          downloaded_at?: string | null
          downloaded_by: string
          file_id: string
          id?: string
          session_id: string
        }
        Update: {
          downloaded_at?: string | null
          downloaded_by?: string
          file_id?: string
          id?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "file_downloads_file_id_fkey"
            columns: ["file_id"]
            isOneToOne: false
            referencedRelation: "shared_files"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "file_downloads_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sharing_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      haunted_listing_votes: {
        Row: {
          created_at: string
          emoji_tag: Database["public"]["Enums"]["emoji_tag"]
          id: string
          listing_id: string
          updated_at: string
          vote_count: number
        }
        Insert: {
          created_at?: string
          emoji_tag: Database["public"]["Enums"]["emoji_tag"]
          id?: string
          listing_id: string
          updated_at?: string
          vote_count?: number
        }
        Update: {
          created_at?: string
          emoji_tag?: Database["public"]["Enums"]["emoji_tag"]
          id?: string
          listing_id?: string
          updated_at?: string
          vote_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "haunted_listing_votes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "haunted_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      haunted_listings: {
        Row: {
          address: string | null
          banner_image: string | null
          city: string
          created_at: string
          email: string | null
          id: string
          is_featured: boolean | null
          name: string
          phone: string | null
          rating: number | null
          state: string
          tag: string | null
          website: string | null
        }
        Insert: {
          address?: string | null
          banner_image?: string | null
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_featured?: boolean | null
          name: string
          phone?: string | null
          rating?: number | null
          state: string
          tag?: string | null
          website?: string | null
        }
        Update: {
          address?: string | null
          banner_image?: string | null
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_featured?: boolean | null
          name?: string
          phone?: string | null
          rating?: number | null
          state?: string
          tag?: string | null
          website?: string | null
        }
        Relationships: []
      }
      lead_activity_log: {
        Row: {
          action_type: string
          created_at: string | null
          id: string
          lead_id: string | null
          notes: string | null
          performed_by: string | null
        }
        Insert: {
          action_type: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Update: {
          action_type?: string
          created_at?: string | null
          id?: string
          lead_id?: string | null
          notes?: string | null
          performed_by?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_activity_log_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_activity_log_performed_by_fkey"
            columns: ["performed_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_assignments: {
        Row: {
          admin_notified_at: string | null
          assigned_at: string
          assigned_to: string
          contact_attempts: number | null
          id: string
          last_contact_attempt: string | null
          notes: string | null
          quote_request_id: string
          reminder_sent_at: string | null
          status: Database["public"]["Enums"]["lead_status"]
          updated_at: string
        }
        Insert: {
          admin_notified_at?: string | null
          assigned_at?: string
          assigned_to: string
          contact_attempts?: number | null
          id?: string
          last_contact_attempt?: string | null
          notes?: string | null
          quote_request_id: string
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Update: {
          admin_notified_at?: string | null
          assigned_at?: string
          assigned_to?: string
          contact_attempts?: number | null
          id?: string
          last_contact_attempt?: string | null
          notes?: string | null
          quote_request_id?: string
          reminder_sent_at?: string | null
          status?: Database["public"]["Enums"]["lead_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_assignments_assigned_to_fkey"
            columns: ["assigned_to"]
            isOneToOne: false
            referencedRelation: "tree_service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_assignments_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_pricing_by_city: {
        Row: {
          city: string
          created_at: string
          id: string
          lead_type: string
          lead_type_id: string | null
          price: number
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          id?: string
          lead_type: string
          lead_type_id?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          id?: string
          lead_type?: string
          lead_type_id?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_pricing_by_city_lead_type_id_fkey"
            columns: ["lead_type_id"]
            isOneToOne: false
            referencedRelation: "lead_types"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_pricing_defaults: {
        Row: {
          created_at: string
          id: string
          lead_type: string
          lead_type_id: string | null
          price: number
          updated_at: string
        }
        Insert: {
          created_at?: string
          id?: string
          lead_type: string
          lead_type_id?: string | null
          price: number
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          lead_type?: string
          lead_type_id?: string | null
          price?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_pricing_defaults_lead_type_id_fkey"
            columns: ["lead_type_id"]
            isOneToOne: false
            referencedRelation: "lead_types"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_purchases: {
        Row: {
          amount_paid: number | null
          company_id: string | null
          id: string
          membership_id: string | null
          notes: string | null
          purchased_at: string | null
          quote_request_id: string | null
        }
        Insert: {
          amount_paid?: number | null
          company_id?: string | null
          id?: string
          membership_id?: string | null
          notes?: string | null
          purchased_at?: string | null
          quote_request_id?: string | null
        }
        Update: {
          amount_paid?: number | null
          company_id?: string | null
          id?: string
          membership_id?: string | null
          notes?: string | null
          purchased_at?: string | null
          quote_request_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lead_purchases_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "tree_service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_purchases_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_reassignments: {
        Row: {
          from_city: string
          id: string
          new_price: number
          notes: string | null
          original_price: number
          quote_request_id: string | null
          reassigned_at: string | null
          reassigned_by: string | null
          to_city: string
        }
        Insert: {
          from_city: string
          id?: string
          new_price: number
          notes?: string | null
          original_price: number
          quote_request_id?: string | null
          reassigned_at?: string | null
          reassigned_by?: string | null
          to_city: string
        }
        Update: {
          from_city?: string
          id?: string
          new_price?: number
          notes?: string | null
          original_price?: number
          quote_request_id?: string | null
          reassigned_at?: string | null
          reassigned_by?: string | null
          to_city?: string
        }
        Relationships: [
          {
            foreignKeyName: "lead_reassignments_quote_request_id_fkey"
            columns: ["quote_request_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "lead_reassignments_reassigned_by_fkey"
            columns: ["reassigned_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      lead_settings: {
        Row: {
          auto_notification_enabled: boolean | null
          created_at: string
          id: string
          shared_lead_max_purchases: number
          unclaimed_period_hours: number | null
          updated_at: string
        }
        Insert: {
          auto_notification_enabled?: boolean | null
          created_at?: string
          id?: string
          shared_lead_max_purchases?: number
          unclaimed_period_hours?: number | null
          updated_at?: string
        }
        Update: {
          auto_notification_enabled?: boolean | null
          created_at?: string
          id?: string
          shared_lead_max_purchases?: number
          unclaimed_period_hours?: number | null
          updated_at?: string
        }
        Relationships: []
      }
      lead_types: {
        Row: {
          created_at: string
          description: string | null
          id: string
          is_global: boolean | null
          name: string
          stripe_product_id: string | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          description?: string | null
          id?: string
          is_global?: boolean | null
          name: string
          stripe_product_id?: string | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          description?: string | null
          id?: string
          is_global?: boolean | null
          name?: string
          stripe_product_id?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      listing_comments: {
        Row: {
          comment: string
          created_at: string
          id: string
          is_approved: boolean
          listing_id: string
          user_identifier: string
        }
        Insert: {
          comment: string
          created_at?: string
          id?: string
          is_approved?: boolean
          listing_id: string
          user_identifier: string
        }
        Update: {
          comment?: string
          created_at?: string
          id?: string
          is_approved?: boolean
          listing_id?: string
          user_identifier?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_comments_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "haunted_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          created_at: string | null
          ghost_color: Database["public"]["Enums"]["ghost_color"]
          ghost_name: string
          id: string
          message: string
          session_id: string
        }
        Insert: {
          created_at?: string | null
          ghost_color: Database["public"]["Enums"]["ghost_color"]
          ghost_name: string
          id?: string
          message: string
          session_id: string
        }
        Update: {
          created_at?: string | null
          ghost_color?: Database["public"]["Enums"]["ghost_color"]
          ghost_name?: string
          id?: string
          message?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sharing_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      post_tags: {
        Row: {
          post_id: string
          tag_id: string
        }
        Insert: {
          post_id: string
          tag_id: string
        }
        Update: {
          post_id?: string
          tag_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_tags_post_id_fkey"
            columns: ["post_id"]
            isOneToOne: false
            referencedRelation: "blog_posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_tags_tag_id_fkey"
            columns: ["tag_id"]
            isOneToOne: false
            referencedRelation: "tags"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string | null
          id: string
          is_admin: boolean | null
          marketing_consent: boolean | null
          updated_at: string | null
          username: string | null
        }
        Insert: {
          created_at?: string
          email?: string | null
          id: string
          is_admin?: boolean | null
          marketing_consent?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Update: {
          created_at?: string
          email?: string | null
          id?: string
          is_admin?: boolean | null
          marketing_consent?: boolean | null
          updated_at?: string | null
          username?: string | null
        }
        Relationships: []
      }
      quote_requests: {
        Row: {
          address: string
          business_id: string | null
          created_at: string
          current_shares: number | null
          debris_hauling: boolean
          description: string | null
          email: string
          email_blast_types: string[] | null
          full_name: string
          id: string
          images: string[] | null
          is_archived: boolean | null
          last_reassigned_at: string | null
          lead_status: Database["public"]["Enums"]["lead_status"]
          lead_type: string | null
          max_shares: number | null
          original_city: string | null
          payment_link: string | null
          payment_status: string | null
          phone: string
          preferred_contact: string
          price: number | null
          priority_window_ends_at: string | null
          priority_window_started: boolean | null
          purchase_date: string | null
          reassignment_count: number | null
          service_type: string
          specific_date: string | null
          status: string
          timeframe: string
          tree_count: number
          tree_height: string
          unclaimed_notification_sent: boolean | null
          user_id: string | null
        }
        Insert: {
          address: string
          business_id?: string | null
          created_at?: string
          current_shares?: number | null
          debris_hauling: boolean
          description?: string | null
          email: string
          email_blast_types?: string[] | null
          full_name: string
          id?: string
          images?: string[] | null
          is_archived?: boolean | null
          last_reassigned_at?: string | null
          lead_status?: Database["public"]["Enums"]["lead_status"]
          lead_type?: string | null
          max_shares?: number | null
          original_city?: string | null
          payment_link?: string | null
          payment_status?: string | null
          phone: string
          preferred_contact: string
          price?: number | null
          priority_window_ends_at?: string | null
          priority_window_started?: boolean | null
          purchase_date?: string | null
          reassignment_count?: number | null
          service_type: string
          specific_date?: string | null
          status?: string
          timeframe: string
          tree_count: number
          tree_height: string
          unclaimed_notification_sent?: boolean | null
          user_id?: string | null
        }
        Update: {
          address?: string
          business_id?: string | null
          created_at?: string
          current_shares?: number | null
          debris_hauling?: boolean
          description?: string | null
          email?: string
          email_blast_types?: string[] | null
          full_name?: string
          id?: string
          images?: string[] | null
          is_archived?: boolean | null
          last_reassigned_at?: string | null
          lead_status?: Database["public"]["Enums"]["lead_status"]
          lead_type?: string | null
          max_shares?: number | null
          original_city?: string | null
          payment_link?: string | null
          payment_status?: string | null
          phone?: string
          preferred_contact?: string
          price?: number | null
          priority_window_ends_at?: string | null
          priority_window_started?: boolean | null
          purchase_date?: string | null
          reassignment_count?: number | null
          service_type?: string
          specific_date?: string | null
          status?: string
          timeframe?: string
          tree_count?: number
          tree_height?: string
          unclaimed_notification_sent?: boolean | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "quote_requests_business_id_fkey"
            columns: ["business_id"]
            isOneToOne: false
            referencedRelation: "tree_service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "quote_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      quotes: {
        Row: {
          author: string | null
          content: string
          created_at: string
          id: string
          image_url: string | null
        }
        Insert: {
          author?: string | null
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
        }
        Update: {
          author?: string | null
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
        }
        Relationships: []
      }
      shared_files: {
        Row: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          ghost_name: string | null
          id: string
          session_id: string
          uploaded_at: string | null
          uploaded_by: string
        }
        Insert: {
          file_name: string
          file_path: string
          file_size: number
          file_type: string
          ghost_name?: string | null
          id?: string
          session_id: string
          uploaded_at?: string | null
          uploaded_by: string
        }
        Update: {
          file_name?: string
          file_path?: string
          file_size?: number
          file_type?: string
          ghost_name?: string | null
          id?: string
          session_id?: string
          uploaded_at?: string | null
          uploaded_by?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_session"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sharing_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "shared_files_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "sharing_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      sharing_sessions: {
        Row: {
          created_at: string | null
          expires_at: string
          file_name: string | null
          file_size: number | null
          file_type: string | null
          file_url: string | null
          has_been_extended: boolean | null
          id: string
          initial_duration: unknown | null
          participant_count: number | null
          pin: string
          status: Database["public"]["Enums"]["session_status"] | null
          text_content: string | null
        }
        Insert: {
          created_at?: string | null
          expires_at: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          has_been_extended?: boolean | null
          id?: string
          initial_duration?: unknown | null
          participant_count?: number | null
          pin: string
          status?: Database["public"]["Enums"]["session_status"] | null
          text_content?: string | null
        }
        Update: {
          created_at?: string | null
          expires_at?: string
          file_name?: string | null
          file_size?: number | null
          file_type?: string | null
          file_url?: string | null
          has_been_extended?: boolean | null
          id?: string
          initial_duration?: unknown | null
          participant_count?: number | null
          pin?: string
          status?: Database["public"]["Enums"]["session_status"] | null
          text_content?: string | null
        }
        Relationships: []
      }
      suggestions: {
        Row: {
          content: string
          created_at: string
          id: string
          image_url: string | null
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          image_url?: string | null
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          image_url?: string | null
        }
        Relationships: []
      }
      tags: {
        Row: {
          created_at: string
          id: string
          name: string
        }
        Insert: {
          created_at?: string
          id?: string
          name: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
        }
        Relationships: []
      }
      tracking_code_usage: {
        Row: {
          company_id: string | null
          created_at: string | null
          device_identifier: string | null
          id: string
          ip_address: string | null
          lead_id: string | null
          used_at: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string | null
          device_identifier?: string | null
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          used_at?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string | null
          device_identifier?: string | null
          id?: string
          ip_address?: string | null
          lead_id?: string | null
          used_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tracking_code_usage_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "tree_service_companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tracking_code_usage_lead_id_fkey"
            columns: ["lead_id"]
            isOneToOne: false
            referencedRelation: "quote_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      tree_service_companies: {
        Row: {
          business_name: string
          business_statement: string | null
          city: string
          contact_email: string | null
          contact_phone: string | null
          created_at: string
          description: string | null
          feature_images: string[] | null
          featured_in_city: boolean | null
          gallery_images: string[] | null
          google_maps_url: string | null
          google_rating: number | null
          id: string
          is_featured: boolean | null
          is_verified: boolean | null
          last_tracking_code_use: string | null
          logo_url: string | null
          membership_id: string | null
          profile_image_url: string | null
          service_area: string[] | null
          state: string
          street_address: string | null
          tracking_code: string | null
          tracking_code_uses: number | null
          tracking_code_verified: boolean | null
          updated_at: string
          verification_status:
            | Database["public"]["Enums"]["business_verification_status"]
            | null
          website_url: string | null
          yelp_rating: number | null
          zip_code: string | null
        }
        Insert: {
          business_name: string
          business_statement?: string | null
          city: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          feature_images?: string[] | null
          featured_in_city?: boolean | null
          gallery_images?: string[] | null
          google_maps_url?: string | null
          google_rating?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          last_tracking_code_use?: string | null
          logo_url?: string | null
          membership_id?: string | null
          profile_image_url?: string | null
          service_area?: string[] | null
          state?: string
          street_address?: string | null
          tracking_code?: string | null
          tracking_code_uses?: number | null
          tracking_code_verified?: boolean | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["business_verification_status"]
            | null
          website_url?: string | null
          yelp_rating?: number | null
          zip_code?: string | null
        }
        Update: {
          business_name?: string
          business_statement?: string | null
          city?: string
          contact_email?: string | null
          contact_phone?: string | null
          created_at?: string
          description?: string | null
          feature_images?: string[] | null
          featured_in_city?: boolean | null
          gallery_images?: string[] | null
          google_maps_url?: string | null
          google_rating?: number | null
          id?: string
          is_featured?: boolean | null
          is_verified?: boolean | null
          last_tracking_code_use?: string | null
          logo_url?: string | null
          membership_id?: string | null
          profile_image_url?: string | null
          service_area?: string[] | null
          state?: string
          street_address?: string | null
          tracking_code?: string | null
          tracking_code_uses?: number | null
          tracking_code_verified?: boolean | null
          updated_at?: string
          verification_status?:
            | Database["public"]["Enums"]["business_verification_status"]
            | null
          website_url?: string | null
          yelp_rating?: number | null
          zip_code?: string | null
        }
        Relationships: []
      }
      user_votes: {
        Row: {
          emoji_tag: Database["public"]["Enums"]["emoji_tag"]
          id: string
          listing_id: string
          user_identifier: string
          voted_at: string
        }
        Insert: {
          emoji_tag: Database["public"]["Enums"]["emoji_tag"]
          id?: string
          listing_id: string
          user_identifier: string
          voted_at?: string
        }
        Update: {
          emoji_tag?: Database["public"]["Enums"]["emoji_tag"]
          id?: string
          listing_id?: string
          user_identifier?: string
          voted_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_votes_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "haunted_listings"
            referencedColumns: ["id"]
          },
        ]
      }
      video_transcripts: {
        Row: {
          created_at: string
          id: string
          transcript: Json
          updated_at: string
          video_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          transcript?: Json
          updated_at?: string
          video_id: string
        }
        Update: {
          created_at?: string
          id?: string
          transcript?: Json
          updated_at?: string
          video_id?: string
        }
        Relationships: []
      }
      videos: {
        Row: {
          created_at: string
          id: string
          tags: string[] | null
          thumbnail: string
          title: string
          topic: string | null
          transcript: string[] | null
          upload_date: string
          views: string | null
          youtube_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          tags?: string[] | null
          thumbnail: string
          title: string
          topic?: string | null
          transcript?: string[] | null
          upload_date: string
          views?: string | null
          youtube_id: string
        }
        Update: {
          created_at?: string
          id?: string
          tags?: string[] | null
          thumbnail?: string
          title?: string
          topic?: string | null
          transcript?: string[] | null
          upload_date?: string
          views?: string | null
          youtube_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      admin_login: {
        Args: {
          password: string
        }
        Returns: string
      }
      check_and_publish_posts: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      cleanup_expired_sessions: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
      create_admin_user: {
        Args: {
          email: string
          password: string
        }
        Returns: string
      }
      increment_vote_count: {
        Args: {
          p_listing_id: string
          p_emoji_tag: Database["public"]["Enums"]["emoji_tag"]
          p_user_identifier: string
        }
        Returns: boolean
      }
      make_user_admin: {
        Args: {
          user_id: string
        }
        Returns: undefined
      }
      reset_listing_votes: {
        Args: {
          p_listing_id: string
        }
        Returns: undefined
      }
      verify_admin_session: {
        Args: {
          session_id: string
        }
        Returns: boolean
      }
    }
    Enums: {
      business_verification_status: "unverified" | "pending" | "verified"
      emoji_tag:
        | "jump_scares"
        | "family_friendly"
        | "boozy"
        | "extreme_horror"
        | "outdoor"
        | "interactive"
        | "historical"
        | "classic_halloween"
        | "themed_experience"
        | "zombie_theme"
        | "paranormal_investigation"
        | "expensive"
        | "budget_friendly"
        | "sensory_friendly"
      ghost_color:
        | "#8B5CF6"
        | "#D946EF"
        | "#F97316"
        | "#0EA5E9"
        | "#1EAEDB"
        | "#0FA0CE"
      lead_status:
        | "new"
        | "assigned"
        | "contacted"
        | "converted"
        | "lost"
        | "pending_sale"
      session_status: "active" | "ended" | "expired"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
