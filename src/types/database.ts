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
      documents: {
        Row: {
          id: string
          user_id: string
          title: string
          original_text: string
          ambiguity_score: number
          highlights: Json
          categories: string[]
          suggestions: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          original_text: string
          ambiguity_score: number
          highlights: Json
          categories: string[]
          suggestions: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          original_text?: string
          ambiguity_score?: number
          highlights?: Json
          categories?: string[]
          suggestions?: string[]
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}
