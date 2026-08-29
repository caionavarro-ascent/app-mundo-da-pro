/** Formatadores compartilhados entre app e web. Sempre pt-BR. */

export function formatarPreco(centavos: number): string {
  return (centavos / 100).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

export function formatarData(iso: string | Date): string {
  const data = typeof iso === 'string' ? new Date(iso) : iso;
  return data.toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
}

/** "ana.silva@gmail.com" → "Ana" quando não houver nome cadastrado */
export function primeiroNome(nome: string | null | undefined, email: string): string {
  if (nome && nome.trim()) return nome.trim().split(/\s+/)[0];
  const antes = email.split('@')[0].split(/[._-]/)[0];
  return antes.charAt(0).toUpperCase() + antes.slice(1);
}

/** Segundos → "12 min", para as aulas em vídeo */
export function formatarDuracao(segundos: number): string {
  if (!segundos) return '';
  const min = Math.round(segundos / 60);
  return min < 1 ? '1 min' : `${min} min`;
}

/** Bytes → "12,3 MB", para a tela de baixados (PRD A12) */
export function formatarTamanho(bytes: number): string {
  if (bytes < 1024 * 1024) return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  return `${(bytes / (1024 * 1024)).toLocaleString('pt-BR', { maximumFractionDigits: 1 })} MB`;
}
