export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: { id: string; email: string | null; is_admin: boolean; created_at: string; updated_at: string };
        Insert: { id: string; email?: string | null; is_admin?: boolean; created_at?: string; updated_at?: string };
        Update: { id?: string; email?: string | null; is_admin?: boolean; created_at?: string; updated_at?: string };
      };
      coach_notes: {
        Row: { id: string; title: string; body: string; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; title: string; body: string; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; title?: string; body?: string; created_by?: string | null; created_at?: string; updated_at?: string };
      };
      player_goals: {
        Row: { id: string; player_id: string; role: string; description: string; progress: number; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; player_id: string; role: string; description: string; progress?: number; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; player_id?: string; role?: string; description?: string; progress?: number; created_by?: string | null; created_at?: string; updated_at?: string };
      };
      compositions: {
        Row: { id: string; name: string; type: string; picks: string[]; ratings: Json; created_by: string | null; created_at: string; updated_at: string };
        Insert: { id?: string; name: string; type: string; picks: string[]; ratings: Json; created_by?: string | null; created_at?: string; updated_at?: string };
        Update: { id?: string; name?: string; type?: string; picks?: string[]; ratings?: Json; created_by?: string | null; created_at?: string; updated_at?: string };
      };
    };
  };
}
