import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  entitlementValido,
  idDoProdutoPeloSlug,
  perfilValido,
  type PerfilProfessora,
} from '@mdp/core';
import type { Session } from '@supabase/supabase-js';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react';

import { supabase } from '../lib/supabase';

/**
 * Sessão de verdade (Bloco 2, D50): entrar com o código numérico enviado ao
 * e-mail (D19), sessão guardada no aparelho e a posse lida de `entitlements`.
 * Com sessão, a posse vem do banco; sem, vale o cenário "teste" da demonstração.
 * Regra de ouro 4: a posse aqui só decide o que a tela mostra; quem libera
 * página ou arquivo é o servidor, conferindo o token.
 */
interface EstadoSessao {
  /** ainda lendo a sessão guardada no aparelho */
  carregando: boolean;
  email: string | null;
  /** ids (do acervo do app) dos produtos que ela tem; null = sem sessão */
  posse: string[] | null;
  /** token para o servidor conferir quem é (vai no cabeçalho Authorization) */
  token: string | null;
  /**
   * Respostas das boas-vindas (D53). Com sessão, do `user_metadata` da conta; sem,
   * a cópia do aparelho. null = ainda não respondeu (ou pulou sem responder nada).
   */
  perfil: PerfilProfessora | null;
  /** já sabemos se tem perfil? (sessão e cópia local lidas) */
  perfilCarregado: boolean;
  salvarPerfil: (perfil: PerfilProfessora) => Promise<void>;
  enviarCodigo: (email: string) => Promise<void>;
  /** entra; devolve se a conta já respondeu as boas-vindas (D53) */
  confirmarCodigo: (email: string, codigo: string) => Promise<{ temPerfil: boolean }>;
  sair: () => Promise<void>;
}

const Contexto = createContext<EstadoSessao | null>(null);

const CHAVE_PERFIL_LOCAL = 'mdp-perfil-v1';

/** Erro do Supabase em português de professora, não de sistema. */
function mensagemDeErro(erro: { message?: string; status?: number } | null): string {
  const texto = (erro?.message ?? '').toLowerCase();
  if (texto.includes('rate') || erro?.status === 429) {
    return 'Muitas tentativas seguidas. Espere um minutinho e tente de novo.';
  }
  if (texto.includes('expired') || texto.includes('invalid') || texto.includes('token')) {
    return 'Código errado ou vencido. Confira os números ou peça um novo.';
  }
  if (texto.includes('email')) return 'Confira o e-mail: parece que falta alguma coisa.';
  return 'Não deu certo agora. Confira a internet e tente de novo.';
}

export function ProvedorSessao({ children }: { children: ReactNode }) {
  const [sessao, setSessao] = useState<Session | null>(null);
  const [carregando, setCarregando] = useState(true);
  // posse guardada com o dono: trocar de conta (ou sair) invalida sem setState no efeito
  const [posseDe, setPosseDe] = useState<{ usuario: string; ids: string[] } | null>(null);
  // perfil da demonstração (sem conta): só no aparelho
  const [perfilLocal, setPerfilLocal] = useState<PerfilProfessora | null>(null);
  const [localLido, setLocalLido] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(CHAVE_PERFIL_LOCAL)
      .then((bruto) => setPerfilLocal(bruto ? perfilValido(JSON.parse(bruto)) : null))
      .catch(() => {})
      .finally(() => setLocalLido(true));
  }, []);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data }) => setSessao(data.session))
      .finally(() => setCarregando(false));
    const { data } = supabase.auth.onAuthStateChange((_evento, nova) => setSessao(nova));
    return () => data.subscription.unsubscribe();
  }, []);

  // a posse de verdade: entitlements ativos dela (RLS "vejo minha posse")
  const usuario = sessao?.user.id ?? null;
  const posse = posseDe && posseDe.usuario === usuario ? posseDe.ids : null;
  useEffect(() => {
    if (!usuario) return;
    let vivo = true;
    supabase
      .from('entitlements')
      .select('expira_em, revogado_em, produto_id, produtos(slug, is_combo)')
      .eq('user_id', usuario)
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error || !data) {
          setPosseDe({ usuario, ids: [] });
          return;
        }
        const ids = data
          .filter((e) => entitlementValido(e))
          .flatMap((e) => {
            const produto = e.produtos as unknown as { slug: string; is_combo: boolean } | null;
            if (!produto) return [];
            // o combo Acesso Total libera tudo pela regra (D22), como no cenário da demo
            return produto.is_combo ? ['acesso-total'] : [idDoProdutoPeloSlug(produto.slug)];
          });
        setPosseDe({ usuario, ids: [...new Set(ids)] });
      });
    return () => {
      vivo = false;
    };
  }, [usuario]);

  const enviarCodigo = useCallback(async (email: string) => {
    const { error } = await supabase.auth.signInWithOtp({
      email: email.trim().toLowerCase(),
      options: { shouldCreateUser: true },
    });
    if (error) throw new Error(mensagemDeErro(error));
  }, []);

  const confirmarCodigo = useCallback(async (email: string, codigo: string) => {
    const { data, error } = await supabase.auth.verifyOtp({
      email: email.trim().toLowerCase(),
      token: codigo.trim(),
      type: 'email',
    });
    if (error) throw new Error(mensagemDeErro(error));
    return { temPerfil: perfilValido(data.user?.user_metadata?.perfil) !== null };
  }, []);

  const salvarPerfil = useCallback(async (perfil: PerfilProfessora) => {
    setPerfilLocal(perfil);
    await AsyncStorage.setItem(CHAVE_PERFIL_LOCAL, JSON.stringify(perfil)).catch(() => {});
    const { data } = await supabase.auth.getSession();
    if (!data.session) return;
    // na conta: segue a professora em qualquer aparelho; o nome também vai para o perfil do banco
    const { error } = await supabase.auth.updateUser({
      data: { perfil, ...(perfil.nome ? { nome: perfil.nome } : {}) },
    });
    if (error) throw new Error('Não deu para salvar agora. Suas escolhas ficaram neste aparelho.');
    if (perfil.nome) {
      await supabase.from('perfis').update({ nome: perfil.nome }).eq('id', data.session.user.id);
    }
  }, []);

  const sair = useCallback(async () => {
    await supabase.auth.signOut();
  }, []);

  const valor = useMemo<EstadoSessao>(
    () => ({
      carregando,
      email: sessao?.user.email ?? null,
      // com sessão, enquanto a posse carrega, nada liberado (nunca o cenário da demo)
      posse: sessao ? (posse ?? []) : null,
      token: sessao?.access_token ?? null,
      perfil: sessao ? perfilValido(sessao.user.user_metadata?.perfil) : perfilLocal,
      perfilCarregado: !carregando && localLido,
      salvarPerfil,
      enviarCodigo,
      confirmarCodigo,
      sair,
    }),
    [carregando, sessao, posse, perfilLocal, localLido, salvarPerfil, enviarCodigo, confirmarCodigo, sair],
  );

  return <Contexto.Provider value={valor}>{children}</Contexto.Provider>;
}

export function useSessao(): EstadoSessao {
  const contexto = useContext(Contexto);
  if (!contexto) throw new Error('useSessao fora do ProvedorSessao');
  return contexto;
}
