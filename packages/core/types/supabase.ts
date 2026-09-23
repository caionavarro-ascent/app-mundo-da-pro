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
      acesso: {
        Row: {
          assinatura_externa: string | null
          atualizado_em: string
          expira_em: string | null
          id: string
          inicio_em: string
          origem: string
          pedido_externo: string | null
          produto_id: string
          renova_automatico: boolean
          status: string
          user_id: string
        }
        Insert: {
          assinatura_externa?: string | null
          atualizado_em?: string
          expira_em?: string | null
          id?: string
          inicio_em?: string
          origem?: string
          pedido_externo?: string | null
          produto_id: string
          renova_automatico?: boolean
          status?: string
          user_id: string
        }
        Update: {
          assinatura_externa?: string | null
          atualizado_em?: string
          expira_em?: string | null
          id?: string
          inicio_em?: string
          origem?: string
          pedido_externo?: string | null
          produto_id?: string
          renova_automatico?: boolean
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "acesso_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
        ]
      }
      comentario: {
        Row: {
          criado_em: string
          id: string
          mensagem: string
          nome: string | null
          sequencia_id: string
          status: string
          user_id: string | null
        }
        Insert: {
          criado_em?: string
          id?: string
          mensagem: string
          nome?: string | null
          sequencia_id: string
          status?: string
          user_id?: string | null
        }
        Update: {
          criado_em?: string
          id?: string
          mensagem?: string
          nome?: string | null
          sequencia_id?: string
          status?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "comentario_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "comentario_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      configuracoes: {
        Row: {
          chave: string
          descricao: string | null
          valor: NonNullable<Json>
        }
        Insert: {
          chave: string
          descricao?: string | null
          valor: NonNullable<Json>
        }
        Update: {
          chave?: string
          descricao?: string | null
          valor?: NonNullable<Json>
        }
        Relationships: []
      }
      destaques: {
        Row: {
          apoio: string | null
          arte_path: string | null
          ativo: boolean
          criado_em: string
          cta_primario: string
          id: string
          inicia_em: string | null
          material_id: string | null
          prioridade: number
          produto_id: string | null
          regra: Database["public"]["Enums"]["regra_destaque"]
          regra_produto: string | null
          termina_em: string | null
          titulo: string
        }
        Insert: {
          apoio?: string | null
          arte_path?: string | null
          ativo?: boolean
          criado_em?: string
          cta_primario?: string
          id?: string
          inicia_em?: string | null
          material_id?: string | null
          prioridade?: number
          produto_id?: string | null
          regra?: Database["public"]["Enums"]["regra_destaque"]
          regra_produto?: string | null
          termina_em?: string | null
          titulo: string
        }
        Update: {
          apoio?: string | null
          arte_path?: string | null
          ativo?: boolean
          criado_em?: string
          cta_primario?: string
          id?: string
          inicia_em?: string | null
          material_id?: string | null
          prioridade?: number
          produto_id?: string | null
          regra?: Database["public"]["Enums"]["regra_destaque"]
          regra_produto?: string | null
          termina_em?: string | null
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "destaques_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destaques_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "destaques_regra_produto_fkey"
            columns: ["regra_produto"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      dispositivos: {
        Row: {
          ativo: boolean
          criado_em: string
          id: string
          modelo: string | null
          plataforma: string
          push_token: string
          user_id: string
          versao_app: string | null
          visto_em: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          id?: string
          modelo?: string | null
          plataforma: string
          push_token: string
          user_id: string
          versao_app?: string | null
          visto_em?: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          id?: string
          modelo?: string | null
          plataforma?: string
          push_token?: string
          user_id?: string
          versao_app?: string | null
          visto_em?: string
        }
        Relationships: [
          {
            foreignKeyName: "dispositivos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      download_log: {
        Row: {
          arquivo_id: string | null
          criado_em: string
          id: string
          ip: string | null
          sequencia_id: string | null
          user_agent: string | null
          user_id: string | null
        }
        Insert: {
          arquivo_id?: string | null
          criado_em?: string
          id?: string
          ip?: string | null
          sequencia_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Update: {
          arquivo_id?: string | null
          criado_em?: string
          id?: string
          ip?: string | null
          sequencia_id?: string | null
          user_agent?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "download_log_arquivo_id_fkey"
            columns: ["arquivo_id"]
            referencedRelation: "sequencia_arquivo"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_log_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "download_log_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      downloads: {
        Row: {
          criado_em: string
          id: string
          ip: unknown
          marca_dagua: string
          material_id: string
          plataforma: string | null
          user_id: string
        }
        Insert: {
          criado_em?: string
          id?: string
          ip?: unknown
          marca_dagua: string
          material_id: string
          plataforma?: string | null
          user_id: string
        }
        Update: {
          criado_em?: string
          id?: string
          ip?: unknown
          marca_dagua?: string
          material_id?: string
          plataforma?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "downloads_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "downloads_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      entitlements: {
        Row: {
          concedido_em: string
          expira_em: string | null
          id: string
          motivo_revogacao: string | null
          origem: Database["public"]["Enums"]["origem_acesso"]
          pedido_externo: string | null
          produto_id: string
          revogado_em: string | null
          user_id: string
        }
        Insert: {
          concedido_em?: string
          expira_em?: string | null
          id?: string
          motivo_revogacao?: string | null
          origem?: Database["public"]["Enums"]["origem_acesso"]
          pedido_externo?: string | null
          produto_id: string
          revogado_em?: string | null
          user_id: string
        }
        Update: {
          concedido_em?: string
          expira_em?: string | null
          id?: string
          motivo_revogacao?: string | null
          origem?: Database["public"]["Enums"]["origem_acesso"]
          pedido_externo?: string | null
          produto_id?: string
          revogado_em?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "entitlements_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "entitlements_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      eventos: {
        Row: {
          criado_em: string
          dados: Json | null
          id: number
          material_id: string | null
          plataforma: string | null
          produto_id: string | null
          tipo: string
          user_id: string | null
          versao_app: string | null
        }
        Insert: {
          criado_em?: string
          dados?: Json | null
          id?: number
          material_id?: string | null
          plataforma?: string | null
          produto_id?: string | null
          tipo: string
          user_id?: string | null
          versao_app?: string | null
        }
        Update: {
          criado_em?: string
          dados?: Json | null
          id?: number
          material_id?: string | null
          plataforma?: string | null
          produto_id?: string | null
          tipo?: string
          user_id?: string | null
          versao_app?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "eventos_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "eventos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      favorito: {
        Row: {
          criado_em: string
          sequencia_id: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          sequencia_id: string
          user_id: string
        }
        Update: {
          criado_em?: string
          sequencia_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorito_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorito_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      favoritos: {
        Row: {
          criado_em: string
          material_id: string
          user_id: string
        }
        Insert: {
          criado_em?: string
          material_id: string
          user_id: string
        }
        Update: {
          criado_em?: string
          material_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favoritos_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favoritos_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      habilidades: {
        Row: {
          id: string
          nome: string
          slug: string
        }
        Insert: {
          id?: string
          nome: string
          slug: string
        }
        Update: {
          id?: string
          nome?: string
          slug?: string
        }
        Relationships: []
      }
      jose_acesso_log: {
        Row: {
          email: string | null
          id: number
          ip: string | null
          liberado: boolean
          tentado_em: string
          user_agent: string | null
        }
        Insert: {
          email?: string | null
          id?: number
          ip?: string | null
          liberado: boolean
          tentado_em?: string
          user_agent?: string | null
        }
        Update: {
          email?: string | null
          id?: number
          ip?: string | null
          liberado?: boolean
          tentado_em?: string
          user_agent?: string | null
        }
        Relationships: []
      }
      jose_comprador: {
        Row: {
          atualizado_em: string
          criado_em: string
          email: string
          id: string
          nome: string | null
          origem: string
          produto_codigo: string
          produto_id_externo: string | null
          produto_nome: string | null
          revisar: boolean
          status: string
          telefone: string | null
          transacao_id: string | null
          valor_centavos: number | null
        }
        Insert: {
          atualizado_em?: string
          criado_em?: string
          email: string
          id?: string
          nome?: string | null
          origem?: string
          produto_codigo?: string
          produto_id_externo?: string | null
          produto_nome?: string | null
          revisar?: boolean
          status?: string
          telefone?: string | null
          transacao_id?: string | null
          valor_centavos?: number | null
        }
        Update: {
          atualizado_em?: string
          criado_em?: string
          email?: string
          id?: string
          nome?: string | null
          origem?: string
          produto_codigo?: string
          produto_id_externo?: string | null
          produto_nome?: string | null
          revisar?: boolean
          status?: string
          telefone?: string | null
          transacao_id?: string | null
          valor_centavos?: number | null
        }
        Relationships: []
      }
      jose_webhook_log: {
        Row: {
          autorizado: boolean | null
          email: string | null
          erro: string | null
          evento: string | null
          id: number
          payload: NonNullable<Json>
          recebido_em: string
        }
        Insert: {
          autorizado?: boolean | null
          email?: string | null
          erro?: string | null
          evento?: string | null
          id?: number
          payload: NonNullable<Json>
          recebido_em?: string
        }
        Update: {
          autorizado?: boolean | null
          email?: string | null
          erro?: string | null
          evento?: string | null
          id?: number
          payload?: NonNullable<Json>
          recebido_em?: string
        }
        Relationships: []
      }
      materiais: {
        Row: {
          anos: Database["public"]["Enums"]["ano_escolar"][]
          arquivo_path: string | null
          arte_destaque_path: string | null
          atualizado_em: string
          capa_path: string | null
          criado_em: string
          descricao: string | null
          gratuito: boolean
          habilidade_id: string | null
          id: string
          niveis: Database["public"]["Enums"]["nivel_escrita"][]
          paginas: number | null
          passos: string[] | null
          preview_paths: string[] | null
          publicado_em: string | null
          publicar_em: string | null
          slug: string
          status: Database["public"]["Enums"]["status_material"]
          sugestao_ia: Json | null
          texto_extraido: string | null
          tipo: Database["public"]["Enums"]["tipo_material"] | null
          titulo: string
          url_externa: string | null
          video_url: string | null
        }
        Insert: {
          anos?: Database["public"]["Enums"]["ano_escolar"][]
          arquivo_path?: string | null
          arte_destaque_path?: string | null
          atualizado_em?: string
          capa_path?: string | null
          criado_em?: string
          descricao?: string | null
          gratuito?: boolean
          habilidade_id?: string | null
          id?: string
          niveis?: Database["public"]["Enums"]["nivel_escrita"][]
          paginas?: number | null
          passos?: string[] | null
          preview_paths?: string[] | null
          publicado_em?: string | null
          publicar_em?: string | null
          slug: string
          status?: Database["public"]["Enums"]["status_material"]
          sugestao_ia?: Json | null
          texto_extraido?: string | null
          tipo?: Database["public"]["Enums"]["tipo_material"] | null
          titulo: string
          url_externa?: string | null
          video_url?: string | null
        }
        Update: {
          anos?: Database["public"]["Enums"]["ano_escolar"][]
          arquivo_path?: string | null
          arte_destaque_path?: string | null
          atualizado_em?: string
          capa_path?: string | null
          criado_em?: string
          descricao?: string | null
          gratuito?: boolean
          habilidade_id?: string | null
          id?: string
          niveis?: Database["public"]["Enums"]["nivel_escrita"][]
          paginas?: number | null
          passos?: string[] | null
          preview_paths?: string[] | null
          publicado_em?: string | null
          publicar_em?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["status_material"]
          sugestao_ia?: Json | null
          texto_extraido?: string | null
          tipo?: Database["public"]["Enums"]["tipo_material"] | null
          titulo?: string
          url_externa?: string | null
          video_url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "materiais_habilidade_id_fkey"
            columns: ["habilidade_id"]
            referencedRelation: "habilidades"
            referencedColumns: ["id"]
          },
        ]
      }
      material_produto: {
        Row: {
          material_id: string
          produto_id: string
        }
        Insert: {
          material_id: string
          produto_id: string
        }
        Update: {
          material_id?: string
          produto_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "material_produto_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "material_produto_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      perfil: {
        Row: {
          criado_em: string
          e_admin: boolean
          email: string
          id: string
          nome: string | null
          whatsapp: string | null
        }
        Insert: {
          criado_em?: string
          e_admin?: boolean
          email: string
          id: string
          nome?: string | null
          whatsapp?: string | null
        }
        Update: {
          criado_em?: string
          e_admin?: boolean
          email?: string
          id?: string
          nome?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      perfis: {
        Row: {
          anonimizado: boolean
          criado_em: string
          email: string
          excluido_em: string | null
          id: string
          nome: string | null
          papel: Database["public"]["Enums"]["papel_usuario"]
          visto_em: string | null
          whatsapp: string | null
        }
        Insert: {
          anonimizado?: boolean
          criado_em?: string
          email: string
          excluido_em?: string | null
          id: string
          nome?: string | null
          papel?: Database["public"]["Enums"]["papel_usuario"]
          visto_em?: string | null
          whatsapp?: string | null
        }
        Update: {
          anonimizado?: boolean
          criado_em?: string
          email?: string
          excluido_em?: string | null
          id?: string
          nome?: string | null
          papel?: Database["public"]["Enums"]["papel_usuario"]
          visto_em?: string | null
          whatsapp?: string | null
        }
        Relationships: []
      }
      plano_semana: {
        Row: {
          dia: string
          id: string
          material_id: string
          ordem: number
          turma_id: string
        }
        Insert: {
          dia: string
          id?: string
          material_id: string
          ordem?: number
          turma_id: string
        }
        Update: {
          dia?: string
          id?: string
          material_id?: string
          ordem?: number
          turma_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "plano_semana_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "plano_semana_turma_id_fkey"
            columns: ["turma_id"]
            referencedRelation: "turmas"
            referencedColumns: ["id"]
          },
        ]
      }
      preferencias_push: {
        Row: {
          acesso_vencendo: boolean
          campanha: boolean
          material_novo: boolean
          novidade_geral: boolean
          user_id: string
        }
        Insert: {
          acesso_vencendo?: boolean
          campanha?: boolean
          material_novo?: boolean
          novidade_geral?: boolean
          user_id: string
        }
        Update: {
          acesso_vencendo?: boolean
          campanha?: boolean
          material_novo?: boolean
          novidade_geral?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "preferencias_push_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      produto: {
        Row: {
          ativo: boolean
          criado_em: string
          duracao_dias: number
          id: string
          lp_url: string | null
          nome: string
          the_members_product_id: string | null
          tipo: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          duracao_dias?: number
          id?: string
          lp_url?: string | null
          nome: string
          the_members_product_id?: string | null
          tipo: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          duracao_dias?: number
          id?: string
          lp_url?: string | null
          nome?: string
          the_members_product_id?: string | null
          tipo?: string
        }
        Relationships: []
      }
      produto_sequencia: {
        Row: {
          produto_id: string
          sequencia_id: string
        }
        Insert: {
          produto_id: string
          sequencia_id: string
        }
        Update: {
          produto_id?: string
          sequencia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "produto_sequencia_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produto"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_sequencia_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "produto_sequencia_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      produtos: {
        Row: {
          acesso_dias: number | null
          ativo: boolean
          autora: string | null
          beneficios: string[] | null
          checkout_url: string | null
          cor: string | null
          criado_em: string
          externo_themembers: string[] | null
          externo_woo: string[] | null
          id: string
          is_combo: boolean
          nome: string
          ordem_vitrine: number
          parcelas_texto: string | null
          pitch_para_que: string | null
          pitch_para_quem: string | null
          preco_centavos: number
          slug: string
          sugerido_apos: string[] | null
        }
        Insert: {
          acesso_dias?: number | null
          ativo?: boolean
          autora?: string | null
          beneficios?: string[] | null
          checkout_url?: string | null
          cor?: string | null
          criado_em?: string
          externo_themembers?: string[] | null
          externo_woo?: string[] | null
          id?: string
          is_combo?: boolean
          nome: string
          ordem_vitrine?: number
          parcelas_texto?: string | null
          pitch_para_que?: string | null
          pitch_para_quem?: string | null
          preco_centavos?: number
          slug: string
          sugerido_apos?: string[] | null
        }
        Update: {
          acesso_dias?: number | null
          ativo?: boolean
          autora?: string | null
          beneficios?: string[] | null
          checkout_url?: string | null
          cor?: string | null
          criado_em?: string
          externo_themembers?: string[] | null
          externo_woo?: string[] | null
          id?: string
          is_combo?: boolean
          nome?: string
          ordem_vitrine?: number
          parcelas_texto?: string | null
          pitch_para_que?: string | null
          pitch_para_quem?: string | null
          preco_centavos?: number
          slug?: string
          sugerido_apos?: string[] | null
        }
        Relationships: []
      }
      push_envios: {
        Row: {
          agendado_em: string | null
          corpo: string
          criado_em: string
          criado_por: string | null
          destinatarios: number | null
          enviado_em: string | null
          id: string
          material_id: string | null
          produto_id: string | null
          segmento: Json | null
          tipo: string
          titulo: string
        }
        Insert: {
          agendado_em?: string | null
          corpo: string
          criado_em?: string
          criado_por?: string | null
          destinatarios?: number | null
          enviado_em?: string | null
          id?: string
          material_id?: string | null
          produto_id?: string | null
          segmento?: Json | null
          tipo: string
          titulo: string
        }
        Update: {
          agendado_em?: string | null
          corpo?: string
          criado_em?: string
          criado_por?: string | null
          destinatarios?: number | null
          enviado_em?: string | null
          id?: string
          material_id?: string | null
          produto_id?: string | null
          segmento?: Json | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "push_envios_criado_por_fkey"
            columns: ["criado_por"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_envios_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "push_envios_produto_id_fkey"
            columns: ["produto_id"]
            referencedRelation: "produtos"
            referencedColumns: ["id"]
          },
        ]
      }
      raw_the_members: {
        Row: {
          email: string | null
          erro: string | null
          evento: string | null
          id: number
          payload: NonNullable<Json>
          processado: boolean
          recebido_em: string
        }
        Insert: {
          email?: string | null
          erro?: string | null
          evento?: string | null
          id?: number
          payload: NonNullable<Json>
          processado?: boolean
          recebido_em?: string
        }
        Update: {
          email?: string | null
          erro?: string | null
          evento?: string | null
          id?: number
          payload?: NonNullable<Json>
          processado?: boolean
          recebido_em?: string
        }
        Relationships: []
      }
      sequencia: {
        Row: {
          ano_serie: string | null
          atualizado_em: string
          capa_url: string | null
          categoria: string | null
          cor_destaque: string
          cor_secundaria: string
          criado_em: string
          habilidades: string[]
          icone: string | null
          id: string
          lp_url: string | null
          ordem: number
          padrao_topo: string
          publicada_em: string | null
          resumo: string | null
          slug: string
          status: string
          subtitulo: string | null
          tags: string[]
          titulo: string
        }
        Insert: {
          ano_serie?: string | null
          atualizado_em?: string
          capa_url?: string | null
          categoria?: string | null
          cor_destaque?: string
          cor_secundaria?: string
          criado_em?: string
          habilidades?: string[]
          icone?: string | null
          id?: string
          lp_url?: string | null
          ordem?: number
          padrao_topo?: string
          publicada_em?: string | null
          resumo?: string | null
          slug: string
          status?: string
          subtitulo?: string | null
          tags?: string[]
          titulo: string
        }
        Update: {
          ano_serie?: string | null
          atualizado_em?: string
          capa_url?: string | null
          categoria?: string | null
          cor_destaque?: string
          cor_secundaria?: string
          criado_em?: string
          habilidades?: string[]
          icone?: string | null
          id?: string
          lp_url?: string | null
          ordem?: number
          padrao_topo?: string
          publicada_em?: string | null
          resumo?: string | null
          slug?: string
          status?: string
          subtitulo?: string | null
          tags?: string[]
          titulo?: string
        }
        Relationships: []
      }
      sequencia_arquivo: {
        Row: {
          ativo: boolean
          criado_em: string
          descricao: string | null
          id: string
          ordem: number
          sequencia_id: string
          storage_path: string
          tamanho_bytes: number | null
          tipo: string
          titulo: string
        }
        Insert: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          id?: string
          ordem?: number
          sequencia_id: string
          storage_path: string
          tamanho_bytes?: number | null
          tipo?: string
          titulo: string
        }
        Update: {
          ativo?: boolean
          criado_em?: string
          descricao?: string | null
          id?: string
          ordem?: number
          sequencia_id?: string
          storage_path?: string
          tamanho_bytes?: number | null
          tipo?: string
          titulo?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequencia_arquivo_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequencia_arquivo_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      sequencia_conteudo: {
        Row: {
          atualizado_em: string
          conteudo: NonNullable<Json>
          previa: NonNullable<Json>
          sequencia_id: string
        }
        Insert: {
          atualizado_em?: string
          conteudo?: NonNullable<Json>
          previa?: NonNullable<Json>
          sequencia_id: string
        }
        Update: {
          atualizado_em?: string
          conteudo?: NonNullable<Json>
          previa?: NonNullable<Json>
          sequencia_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "sequencia_conteudo_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "sequencia"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "sequencia_conteudo_sequencia_id_fkey"
            columns: ["sequencia_id"]
            referencedRelation: "vw_catalogo"
            referencedColumns: ["id"]
          },
        ]
      }
      turmas: {
        Row: {
          alunos: number | null
          ano: Database["public"]["Enums"]["ano_escolar"] | null
          criado_em: string
          dist: Json | null
          id: string
          nome: string
          user_id: string
        }
        Insert: {
          alunos?: number | null
          ano?: Database["public"]["Enums"]["ano_escolar"] | null
          criado_em?: string
          dist?: Json | null
          id?: string
          nome: string
          user_id: string
        }
        Update: {
          alunos?: number | null
          ano?: Database["public"]["Enums"]["ano_escolar"] | null
          criado_em?: string
          dist?: Json | null
          id?: string
          nome?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "turmas_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "perfis"
            referencedColumns: ["id"]
          },
        ]
      }
      webhook_eventos: {
        Row: {
          erro: string | null
          evento: string | null
          id: string
          id_externo: string | null
          origem: string
          payload: NonNullable<Json>
          processado_em: string | null
          recebido_em: string
        }
        Insert: {
          erro?: string | null
          evento?: string | null
          id?: string
          id_externo?: string | null
          origem?: string
          payload: NonNullable<Json>
          processado_em?: string | null
          recebido_em?: string
        }
        Update: {
          erro?: string | null
          evento?: string | null
          id?: string
          id_externo?: string | null
          origem?: string
          payload?: NonNullable<Json>
          processado_em?: string | null
          recebido_em?: string
        }
        Relationships: []
      }
    }
    Views: {
      vw_catalogo: {
        Row: {
          ano_serie: string | null
          capa_url: string | null
          categoria: string | null
          cor_destaque: string | null
          cor_secundaria: string | null
          favorita: boolean | null
          habilidades: string[] | null
          icone: string | null
          id: string | null
          liberada: boolean | null
          lp_url: string | null
          ordem: number | null
          padrao_topo: string | null
          publicada_em: string | null
          resumo: string | null
          slug: string | null
          subtitulo: string | null
          tags: string[] | null
          titulo: string | null
        }
        Insert: {
          ano_serie?: string | null
          capa_url?: string | null
          categoria?: string | null
          cor_destaque?: string | null
          cor_secundaria?: string | null
          favorita?: never
          habilidades?: string[] | null
          icone?: string | null
          id?: string | null
          liberada?: never
          lp_url?: string | null
          ordem?: number | null
          padrao_topo?: string | null
          publicada_em?: string | null
          resumo?: string | null
          slug?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          titulo?: string | null
        }
        Update: {
          ano_serie?: string | null
          capa_url?: string | null
          categoria?: string | null
          cor_destaque?: string | null
          cor_secundaria?: string | null
          favorita?: never
          habilidades?: string[] | null
          icone?: string | null
          id?: string | null
          liberada?: never
          lp_url?: string | null
          ordem?: number | null
          padrao_topo?: string | null
          publicada_em?: string | null
          resumo?: string | null
          slug?: string | null
          subtitulo?: string | null
          tags?: string[] | null
          titulo?: string | null
        }
        Relationships: []
      }
      vw_jose_compradores: {
        Row: {
          comprou_em: string | null
          email: string | null
          nome: string | null
          produto_codigo: string | null
          produto_nome: string | null
          revisar: boolean | null
          status: string | null
          telefone: string | null
        }
        Insert: {
          comprou_em?: never
          email?: string | null
          nome?: string | null
          produto_codigo?: string | null
          produto_nome?: string | null
          revisar?: boolean | null
          status?: string | null
          telefone?: string | null
        }
        Update: {
          comprou_em?: never
          email?: string | null
          nome?: string | null
          produto_codigo?: string | null
          produto_nome?: string | null
          revisar?: boolean | null
          status?: string | null
          telefone?: string | null
        }
        Relationships: []
      }
      vw_jose_uso_suspeito: {
        Row: {
          aparelhos_distintos: number | null
          email: string | null
          entradas: number | null
          ips_distintos: number | null
          ultima_entrada: string | null
        }
        Relationships: []
      }
      vw_mais_baixados: {
        Row: {
          downloads_7d: number | null
          material_id: string | null
          posicao: number | null
        }
        Relationships: [
          {
            foreignKeyName: "downloads_material_id_fkey"
            columns: ["material_id"]
            referencedRelation: "materiais"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      eh_equipe: { Args: Record<PropertyKey, never>; Returns: boolean }
      fn_expirar_acessos: { Args: Record<PropertyKey, never>; Returns: number }
      fn_jose_comprador: {
        Args: { p_email: string }
        Returns: {
          comprou_em: string
          nome: string
          produto_codigo: string
          produto_nome: string
        }[]
      }
      fn_jose_tem_acesso: {
        Args: { p_email: string; p_produto?: string }
        Returns: boolean
      }
      fn_minha_assinatura: {
        Args: Record<PropertyKey, never>
        Returns: {
          expira_em: string
          produto: string
          renova_automatico: boolean
          status: string
          tipo: string
        }[]
      }
      fn_provisionar_acesso: {
        Args: {
          p_assinatura?: string
          p_email: string
          p_evento?: string
          p_nome?: string
          p_pedido?: string
          p_product_id?: string
        }
        Returns: Json
      }
      fn_tem_acesso: { Args: { p_sequencia: string }; Returns: boolean }
      show_limit: { Args: Record<PropertyKey, never>; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
      tem_acesso: {
        Args: { p_material: string; p_user: string }
        Returns: boolean
      }
    }
    Enums: {
      ano_escolar: "infantil" | "1ano" | "2ano" | "3ano" | "4ano" | "5ano"
      nivel_escrita: "pre" | "sil" | "sa" | "alf"
      origem_acesso: "compra" | "cortesia" | "migracao" | "manual"
      papel_usuario: "professora" | "editor" | "admin"
      regra_destaque: "todos" | "sem_produto" | "com_produto"
      status_material: "rascunho" | "agendado" | "publicado" | "arquivado"
      tipo_material:
        | "sequencia"
        | "atividade"
        | "jogo"
        | "avaliacao"
        | "cartaz"
        | "planner"
        | "aula"
        | "ebook"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      ano_escolar: ["infantil", "1ano", "2ano", "3ano", "4ano", "5ano"],
      nivel_escrita: ["pre", "sil", "sa", "alf"],
      origem_acesso: ["compra", "cortesia", "migracao", "manual"],
      papel_usuario: ["professora", "editor", "admin"],
      regra_destaque: ["todos", "sem_produto", "com_produto"],
      status_material: ["rascunho", "agendado", "publicado", "arquivado"],
      tipo_material: [
        "sequencia",
        "atividade",
        "jogo",
        "avaliacao",
        "cartaz",
        "planner",
        "aula",
        "ebook",
      ],
    },
  },
} as const
