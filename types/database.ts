export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          is_admin: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          is_admin?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      coach_notes: {
        Row: {
          id: string;
          title: string;
          body: string;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          body: string;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          title?: string;
          body?: string;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      player_goals: {
        Row: {
          id: string;
          player_id: string;
          role: string;
          description: string;
          progress: number;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          player_id: string;
          role: string;
          description: string;
          progress?: number;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          player_id?: string;
          role?: string;
          description?: string;
          progress?: number;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      compositions: {
        Row: {
          id: string;
          name: string;
          type: string;
          picks: string[];
          ratings: Json;
          created_by: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          type: string;
          picks: string[];
          ratings: Json;
          created_by: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          type?: string;
          picks?: string[];
          ratings?: Json;
          created_by?: string;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      riot_matches: {
        Row: {
          match_id: string;
          queue_id: number | null;
          game_mode: string | null;
          game_type: string | null;
          game_version: string | null;
          game_start_time: string | null;
          game_end_time: string | null;
          game_duration_seconds: number;
          imported_at: string;
        };
        Insert: {
          match_id: string;
          queue_id?: number | null;
          game_mode?: string | null;
          game_type?: string | null;
          game_version?: string | null;
          game_start_time?: string | null;
          game_end_time?: string | null;
          game_duration_seconds?: number;
          imported_at?: string;
        };
        Update: {
          match_id?: string;
          queue_id?: number | null;
          game_mode?: string | null;
          game_type?: string | null;
          game_version?: string | null;
          game_start_time?: string | null;
          game_end_time?: string | null;
          game_duration_seconds?: number;
          imported_at?: string;
        };
        Relationships: [];
      };
      riot_player_matches: {
        Row: {
          id: number;
          match_id: string;
          puuid: string;
          riot_id: string;
          roster_role: string;
          participant_id: number | null;
          team_id: number | null;
          champion_id: number | null;
          champion_name: string | null;
          team_position: string | null;
          win: boolean;
          kills: number;
          deaths: number;
          assists: number;
          total_minions_killed: number;
          neutral_minions_killed: number;
          gold_earned: number;
          vision_score: number;
          total_damage_dealt_to_champions: number;
          damage_dealt_to_objectives: number;
          time_played_seconds: number;
          created_at: string;
        };
        Insert: {
          id?: number;
          match_id: string;
          puuid: string;
          riot_id: string;
          roster_role: string;
          participant_id?: number | null;
          team_id?: number | null;
          champion_id?: number | null;
          champion_name?: string | null;
          team_position?: string | null;
          win: boolean;
          kills?: number;
          deaths?: number;
          assists?: number;
          total_minions_killed?: number;
          neutral_minions_killed?: number;
          gold_earned?: number;
          vision_score?: number;
          total_damage_dealt_to_champions?: number;
          damage_dealt_to_objectives?: number;
          time_played_seconds?: number;
          created_at?: string;
        };
        Update: {
          id?: number;
          match_id?: string;
          puuid?: string;
          riot_id?: string;
          roster_role?: string;
          participant_id?: number | null;
          team_id?: number | null;
          champion_id?: number | null;
          champion_name?: string | null;
          team_position?: string | null;
          win?: boolean;
          kills?: number;
          deaths?: number;
          assists?: number;
          total_minions_killed?: number;
          neutral_minions_killed?: number;
          gold_earned?: number;
          vision_score?: number;
          total_damage_dealt_to_champions?: number;
          damage_dealt_to_objectives?: number;
          time_played_seconds?: number;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "riot_player_matches_match_id_fkey";
            columns: ["match_id"];
            isOneToOne: false;
            referencedRelation: "riot_matches";
            referencedColumns: ["match_id"];
          },
        ];
      };
    };
    Views: {};
    Functions: {
      is_admin: {
        Args: Record<string, never>;
        Returns: boolean;
      };
    };
    Enums: {};
    CompositeTypes: {};
  };
};