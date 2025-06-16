/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2025 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

/**
 * ========================================
 * ARCA AI - ROI ANALYSIS PLATFORM
 * ========================================
 * 
 * Copyright (c) 2024 JimmyDev
 * All rights reserved.
 * 
 * PROPRIETARY AND CONFIDENTIAL
 * This file contains proprietary code developed by JimmyDev.
 * Unauthorized copying, distribution, or use is strictly prohibited.
 * 
 * Developed by: JimmyDev
 * ========================================
 */

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
      comissoes: {
        Row: {
          cliente_nome: string | null
          created_at: string
          data: string
          data_pagamento: string | null
          descricao: string
          id: string
          imovel_endereco: string | null
          observacoes: string | null
          status: string
          user_id: string | null
          valor: number
        }
        Insert: {
          cliente_nome?: string | null
          created_at?: string
          data?: string
          data_pagamento?: string | null
          descricao: string
          id?: string
          imovel_endereco?: string | null
          observacoes?: string | null
          status?: string
          user_id?: string | null
          valor: number
        }
        Update: {
          cliente_nome?: string | null
          created_at?: string
          data?: string
          data_pagamento?: string | null
          descricao?: string
          id?: string
          imovel_endereco?: string | null
          observacoes?: string | null
          status?: string
          user_id?: string | null
          valor?: number
        }
        Relationships: []
      }
      leads: {
        Row: {
          data_criacao: string
          email: string | null
          fonte: string | null
          id: string
          nome: string
          status: Database["public"]["Enums"]["lead_status"] | null
          telefone: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          data_criacao?: string
          email?: string | null
          fonte?: string | null
          id?: string
          nome: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Update: {
          data_criacao?: string
          email?: string | null
          fonte?: string | null
          id?: string
          nome?: string
          status?: Database["public"]["Enums"]["lead_status"] | null
          telefone?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      roi_analises: {
        Row: {
          condominio: string
          criado_em: string
          entrada_percentual: number | null
          entrada_valor: number | null
          expira_em: string
          id: string
          localizacao: string
          logo_storage_url: string | null
          modelo: string
          piscina: boolean
          quartos: number
          resultado_texto: string | null
          tipo_investimento: string
          user_id: string
          valor_imovel: number
        }
        Insert: {
          condominio: string
          criado_em?: string
          entrada_percentual?: number | null
          entrada_valor?: number | null
          expira_em?: string
          id?: string
          localizacao: string
          logo_storage_url?: string | null
          modelo: string
          piscina?: boolean
          quartos: number
          resultado_texto?: string | null
          tipo_investimento: string
          user_id: string
          valor_imovel: number
        }
        Update: {
          condominio?: string
          criado_em?: string
          entrada_percentual?: number | null
          entrada_valor?: number | null
          expira_em?: string
          id?: string
          localizacao?: string
          logo_storage_url?: string | null
          modelo?: string
          piscina?: boolean
          quartos?: number
          resultado_texto?: string | null
          tipo_investimento?: string
          user_id?: string
          valor_imovel?: number
        }
        Relationships: []
      }
      ticket_mensagens: {
        Row: {
          conteudo: string
          created_at: string
          id: string
          lida: boolean
          remetente_id: string
          ticket_id: string
          timestamp: string
          tipo_remetente: string
        }
        Insert: {
          conteudo: string
          created_at?: string
          id?: string
          lida?: boolean
          remetente_id: string
          ticket_id: string
          timestamp?: string
          tipo_remetente: string
        }
        Update: {
          conteudo?: string
          created_at?: string
          id?: string
          lida?: boolean
          remetente_id?: string
          ticket_id?: string
          timestamp?: string
          tipo_remetente?: string
        }
        Relationships: [
          {
            foreignKeyName: "ticket_mensagens_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      tickets: {
        Row: {
          assunto: string
          created_at: string
          data_abertura: string
          id: string
          prioridade: string
          status: string
          ultima_atualizacao: string
          user_id: string
        }
        Insert: {
          assunto: string
          created_at?: string
          data_abertura?: string
          id?: string
          prioridade?: string
          status?: string
          ultima_atualizacao?: string
          user_id: string
        }
        Update: {
          assunto?: string
          created_at?: string
          data_abertura?: string
          id?: string
          prioridade?: string
          status?: string
          ultima_atualizacao?: string
          user_id?: string
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          atualizado_em: string | null
          avatar_url: string | null
          criado_em: string | null
          email: string | null
          id: string
          nome_completo: string | null
        }
        Insert: {
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          email?: string | null
          id: string
          nome_completo?: string | null
        }
        Update: {
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          email?: string | null
          id?: string
          nome_completo?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      lead_status:
        | "Novo"
        | "Contatado"
        | "Qualificado"
        | "Proposta Enviada"
        | "Negociação"
        | "Fechado"
        | "Perdido"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      lead_status: [
        "Novo",
        "Contatado",
        "Qualificado",
        "Proposta Enviada",
        "Negociação",
        "Fechado",
        "Perdido",
      ],
    },
  },
} as const
