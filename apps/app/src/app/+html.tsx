import { ScrollViewStyleReset } from 'expo-router/html';
import type { PropsWithChildren } from 'react';

/**
 * Documento raiz das páginas web do export estático (D51): idioma e descrição,
 * que antes saíam vazios (aba do navegador sem nome, link
 * compartilhado sem prévia). Só vale no web; no app nativo não existe.
 */
export default function Raiz({ children }: PropsWithChildren) {
  return (
    // sem .dark: a primeira pintura sai no tema padrão (claro, D54)
    <html lang="pt-BR">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
        {/* o <title> vem do Head em app/_layout.tsx (react-helmet), não daqui */}
        <meta
          name="description"
          content="Mundo da Prô | Clube Pedagógico: a biblioteca pedagógica para a sua rotina de ensino. Encontre, visualize e baixe as atividades da sua turma."
        />
        <meta name="theme-color" content="#0E2447" />
        <ScrollViewStyleReset />
      </head>
      <body>{children}</body>
    </html>
  );
}
