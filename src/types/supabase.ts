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
      apartments: {
        Row: {
          id: string
          apt_number: string
          created_at: string
        }
        Insert: {
          id: string
          apt_number: string
          created_at?: string
        }
        Update: {
          id?: string
          apt_number?: string
          created_at?: string
        }
      }
      reservations: {
        Row: {
          id: string
          apt_number: string
          reserved_timeslot: string
          created_at: string
        }
        Insert: {
          id: string
          apt_number: string
          reserved_timeslot: string
          created_at?: string
        }
        Update: {
          id?: string
          apt_number?: string
          reserved_timeslot?: string
          created_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
} 