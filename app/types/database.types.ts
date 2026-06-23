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
      ibeia_clientes: {
        Row: {
          id: string
          nome: string
          email: string | null
          telefone: string | null
          empresa: string | null
          segmento: string | null
          origem: string | null
          status: string | null
          responsavel: string | null
          criado_em: string | null
          atualizado_em: string | null
        }
        Insert: {
          id?: string
          nome: string
          email?: string | null
          telefone?: string | null
          empresa?: string | null
          segmento?: string | null
          origem?: string | null
          status?: string | null
          responsavel?: string | null
          criado_em?: string | null
          atualizado_em?: string | null
        }
        Update: {
          id?: string
          nome?: string
          email?: string | null
          telefone?: string | null
          empresa?: string | null
          segmento?: string | null
          origem?: string | null
          status?: string | null
          responsavel?: string | null
          criado_em?: string | null
          atualizado_em?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ibeia_clientes_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      ibeia_propostas: {
        Row: {
          id: string
          cliente_nome: string
          cliente_empresa: string
          segmento: string | null
          dores: string
          escopo: string
          valor_estimado: string | null
          prazo_estimado: string | null
          contexto: string | null
          conteudo: string | null
          status: 'rascunho' | 'em_revisao' | 'aprovado' | 'enviado' | null
          criado_por: string
          criado_em: string | null
          atualizado_em: string | null
          responsavel: string | null
        }
        Insert: {
          id?: string
          cliente_nome: string
          cliente_empresa: string
          segmento?: string | null
          dores: string
          escopo: string
          valor_estimado?: string | null
          prazo_estimado?: string | null
          contexto?: string | null
          conteudo?: string | null
          status?: 'rascunho' | 'em_revisao' | 'aprovado' | 'enviado' | null
          criado_por: string
          criado_em?: string | null
          atualizado_em?: string | null
          responsavel?: string | null
        }
        Update: {
          id?: string
          cliente_nome?: string
          cliente_empresa?: string
          segmento?: string | null
          dores?: string
          escopo?: string
          valor_estimado?: string | null
          prazo_estimado?: string | null
          contexto?: string | null
          conteudo?: string | null
          status?: 'rascunho' | 'em_revisao' | 'aprovado' | 'enviado' | null
          criado_por?: string
          criado_em?: string | null
          atualizado_em?: string | null
          responsavel?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ibeia_propostas_responsavel_fkey"
            columns: ["responsavel"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          created_at: string
          updated_at: string
          papeis: Database["public"]["Enums"]["papel"][] | null
          ativo: boolean | null
          vertodoslead: boolean | null
        }
        Insert: {
          id: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          papeis?: Database["public"]["Enums"]["papel"][] | null
          ativo?: boolean | null
          vertodoslead?: boolean | null
        }
        Update: {
          id?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          created_at?: string
          updated_at?: string
          papeis?: Database["public"]["Enums"]["papel"][] | null
          ativo?: boolean | null
          vertodoslead?: boolean | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      ibeia_set_atualizado_em: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
      set_updated_at: {
        Args: Record<PropertyKey, never>
        Returns: unknown
      }
    }
    Enums: {
      papel: "Marketing" | "Comercial" | "Pré-vendas" | "Entrega" | "Customer Success" | "Financeiro" | "Administrativo" | "AdmDono"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
