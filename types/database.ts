// This file is auto-generated from your Supabase database schema
// Generate updated types by running: npx supabase gen types typescript --project-id YOUR_PROJECT_ID > types/database.ts

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      teammates: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          full_name: string
          email: string
          personal_email: string | null
          phone: string | null
          position: string
          department: 'Leadership' | 'Sales' | 'Operations'
          branch: string
          nmls: string | null
          start_date: string | null
          employment_date: string | null
          birthday_date: string | null
          onboarding_status: 'Not started' | 'In progress' | 'Done' | 'Offboard'
          headshot_url: string | null
          linkedin_url: string | null
          facebook_url: string | null
          instagram_url: string | null
          tiktok_url: string | null
          youtube_url: string | null
          calendly_link: string | null
          arive_link: string | null
          lead_link: string | null
          mortgage_matchup_url: string | null
          branch_id: number | null
          branch_name: string | null
          home_address: string | null
          laptop_manufacturer: string | null
          laptop_serial: string | null
          initial_office_password: string | null
          user_image_full_url: string | null
          manager_id: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name: string
          last_name: string
          email: string
          personal_email?: string | null
          phone?: string | null
          position: string
          department: 'Leadership' | 'Sales' | 'Operations'
          branch: string
          nmls?: string | null
          start_date?: string | null
          employment_date?: string | null
          birthday_date?: string | null
          onboarding_status?: 'Not started' | 'In progress' | 'Done' | 'Offboard'
          headshot_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          calendly_link?: string | null
          arive_link?: string | null
          lead_link?: string | null
          mortgage_matchup_url?: string | null
          branch_id?: number | null
          branch_name?: string | null
          home_address?: string | null
          laptop_manufacturer?: string | null
          laptop_serial?: string | null
          initial_office_password?: string | null
          user_image_full_url?: string | null
          manager_id?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          first_name?: string
          last_name?: string
          email?: string
          personal_email?: string | null
          phone?: string | null
          position?: string
          department?: 'Leadership' | 'Sales' | 'Operations'
          branch?: string
          nmls?: string | null
          start_date?: string | null
          employment_date?: string | null
          birthday_date?: string | null
          onboarding_status?: 'Not started' | 'In progress' | 'Done' | 'Offboard'
          headshot_url?: string | null
          linkedin_url?: string | null
          facebook_url?: string | null
          instagram_url?: string | null
          tiktok_url?: string | null
          youtube_url?: string | null
          calendly_link?: string | null
          arive_link?: string | null
          lead_link?: string | null
          mortgage_matchup_url?: string | null
          branch_id?: number | null
          branch_name?: string | null
          home_address?: string | null
          laptop_manufacturer?: string | null
          laptop_serial?: string | null
          initial_office_password?: string | null
          user_image_full_url?: string | null
          manager_id?: string | null
        }
      }
      teammate_tags: {
        Row: {
          id: string
          created_at: string
          teammate_id: string
          tag_name: string
          tag_color: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          teammate_id: string
          tag_name: string
          tag_color?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          teammate_id?: string
          tag_name?: string
          tag_color?: string | null
        }
      }
      licensed_states: {
        Row: {
          id: string
          state_code: string
          state_name: string
        }
        Insert: {
          id?: string
          state_code: string
          state_name: string
        }
        Update: {
          id?: string
          state_code?: string
          state_name?: string
        }
      }
      teammate_licensed_states: {
        Row: {
          id: string
          created_at: string
          teammate_id: string
          state_code: string
          license_number: string | null
          license_date: string | null
          expiration_date: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          teammate_id: string
          state_code: string
          license_number?: string | null
          license_date?: string | null
          expiration_date?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          teammate_id?: string
          state_code?: string
          license_number?: string | null
          license_date?: string | null
          expiration_date?: string | null
        }
      }
      teammate_documents: {
        Row: {
          id: string
          created_at: string
          teammate_id: string
          document_type: 'headshot' | 'work_with_me' | 'license' | 'certification' | 'other'
          file_url: string
          file_name: string
          file_size: number | null
          mime_type: string | null
          uploaded_by: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          teammate_id: string
          document_type: 'headshot' | 'work_with_me' | 'license' | 'certification' | 'other'
          file_url: string
          file_name: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          teammate_id?: string
          document_type?: 'headshot' | 'work_with_me' | 'license' | 'certification' | 'other'
          file_url?: string
          file_name?: string
          file_size?: number | null
          mime_type?: string | null
          uploaded_by?: string | null
        }
      }
      client_reviews: {
        Row: {
          id: string
          created_at: string
          teammate_id: string
          client_name: string
          review_text: string
          rating: number
          review_date: string | null
          is_featured: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          teammate_id: string
          client_name: string
          review_text: string
          rating: number
          review_date?: string | null
          is_featured?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          teammate_id?: string
          client_name?: string
          review_text?: string
          rating?: number
          review_date?: string | null
          is_featured?: boolean
        }
      }
      onboarding_tasks: {
        Row: {
          id: string
          created_at: string
          task_name: string
          task_description: string | null
          task_category: string | null
          task_order: number | null
          is_required: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          task_name: string
          task_description?: string | null
          task_category?: string | null
          task_order?: number | null
          is_required?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          task_name?: string
          task_description?: string | null
          task_category?: string | null
          task_order?: number | null
          is_required?: boolean
        }
      }
      teammate_onboarding_progress: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          teammate_id: string
          task_id: string
          status: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at: string | null
          notes: string | null
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          teammate_id: string
          task_id: string
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at?: string | null
          notes?: string | null
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          teammate_id?: string
          task_id?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'skipped'
          completed_at?: string | null
          notes?: string | null
        }
      }
    }
    Views: {
      teammates_with_manager_info: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          first_name: string
          last_name: string
          full_name: string
          email: string
          position: string
          department: string
          branch: string
          manager_name: string | null
          manager_email: string | null
          // ... (includes all teammate fields)
        }
      }
      teammate_full_profile: {
        Row: {
          id: string
          full_name: string
          tag_count: number
          licensed_state_count: number
          document_count: number
          review_count: number
          average_rating: number | null
          // ... (includes all teammate fields)
        }
      }
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}
