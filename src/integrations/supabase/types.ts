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
      administradores: {
        Row: {
          ativo: boolean | null
          criado_em: string | null
          criado_por: string | null
          id: string
          nivel_acesso: string | null
          permissoes: Json | null
          usuario_id: string | null
        }
        Insert: {
          ativo?: boolean | null
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          nivel_acesso?: string | null
          permissoes?: Json | null
          usuario_id?: string | null
        }
        Update: {
          ativo?: boolean | null
          criado_em?: string | null
          criado_por?: string | null
          id?: string
          nivel_acesso?: string | null
          permissoes?: Json | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "administradores_criado_por_fkey"
            columns: ["criado_por"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "administradores_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      analises_roi: {
        Row: {
          aluguel_mensal: number | null
          atualizado_em: string | null
          criado_em: string | null
          dados_completos: Json | null
          despesas_mensais: number | null
          id: string
          roi_calculado: number | null
          status: string | null
          tipo_propriedade: string | null
          titulo: string
          usuario_id: string | null
          valor_entrada: number | null
          valor_imovel: number | null
        }
        Insert: {
          aluguel_mensal?: number | null
          atualizado_em?: string | null
          criado_em?: string | null
          dados_completos?: Json | null
          despesas_mensais?: number | null
          id?: string
          roi_calculado?: number | null
          status?: string | null
          tipo_propriedade?: string | null
          titulo: string
          usuario_id?: string | null
          valor_entrada?: number | null
          valor_imovel?: number | null
        }
        Update: {
          aluguel_mensal?: number | null
          atualizado_em?: string | null
          criado_em?: string | null
          dados_completos?: Json | null
          despesas_mensais?: number | null
          id?: string
          roi_calculado?: number | null
          status?: string | null
          tipo_propriedade?: string | null
          titulo?: string
          usuario_id?: string | null
          valor_entrada?: number | null
          valor_imovel?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "analises_roi_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      assinaturas: {
        Row: {
          atualizado_em: string | null
          auto_renovar: boolean | null
          criado_em: string | null
          data_fim: string | null
          data_inicio: string | null
          gateway_pagamento: string | null
          id: string
          metodo_pagamento: string | null
          moeda: string | null
          periodo: string | null
          plano: string
          preco: number | null
          status: string | null
          transaction_id: string | null
          usuario_id: string | null
        }
        Insert: {
          atualizado_em?: string | null
          auto_renovar?: boolean | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          gateway_pagamento?: string | null
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          periodo?: string | null
          plano: string
          preco?: number | null
          status?: string | null
          transaction_id?: string | null
          usuario_id?: string | null
        }
        Update: {
          atualizado_em?: string | null
          auto_renovar?: boolean | null
          criado_em?: string | null
          data_fim?: string | null
          data_inicio?: string | null
          gateway_pagamento?: string | null
          id?: string
          metodo_pagamento?: string | null
          moeda?: string | null
          periodo?: string | null
          plano?: string
          preco?: number | null
          status?: string | null
          transaction_id?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "assinaturas_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_conversations: {
        Row: {
          created_at: string | null
          id: string
          is_archived: boolean | null
          summary: string | null
          thread_id: string | null
          title: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          summary?: string | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          is_archived?: boolean | null
          summary?: string | null
          thread_id?: string | null
          title?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string | null
          id: string
          metadata: Json | null
          role: string | null
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string | null
          id?: string
          metadata?: Json | null
          role?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "chat_conversations"
            referencedColumns: ["id"]
          },
        ]
      }
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
      condo_prices: {
        Row: {
          average_price: number
          bathrooms: number
          bedrooms: number
          created_at: string | null
          id: string
          location: string
          name: string
          price_per_sqft: number
          updated_at: string | null
        }
        Insert: {
          average_price: number
          bathrooms: number
          bedrooms: number
          created_at?: string | null
          id?: string
          location: string
          name: string
          price_per_sqft: number
          updated_at?: string | null
        }
        Update: {
          average_price?: number
          bathrooms?: number
          bedrooms?: number
          created_at?: string | null
          id?: string
          location?: string
          name?: string
          price_per_sqft?: number
          updated_at?: string | null
        }
        Relationships: []
      }
      configuracoes_sistema: {
        Row: {
          atualizado_em: string | null
          categoria: string | null
          chave: string
          criado_em: string | null
          descricao: string | null
          editavel: boolean | null
          id: string
          tipo: string | null
          valor: string | null
        }
        Insert: {
          atualizado_em?: string | null
          categoria?: string | null
          chave: string
          criado_em?: string | null
          descricao?: string | null
          editavel?: boolean | null
          id?: string
          tipo?: string | null
          valor?: string | null
        }
        Update: {
          atualizado_em?: string | null
          categoria?: string | null
          chave?: string
          criado_em?: string | null
          descricao?: string | null
          editavel?: boolean | null
          id?: string
          tipo?: string | null
          valor?: string | null
        }
        Relationships: []
      }
      course_lessons: {
        Row: {
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          module_id: string | null
          order_index: number
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          module_id?: string | null
          order_index: number
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          module_id?: string | null
          order_index?: number
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_lessons_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "course_modules"
            referencedColumns: ["id"]
          },
        ]
      }
      course_modules: {
        Row: {
          course_id: string | null
          created_at: string | null
          description: string | null
          duration: string | null
          id: string
          order_index: number
          title: string
          updated_at: string | null
        }
        Insert: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          order_index: number
          title: string
          updated_at?: string | null
        }
        Update: {
          course_id?: string | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          id?: string
          order_index?: number
          title?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_modules_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      course_progress: {
        Row: {
          certificate_url: string | null
          completed_at: string | null
          course_id: string | null
          created_at: string | null
          id: string
          progress_percentage: number | null
          rating: number | null
          review: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          certificate_url?: string | null
          completed_at?: string | null
          course_id?: string | null
          created_at?: string | null
          id?: string
          progress_percentage?: number | null
          rating?: number | null
          review?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "course_progress_course_id_fkey"
            columns: ["course_id"]
            isOneToOne: false
            referencedRelation: "courses"
            referencedColumns: ["id"]
          },
        ]
      }
      courses: {
        Row: {
          category: string | null
          content: Json | null
          created_at: string | null
          description: string | null
          duration: string | null
          duration_minutes: number | null
          id: string
          instructor: string | null
          instructor_name: string | null
          level: string | null
          tags: string[] | null
          thumbnail_url: string | null
          title: string
          updated_at: string | null
          video_url: string | null
        }
        Insert: {
          category?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          instructor_name?: string | null
          level?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title: string
          updated_at?: string | null
          video_url?: string | null
        }
        Update: {
          category?: string | null
          content?: Json | null
          created_at?: string | null
          description?: string | null
          duration?: string | null
          duration_minutes?: number | null
          id?: string
          instructor?: string | null
          instructor_name?: string | null
          level?: string | null
          tags?: string[] | null
          thumbnail_url?: string | null
          title?: string
          updated_at?: string | null
          video_url?: string | null
        }
        Relationships: []
      }
      crm_leads: {
        Row: {
          assigned_to: string | null
          company: string | null
          created_at: string | null
          email: string | null
          id: string
          last_contact: string | null
          metadata: Json | null
          name: string
          next_follow_up: string | null
          notes: string | null
          phone: string | null
          pipeline_stage: string | null
          source: string | null
          status: string | null
          updated_at: string | null
          user_id: string | null
          value: number | null
        }
        Insert: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          metadata?: Json | null
          name: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Update: {
          assigned_to?: string | null
          company?: string | null
          created_at?: string | null
          email?: string | null
          id?: string
          last_contact?: string | null
          metadata?: Json | null
          name?: string
          next_follow_up?: string | null
          notes?: string | null
          phone?: string | null
          pipeline_stage?: string | null
          source?: string | null
          status?: string | null
          updated_at?: string | null
          user_id?: string | null
          value?: number | null
        }
        Relationships: []
      }
      investor_tips: {
        Row: {
          category: string | null
          created_at: string | null
          description: string | null
          difficulty: string | null
          estimated_savings: number | null
          id: string
          time_to_implement: string | null
          title: string
        }
        Insert: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_savings?: number | null
          id?: string
          time_to_implement?: string | null
          title: string
        }
        Update: {
          category?: string | null
          created_at?: string | null
          description?: string | null
          difficulty?: string | null
          estimated_savings?: number | null
          id?: string
          time_to_implement?: string | null
          title?: string
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
      lesson_progress: {
        Row: {
          completed: boolean | null
          created_at: string | null
          id: string
          last_watched: string | null
          lesson_id: string | null
          progress: number | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched?: string | null
          lesson_id?: string | null
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          completed?: boolean | null
          created_at?: string | null
          id?: string
          last_watched?: string | null
          lesson_id?: string | null
          progress?: number | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "lesson_progress_lesson_id_fkey"
            columns: ["lesson_id"]
            isOneToOne: false
            referencedRelation: "course_lessons"
            referencedColumns: ["id"]
          },
        ]
      }
      live_chat_messages: {
        Row: {
          created_at: string | null
          id: string
          message: string
          read_at: string | null
          sender_id: string | null
          sender_type: string | null
          session_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
          session_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          read_at?: string | null
          sender_id?: string | null
          sender_type?: string | null
          session_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "live_chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "live_chat_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      live_chat_sessions: {
        Row: {
          agent_id: string | null
          ended_at: string | null
          id: string
          metadata: Json | null
          satisfaction_rating: number | null
          started_at: string | null
          status: string | null
          user_id: string | null
        }
        Insert: {
          agent_id?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          satisfaction_rating?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Update: {
          agent_id?: string | null
          ended_at?: string | null
          id?: string
          metadata?: Json | null
          satisfaction_rating?: number | null
          started_at?: string | null
          status?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      logs_atividade: {
        Row: {
          acao: string
          criado_em: string | null
          detalhes: Json | null
          entidade: string | null
          entidade_id: string | null
          id: string
          ip_address: unknown | null
          user_agent: string | null
          usuario_id: string | null
        }
        Insert: {
          acao: string
          criado_em?: string | null
          detalhes?: Json | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Update: {
          acao?: string
          criado_em?: string | null
          detalhes?: Json | null
          entidade?: string | null
          entidade_id?: string | null
          id?: string
          ip_address?: unknown | null
          user_agent?: string | null
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "logs_atividade_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      market_insights: {
        Row: {
          created_at: string | null
          data_source: string | null
          description: string | null
          id: string
          priority: string | null
          title: string
          type: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          title: string
          type?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          data_source?: string | null
          description?: string | null
          id?: string
          priority?: string | null
          title?: string
          type?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      market_trends: {
        Row: {
          category: string | null
          description: string | null
          id: string
          impact: string | null
          percentage: number | null
          timeframe: string | null
          title: string
          updated_at: string | null
        }
        Insert: {
          category?: string | null
          description?: string | null
          id?: string
          impact?: string | null
          percentage?: number | null
          timeframe?: string | null
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string | null
          description?: string | null
          id?: string
          impact?: string | null
          percentage?: number | null
          timeframe?: string | null
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      metricas_diarias: {
        Row: {
          analises_realizadas: number | null
          criado_em: string | null
          data: string
          id: string
          novos_usuarios: number | null
          receita_dia: number | null
          taxa_conversao: number | null
          tickets_abertos: number | null
          tickets_fechados: number | null
          usuarios_ativos: number | null
        }
        Insert: {
          analises_realizadas?: number | null
          criado_em?: string | null
          data: string
          id?: string
          novos_usuarios?: number | null
          receita_dia?: number | null
          taxa_conversao?: number | null
          tickets_abertos?: number | null
          tickets_fechados?: number | null
          usuarios_ativos?: number | null
        }
        Update: {
          analises_realizadas?: number | null
          criado_em?: string | null
          data?: string
          id?: string
          novos_usuarios?: number | null
          receita_dia?: number | null
          taxa_conversao?: number | null
          tickets_abertos?: number | null
          tickets_fechados?: number | null
          usuarios_ativos?: number | null
        }
        Relationships: []
      }
      notificacoes_admin: {
        Row: {
          criado_em: string | null
          dados: Json | null
          id: string
          lida: boolean | null
          mensagem: string | null
          tipo: string
          titulo: string
          usuario_admin_id: string | null
        }
        Insert: {
          criado_em?: string | null
          dados?: Json | null
          id?: string
          lida?: boolean | null
          mensagem?: string | null
          tipo: string
          titulo: string
          usuario_admin_id?: string | null
        }
        Update: {
          criado_em?: string | null
          dados?: Json | null
          id?: string
          lida?: boolean | null
          mensagem?: string | null
          tipo?: string
          titulo?: string
          usuario_admin_id?: string | null
        }
        Relationships: []
      }
      properties: {
        Row: {
          address: string | null
          created_at: string | null
          id: string
          monthly_rent: number | null
          name: string
          status: string | null
          type: string
          updated_at: string | null
          user_id: string | null
          value: number
        }
        Insert: {
          address?: string | null
          created_at?: string | null
          id?: string
          monthly_rent?: number | null
          name: string
          status?: string | null
          type: string
          updated_at?: string | null
          user_id?: string | null
          value: number
        }
        Update: {
          address?: string | null
          created_at?: string | null
          id?: string
          monthly_rent?: number | null
          name?: string
          status?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string | null
          value?: number
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
      roi_analyses: {
        Row: {
          created_at: string | null
          data: Json | null
          id: string
          location: string
          monthly_rent: number
          property_type: string
          property_value: number
          roi_percentage: number
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          data?: Json | null
          id?: string
          location: string
          monthly_rent: number
          property_type: string
          property_value: number
          roi_percentage: number
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          data?: Json | null
          id?: string
          location?: string
          monthly_rent?: number
          property_type?: string
          property_value?: number
          roi_percentage?: number
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: []
      }
      support_tickets: {
        Row: {
          assigned_to: string | null
          category: string
          created_at: string | null
          description: string
          id: string
          last_message: string | null
          message_count: number | null
          priority: string | null
          status: string | null
          title: string
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          assigned_to?: string | null
          category: string
          created_at?: string | null
          description: string
          id?: string
          last_message?: string | null
          message_count?: number | null
          priority?: string | null
          status?: string | null
          title: string
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          assigned_to?: string | null
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          last_message?: string | null
          message_count?: number | null
          priority?: string | null
          status?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string | null
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
      ticket_messages: {
        Row: {
          attachments: Json | null
          created_at: string | null
          id: string
          is_internal: boolean | null
          message: string
          sender_id: string | null
          ticket_id: string | null
        }
        Insert: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Update: {
          attachments?: Json | null
          created_at?: string | null
          id?: string
          is_internal?: boolean | null
          message?: string
          sender_id?: string | null
          ticket_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ticket_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
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
      tickets_suporte: {
        Row: {
          atribuido_a: string | null
          atualizado_em: string | null
          categoria: string | null
          criado_em: string | null
          descricao: string
          id: string
          prioridade: string | null
          resolucao: string | null
          resolvido_em: string | null
          status: string | null
          titulo: string
          usuario_id: string | null
        }
        Insert: {
          atribuido_a?: string | null
          atualizado_em?: string | null
          categoria?: string | null
          criado_em?: string | null
          descricao: string
          id?: string
          prioridade?: string | null
          resolucao?: string | null
          resolvido_em?: string | null
          status?: string | null
          titulo: string
          usuario_id?: string | null
        }
        Update: {
          atribuido_a?: string | null
          atualizado_em?: string | null
          categoria?: string | null
          criado_em?: string | null
          descricao?: string
          id?: string
          prioridade?: string | null
          resolucao?: string | null
          resolvido_em?: string | null
          status?: string | null
          titulo?: string
          usuario_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tickets_suporte_atribuido_a_fkey"
            columns: ["atribuido_a"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tickets_suporte_usuario_id_fkey"
            columns: ["usuario_id"]
            isOneToOne: false
            referencedRelation: "usuarios"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          category: string
          created_at: string | null
          date: string
          description: string | null
          id: string
          property_id: string | null
          type: string
          user_id: string | null
        }
        Insert: {
          amount: number
          category: string
          created_at?: string | null
          date: string
          description?: string | null
          id?: string
          property_id?: string | null
          type: string
          user_id?: string | null
        }
        Update: {
          amount?: number
          category?: string
          created_at?: string | null
          date?: string
          description?: string | null
          id?: string
          property_id?: string | null
          type?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transactions_property_id_fkey"
            columns: ["property_id"]
            isOneToOne: false
            referencedRelation: "properties"
            referencedColumns: ["id"]
          },
        ]
      }
      user_profiles: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          email: string
          id: string
          last_access: string | null
          name: string | null
          plan: string | null
          revenue: number | null
          status: string | null
          total_analyses: number | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          email: string
          id: string
          last_access?: string | null
          name?: string | null
          plan?: string | null
          revenue?: number | null
          status?: string | null
          total_analyses?: number | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          email?: string
          id?: string
          last_access?: string | null
          name?: string | null
          plan?: string | null
          revenue?: number | null
          status?: string | null
          total_analyses?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      usuarios: {
        Row: {
          atualizado_em: string | null
          avatar_url: string | null
          criado_em: string | null
          data_ultimo_acesso: string | null
          email: string | null
          id: string
          limite_analises_mensal: number | null
          nome_completo: string | null
          observacoes: string | null
          origem_cadastro: string | null
          plano_ativo: boolean | null
          plano_expira_em: string | null
          plano_iniciado_em: string | null
          plano_tipo: string | null
          status: string | null
          telefone: string | null
          total_analises_realizadas: number | null
          updated_at: string | null
        }
        Insert: {
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          data_ultimo_acesso?: string | null
          email?: string | null
          id: string
          limite_analises_mensal?: number | null
          nome_completo?: string | null
          observacoes?: string | null
          origem_cadastro?: string | null
          plano_ativo?: boolean | null
          plano_expira_em?: string | null
          plano_iniciado_em?: string | null
          plano_tipo?: string | null
          status?: string | null
          telefone?: string | null
          total_analises_realizadas?: number | null
          updated_at?: string | null
        }
        Update: {
          atualizado_em?: string | null
          avatar_url?: string | null
          criado_em?: string | null
          data_ultimo_acesso?: string | null
          email?: string | null
          id?: string
          limite_analises_mensal?: number | null
          nome_completo?: string | null
          observacoes?: string | null
          origem_cadastro?: string | null
          plano_ativo?: boolean | null
          plano_expira_em?: string | null
          plano_iniciado_em?: string | null
          plano_tipo?: string | null
          status?: string | null
          telefone?: string | null
          total_analises_realizadas?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_course_progress: {
        Args: { course_id: string; user_id: string }
        Returns: number
      }
      get_academy_stats: {
        Args: Record<PropertyKey, never>
        Returns: {
          total_courses: number
          total_students: number
          total_completions: number
        }[]
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      sync_existing_users: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
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
