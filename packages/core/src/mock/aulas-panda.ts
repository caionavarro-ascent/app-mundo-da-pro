/**
 * GERADO pela API do Panda Video em 29/08/2026 — catálogo real de aulas das
 * formações FDA e FPT (D31). Regenerar com scripts futuros de ingestão;
 * não editar à mão. Pastas de marketing e "NÃO USAR" foram excluídas.
 */

export interface AulaPanda {
  id: string;
  formacao: 'fda' | 'fpt';
  modulo: string;
  titulo: string;
  embedUrl: string;
  duracaoSegundos: number;
}

export const aulasPanda: AulaPanda[] = [
  { id: "fda-000", formacao: "fda", modulo: "Módulo 1", titulo: "Alfabetização e Letramento", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=a43ebf0b-245f-4f34-a7f0-cef3649f5c99", duracaoSegundos: 2323 },
  { id: "fda-001", formacao: "fda", modulo: "Módulo 1", titulo: "Métodos de alfabetização", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=fc560cfe-3796-488a-b9ee-ce5ddecdcd83", duracaoSegundos: 2407 },
  { id: "fda-002", formacao: "fda", modulo: "Módulo 1", titulo: "Construtivismo no Brasil", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=74899445-775b-46be-9270-764f8733901b", duracaoSegundos: 1302 },
  { id: "fda-003", formacao: "fda", modulo: "Módulo 1", titulo: ". Ciência da Leitura", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=000d7b0c-bfc9-4653-b641-9431cef5c56b", duracaoSegundos: 960 },
  { id: "fda-004", formacao: "fda", modulo: "Módulo 1", titulo: "Abordagem fônica", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=ea7f5b3a-1805-429d-b9e8-d510d4ce28d4", duracaoSegundos: 355 },
  { id: "fda-005", formacao: "fda", modulo: "Módulo 1", titulo: "Perspectiva fonológica e psicogenética", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=95666a86-138b-4595-895e-47171c9afa05", duracaoSegundos: 977 },
  { id: "fda-006", formacao: "fda", modulo: "Módulo 1", titulo: "Como iniciar a alfabetização?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=717ddd2f-2ed9-469a-855b-68e9b046a44c", duracaoSegundos: 862 },
  { id: "fda-007", formacao: "fda", modulo: "Módulo 1", titulo: "Diferentes formas de alfabetizar no século XXI", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=88f538b8-4c52-4b4d-af6d-3c500fcd4743", duracaoSegundos: 6612 },
  { id: "fda-008", formacao: "fda", modulo: "Módulo 1", titulo: "Propriedades do sistema de escrita alfabético", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d934a097-03bd-47d1-b795-c0af48620a57", duracaoSegundos: 1925 },
  { id: "fda-009", formacao: "fda", modulo: "Módulo 1", titulo: "ABERTURA", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=3ee05c42-ac31-4876-ae02-ef751b206f5b", duracaoSegundos: 171 },
  { id: "fda-010", formacao: "fda", modulo: "Módulo 1", titulo: "WhatsApp Audio 2024-05-27 at 00.01.03", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=55acaf4a-397d-480e-893f-3724297cee9f", duracaoSegundos: 229 },
  { id: "fda-011", formacao: "fda", modulo: "Módulo 2", titulo: "HABILIDADES PREDITORAS OK", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=6775a447-dc02-462d-9c35-af6cd6b01566", duracaoSegundos: 1967 },
  { id: "fda-012", formacao: "fda", modulo: "Módulo 2", titulo: "3.2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0cd7f4f6-f67f-4e47-999e-72b5e115cdc0", duracaoSegundos: 1003 },
  { id: "fda-013", formacao: "fda", modulo: "Módulo 2", titulo: "O que trabalhar na educação infantil_", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d2df80a9-b4c0-4570-b6c8-9e8674240d19", duracaoSegundos: 2101 },
  { id: "fda-014", formacao: "fda", modulo: "Módulo 2", titulo: "Consciência fonológica - teoria e prática", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=6cf8a52d-9914-4c24-a88a-9572f2cb3677", duracaoSegundos: 3590 },
  { id: "fda-015", formacao: "fda", modulo: "Módulo 2", titulo: "Conhecimento alfabético - sugestões práticas", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=6651734b-79be-4a94-8105-d4359f8179ea", duracaoSegundos: 2081 },
  { id: "fda-016", formacao: "fda", modulo: "Módulo 2", titulo: "3.7", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=f2fa6eea-0d77-46cf-982c-7926d723c933", duracaoSegundos: 662 },
  { id: "fda-017", formacao: "fda", modulo: "Módulo 2", titulo: "3.9", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d624ffd4-f1f0-43c6-9194-b2b922f34e21", duracaoSegundos: 504 },
  { id: "fda-018", formacao: "fda", modulo: "Módulo 3", titulo: "Por que e quais sondagens realizar?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=a38d60a2-a9ca-401b-bcbd-336a9040d65a", duracaoSegundos: 1017 },
  { id: "fda-019", formacao: "fda", modulo: "Módulo 3", titulo: "Fases de escrita segundo a Perspectiva Psicogenética - (características, procedimentos)", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=6a8b3e12-4a6e-4121-a427-d26af0c0b927", duracaoSegundos: 2525 },
  { id: "fda-020", formacao: "fda", modulo: "Módulo 3", titulo: "Fases de leitura segundo a Perspectiva Fonológica - Linnea Ehri", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d9757829-1bbe-4ce4-83e7-023d8b7aaf9e", duracaoSegundos: 1046 },
  { id: "fda-021", formacao: "fda", modulo: "Módulo 3", titulo: "Sondagem de hipóteses escrita - análise", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=7b154766-56ca-41d9-950a-53440416e7ec", duracaoSegundos: 3994 },
  { id: "fda-022", formacao: "fda", modulo: "Módulo 3", titulo: "Sondagem em consciência fonológica", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=05c47b8e-e851-41a5-a4de-a58b405bbd98", duracaoSegundos: 550 },
  { id: "fda-023", formacao: "fda", modulo: "Módulo 3", titulo: "Mapeamento da turma: importância e sugestões", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=877efc47-5c6b-4719-9a4f-2c59a06eca98", duracaoSegundos: 698 },
  { id: "fda-024", formacao: "fda", modulo: "Módulo 3", titulo: "Portfólio: sugestão de montagem", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0bebd236-5c53-4cda-9acb-7acbef7abefe", duracaoSegundos: 1483 },
  { id: "fda-025", formacao: "fda", modulo: "Módulo 3", titulo: "Sondagem de leitura", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=9c76d132-8ea7-40df-9d03-f89bc06ebac0", duracaoSegundos: 488 },
  { id: "fda-026", formacao: "fda", modulo: "Módulo 4", titulo: "Oralidade como objeto de conhecimento na alfabetização", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b5c572f1-26b6-4f9b-ae9d-adbccaeb3fd6", duracaoSegundos: 1003 },
  { id: "fda-027", formacao: "fda", modulo: "Módulo 4", titulo: "Sugestões práticas para a sala de aula (caixinhas)", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=3cfd25d9-ed17-4ccc-b26b-0ff294fcc5e5", duracaoSegundos: 788 },
  { id: "fda-028", formacao: "fda", modulo: "Módulo 4", titulo: "Atividades de oralidade alinhadas à BNCC", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=1092a61c-f8b2-4d7a-aeca-85e898362aaa", duracaoSegundos: 28 },
  { id: "fda-029", formacao: "fda", modulo: "Módulo 5", titulo: "Práticas de leitura (caderno de leitura)", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=2e9ed74f-ad7d-4c12-be3b-6ec5afc6cbef", duracaoSegundos: 991 },
  { id: "fda-030", formacao: "fda", modulo: "Módulo 5", titulo: "Sugestões de livros para leitura deleite", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=40106915-0273-4ec5-a9b7-bb3f9835db69", duracaoSegundos: 2634 },
  { id: "fda-031", formacao: "fda", modulo: "Módulo 5", titulo: "Práticas de leitura AAZ", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d317b470-6b37-4b85-8017-372cd09ce174", duracaoSegundos: 1156 },
  { id: "fda-032", formacao: "fda", modulo: "Módulo 6", titulo: "Práticas de produção escrita no 1º ano", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=76986a32-ca24-4dcc-ac84-3ad8305ab878", duracaoSegundos: 1850 },
  { id: "fda-033", formacao: "fda", modulo: "Módulo 6", titulo: "PRÁTICAS DE ESCRITA", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=341a7b9a-8e16-4f6f-abe5-cc010cef8cdc", duracaoSegundos: 1867 },
  { id: "fda-034", formacao: "fda", modulo: "Módulo 7", titulo: "Introdução ao caderno no 1º ano – como fazer?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=f7e74b16-2222-49fd-8a26-858aa087c1a7", duracaoSegundos: 1104 },
  { id: "fda-035", formacao: "fda", modulo: "Módulo 7", titulo: "Como preparar o ambiente alfabetizador?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=37588158-f392-432e-90a9-c8d216a9fdee", duracaoSegundos: 668 },
  { id: "fda-036", formacao: "fda", modulo: "Módulo 7", titulo: "Reunião de pais - como organizar?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0c9bbd20-2773-4cc3-a545-250e6c77fa72", duracaoSegundos: 25 },
  { id: "fda-037", formacao: "fda", modulo: "Módulo 7", titulo: "AMBIENTE ALFABETIZADOR OK", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0c0e0f4d-19cd-44a7-b8c5-7556bd965c8d", duracaoSegundos: 720 },
  { id: "fda-038", formacao: "fda", modulo: "Módulo 7", titulo: "REUNIÃO DE PAIS - FAST", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0fdda00e-ad55-48dc-9159-eb4ec1e6f20d", duracaoSegundos: 25 },
  { id: "fda-039", formacao: "fda", modulo: "Módulo 8", titulo: "Agrupamentos produtivos: importância e como formar", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=5a630154-56c7-4e14-a9d1-a179b6215a61", duracaoSegundos: 869 },
  { id: "fda-040", formacao: "fda", modulo: "Módulo 8", titulo: "Como diferenciar as atividades", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=4d7e6d6c-f12a-460a-a6bf-ff2b55291cc0", duracaoSegundos: 1057 },
  { id: "fda-041", formacao: "fda", modulo: "Módulo 9", titulo: "Modalidades organizativas do trabalho pedagógico", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=36dd5496-467b-4c2f-aa85-d8026a193610", duracaoSegundos: 4468 },
  { id: "fda-042", formacao: "fda", modulo: "Módulo 10", titulo: "Ensinando pelas bases", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=f8d16eb0-984c-4275-b222-00153e1f7214", duracaoSegundos: 552 },
  { id: "fda-043", formacao: "fda", modulo: "Módulo 11", titulo: "MATERIAL DO FDA", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=bf172485-0696-4e1d-8eaf-d26c8a8b3e41", duracaoSegundos: 3010 },
  { id: "fda-044", formacao: "fda", modulo: "Módulo 12", titulo: "Mediação com mexe-mexe fechado", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=8a2d311d-e7e8-4282-a2ba-4f742956b43e", duracaoSegundos: 814 },
  { id: "fda-045", formacao: "fda", modulo: "Módulo 12", titulo: "Mediação com prancha", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=f092be6f-c479-4ded-8455-8d53a25a86d1", duracaoSegundos: 1072 },
  { id: "fda-046", formacao: "fda", modulo: "Módulo 12", titulo: "Mediação com Letras Móveis", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=90c0f1c4-5e4f-467b-ae5f-9ba5efd1834c", duracaoSegundos: 766 },
  { id: "fda-047", formacao: "fda", modulo: "Módulo 12", titulo: "12 Letras", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=84c57ff8-f7b3-49bf-bc2a-9ff8ee60d82e", duracaoSegundos: 769 },
  { id: "fda-048", formacao: "fda", modulo: "Módulo 12", titulo: "12 Prancha", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=020fb753-61f7-4ed7-a434-913907ea6321", duracaoSegundos: 1082 },
  { id: "fda-049", formacao: "fda", modulo: "Módulo 13", titulo: "Ortografia", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=cfc95826-db9d-4fc6-8bd0-5beb56ec6aee", duracaoSegundos: 1278 },
  { id: "fda-050", formacao: "fda", modulo: "Módulo 13", titulo: "13. LIP", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=70a8bbbb-18d3-404e-a8bb-68ce52ab5a6b", duracaoSegundos: 1341 },
  { id: "fda-051", formacao: "fda", modulo: "Masterclass", titulo: "Aula da Katlen", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=eebada52-9e5f-4a62-a444-f46125f22374", duracaoSegundos: 6138 },
  { id: "fda-052", formacao: "fda", modulo: "Masterclass", titulo: "FONO-1", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=678ba8a6-8215-4447-953b-f3ddd50052ce", duracaoSegundos: 10536 },
  { id: "fpt-053", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 0", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=2a0496da-802e-4645-b2db-52b7ea05d0d4", duracaoSegundos: 355 },
  { id: "fpt-054", formacao: "fpt", modulo: "Módulo 1", titulo: "Por que escrevemos?", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=28862316-86dd-4f38-b3a8-36b556e2e583", duracaoSegundos: 437 },
  { id: "fpt-055", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=70e6edc1-889e-4f3d-a85f-11dd5cd66be2", duracaoSegundos: 273 },
  { id: "fpt-056", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 3", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=62090e0a-024f-4df7-90fe-61e7fca33814", duracaoSegundos: 545 },
  { id: "fpt-057", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 5", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=088ef683-cb77-45e9-bb20-e752237c2874", duracaoSegundos: 474 },
  { id: "fpt-058", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 6", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=79f8ac89-a7a7-443d-8643-e677b85b297d", duracaoSegundos: 437 },
  { id: "fpt-059", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 7", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=550fc627-0001-49d1-a559-57be75dc2cdd", duracaoSegundos: 304 },
  { id: "fpt-060", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 8", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=3a5beef7-69c5-4093-8fc8-bc6d28c5e85e", duracaoSegundos: 542 },
  { id: "fpt-061", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 9", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=c7dab6ad-54c4-4902-9b01-b69d51d7d7b6", duracaoSegundos: 1140 },
  { id: "fpt-062", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 10", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=143c806e-7489-4e5e-a354-9b88d1b92085", duracaoSegundos: 524 },
  { id: "fpt-063", formacao: "fpt", modulo: "Módulo 1", titulo: "Aula 11", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=87876c6d-cde8-49ef-b7f4-04bdcf15b9a5", duracaoSegundos: 1007 },
  { id: "fpt-064", formacao: "fpt", modulo: "Módulo 1", titulo: "Modulo 1 aula 4", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=21fb0dec-d755-4d8a-8b7a-0122c00b9e21", duracaoSegundos: 513 },
  { id: "fpt-065", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 1", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=bf31c42a-3a39-4cb1-b8a9-4636dea93539", duracaoSegundos: 570 },
  { id: "fpt-066", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=7c84f5c7-7ceb-47f4-b315-ff3c60ad3b25", duracaoSegundos: 1683 },
  { id: "fpt-067", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 3", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=36faf118-b053-46b2-98d1-837789350802", duracaoSegundos: 954 },
  { id: "fpt-068", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 4", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=ee3e1149-86c8-4df9-9764-f5cc4223acc5", duracaoSegundos: 669 },
  { id: "fpt-069", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 5", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=2a6acfd5-4f9d-4177-abf9-2a2dc30a0a04", duracaoSegundos: 153 },
  { id: "fpt-070", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 6", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=21488029-c471-447d-ad57-44bfcdeb56bb", duracaoSegundos: 183 },
  { id: "fpt-071", formacao: "fpt", modulo: "Módulo 2", titulo: "Aula 7", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=bcc1ca35-71fa-4581-942b-faf4d080fec0", duracaoSegundos: 147 },
  { id: "fpt-072", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 1", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=682ee86d-7963-47b8-97e0-64bf02b59f01", duracaoSegundos: 397 },
  { id: "fpt-073", formacao: "fpt", modulo: "Módulo 3", titulo: "Modulo 3 Aula 1 Tipos textuais", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0717d427-e6e6-4095-a6b6-3eb55d7b278c", duracaoSegundos: 397 },
  { id: "fpt-074", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=51648ed8-e04d-485a-80e7-e8b25f4616d1", duracaoSegundos: 842 },
  { id: "fpt-075", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 3", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=317abbbb-6269-4ea5-b00b-4322cd55ecb4", duracaoSegundos: 715 },
  { id: "fpt-076", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 4", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=cead4149-1f24-40f2-838a-baa6735fcf78", duracaoSegundos: 356 },
  { id: "fpt-077", formacao: "fpt", modulo: "Módulo 3", titulo: "Modulo 3 Aula 4 dissertativos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=94c85800-b877-4774-89dc-20de95f80ffc", duracaoSegundos: 356 },
  { id: "fpt-078", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 5", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=701f8dd8-866e-46bd-97be-3e70d66f3fa3", duracaoSegundos: 357 },
  { id: "fpt-079", formacao: "fpt", modulo: "Módulo 3", titulo: "Modulo 3 Aula 5 injuntivos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=9a096d00-6953-4f51-af8d-9e79e9e0ef34", duracaoSegundos: 357 },
  { id: "fpt-080", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 6", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=14cc7207-7b16-416f-bbf3-c316fcdfc0b8", duracaoSegundos: 262 },
  { id: "fpt-081", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 7", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=5f79aa86-90b0-4679-a2d9-489cf642308e", duracaoSegundos: 1061 },
  { id: "fpt-082", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 8", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=e71afb4f-2a9f-4e0e-9813-a2f14680ef39", duracaoSegundos: 1326 },
  { id: "fpt-083", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 9", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=abf8b4fa-519f-45f6-9bca-e3229865bb99", duracaoSegundos: 1351 },
  { id: "fpt-084", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 10", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=50f777b1-3c63-4168-a8f7-f823ef5b5cfa", duracaoSegundos: 488 },
  { id: "fpt-085", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 11", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=3982ec4d-0e67-4780-8881-92602487db33", duracaoSegundos: 387 },
  { id: "fpt-086", formacao: "fpt", modulo: "Módulo 3", titulo: "Recursos texto injuntivo", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=8cf040bd-4e8c-4f39-9fbf-14aeb0b83971", duracaoSegundos: 387 },
  { id: "fpt-087", formacao: "fpt", modulo: "Módulo 3", titulo: "Aula 12", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b4b3e74e-9eee-4648-a5fd-522bc3edbe1a", duracaoSegundos: 1039 },
  { id: "fpt-088", formacao: "fpt", modulo: "Módulo 3", titulo: "Ampliar vocabulário II", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=e02d6e9a-1e5d-4d22-88b5-c468acc51772", duracaoSegundos: 1134 },
  { id: "fpt-089", formacao: "fpt", modulo: "Módulo 4", titulo: "O que é um bom modelo Modulo 4 Aula 1 -", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=6b38468d-6888-4737-83fb-9a77f61f0ad5", duracaoSegundos: 704 },
  { id: "fpt-090", formacao: "fpt", modulo: "Módulo 4", titulo: "A importância da leitura", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=1f1000c6-fa36-4992-a5a6-1d0134f4bca9", duracaoSegundos: 1182 },
  { id: "fpt-091", formacao: "fpt", modulo: "Módulo 4", titulo: "Como desenvolver a fluência na leitura", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b306b8df-91bd-485b-8091-81a572fc5724", duracaoSegundos: 363 },
  { id: "fpt-092", formacao: "fpt", modulo: "Módulo 4", titulo: "Recursos para desenvolver a fluência na leitura", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=2119ee6e-615c-44bb-b6cc-b33837398b65", duracaoSegundos: 456 },
  { id: "fpt-093", formacao: "fpt", modulo: "Módulo 4", titulo: "Como analisar bons modelos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b125881d-ce56-4c23-ad41-d6354d62ef73", duracaoSegundos: 626 },
  { id: "fpt-094", formacao: "fpt", modulo: "Módulo 4", titulo: "Vírgulas", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=54b9f4cb-8d8b-4d16-9e89-8465f96c3cac", duracaoSegundos: 225 },
  { id: "fpt-095", formacao: "fpt", modulo: "Módulo 4", titulo: "Recursos vírgula", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b1c76396-68d8-40aa-a0d9-16cb62e3909d", duracaoSegundos: 653 },
  { id: "fpt-096", formacao: "fpt", modulo: "Módulo 4", titulo: "Exemplo - Elementos coesivos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=76b5a7bb-329a-4034-bc5e-4cf088c6b7ff", duracaoSegundos: 490 },
  { id: "fpt-097", formacao: "fpt", modulo: "Módulo 4", titulo: "Exemplo - Concordância verbal", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=530e1099-d855-4a4b-9764-44dea336a4ca", duracaoSegundos: 283 },
  { id: "fpt-098", formacao: "fpt", modulo: "Módulo 4", titulo: "Recursos concordância", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=4dd8fc3f-8b48-4685-9cc9-f9f8ca993f1c", duracaoSegundos: 1402 },
  { id: "fpt-099", formacao: "fpt", modulo: "Módulo 4", titulo: "Exemplo de aula - Adjetivos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b27d7a1e-141c-4ee5-9981-ab95f0a7260e", duracaoSegundos: 191 },
  { id: "fpt-100", formacao: "fpt", modulo: "Módulo 4", titulo: "Aula 12", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=7944d733-9df1-4b8a-9cc6-111131607c1d", duracaoSegundos: 736 },
  { id: "fpt-101", formacao: "fpt", modulo: "Módulo 5", titulo: "Aula 1", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=f0504531-2315-4b7c-9d91-a513e0251848", duracaoSegundos: 315 },
  { id: "fpt-102", formacao: "fpt", modulo: "Módulo 5", titulo: "Aula 2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=35761434-89f4-4241-9133-dfa10ded5690", duracaoSegundos: 247 },
  { id: "fpt-103", formacao: "fpt", modulo: "Módulo 5", titulo: "Aula 3", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=57260654-77a7-4c78-b71a-d9f7d952dabb", duracaoSegundos: 524 },
  { id: "fpt-104", formacao: "fpt", modulo: "Módulo 6", titulo: "Aula 1", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=1d740394-ef61-4754-8cd6-e508836cdac7", duracaoSegundos: 490 },
  { id: "fpt-105", formacao: "fpt", modulo: "Módulo 6", titulo: "Aula 2", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=90fed330-97f9-41ca-b6e5-87fcdf0a329f", duracaoSegundos: 312 },
  { id: "fpt-106", formacao: "fpt", modulo: "Módulo 6", titulo: "Aula 3", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=3970d07f-8530-44b7-b47a-c4e7424e1496", duracaoSegundos: 238 },
  { id: "fpt-107", formacao: "fpt", modulo: "Módulo 6", titulo: "Aula 4", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b866301b-4869-4c9a-a6ba-b78622e09c82", duracaoSegundos: 399 },
  { id: "fpt-108", formacao: "fpt", modulo: "Módulo 6", titulo: "Aula 5", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0103be4a-f638-4952-8a11-1a7f73daeb73", duracaoSegundos: 265 },
  { id: "fpt-109", formacao: "fpt", modulo: "Bônus", titulo: "Poemas", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=ecde6411-220f-4874-bf6a-f7a8adc18f82", duracaoSegundos: 257 },
  { id: "fpt-110", formacao: "fpt", modulo: "Bônus", titulo: "Roteiros para Produção Textual", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=64d01d77-448d-480b-902c-3ad7ee84fdbe", duracaoSegundos: 313 },
  { id: "fpt-111", formacao: "fpt", modulo: "Bônus", titulo: "Tabuleiros", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=af9716ab-d314-47a7-9b2e-d1e87a1de030", duracaoSegundos: 172 },
  { id: "fpt-112", formacao: "fpt", modulo: "Bônus", titulo: "Vamos Escrever", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=979d3fc0-7615-4c3d-9671-deefb553c273", duracaoSegundos: 337 },
  { id: "fpt-113", formacao: "fpt", modulo: "Bônus", titulo: "Vamos Escrever (Versão de Venda)", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=57bdd292-dbae-4a9f-bd8c-5d451f35109f", duracaoSegundos: 282 },
  { id: "fpt-114", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "A Avó", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=e4d89eec-8b47-414d-8502-e1316e584bcd", duracaoSegundos: 74 },
  { id: "fpt-115", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "A Boneca", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=205aaf83-b95e-4b01-a29c-ce5ba03a550a", duracaoSegundos: 37 },
  { id: "fpt-116", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "A Borboleta", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=40d0f30e-9f04-4f28-b663-898ed4bfc96a", duracaoSegundos: 72 },
  { id: "fpt-117", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "A Canção do Exílio", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=416488fc-305a-4ddf-b427-bb89d0bc8ceb", duracaoSegundos: 42 },
  { id: "fpt-118", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "A Rã e o Touro", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=5e70c827-7fb4-4daa-891a-947f2daddb13", duracaoSegundos: 55 },
  { id: "fpt-119", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "As Estações - Inverno", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=03da5da8-0562-47cf-b414-1fbfa78db310", duracaoSegundos: 50 },
  { id: "fpt-120", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "As Estações - Outono", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=b807dca4-b47b-413c-b60a-9aa9eaba0f5a", duracaoSegundos: 46 },
  { id: "fpt-121", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "As Estações - Primavera", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=c6cbb7ff-b6d1-4ad7-90e8-026179ff345b", duracaoSegundos: 47 },
  { id: "fpt-122", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "As Estações - Verão", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=63a08267-9dc7-402b-9981-2aa84c263ace", duracaoSegundos: 47 },
  { id: "fpt-123", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "As Formigas", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=60d4c765-af15-46b1-b714-8202fde3265a", duracaoSegundos: 59 },
  { id: "fpt-124", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Cetim", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=ec3bad55-4790-46c5-b472-fde6726f70dc", duracaoSegundos: 35 },
  { id: "fpt-125", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Meus Oito Anos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=11bb6d48-ef67-44a4-a067-85da694c55a3", duracaoSegundos: 108 },
  { id: "fpt-126", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Minha Terra", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=7a12d9eb-aa40-4c76-b0c5-d4f90aadcb22", duracaoSegundos: 92 },
  { id: "fpt-127", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "O Cão e o Lobo", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=9cc1a145-f51e-44db-955c-84f7ecb5924c", duracaoSegundos: 75 },
  { id: "fpt-128", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "O Leão e o Camundongo", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=0c37db39-3d78-48b6-8c41-334f44afc837", duracaoSegundos: 41 },
  { id: "fpt-129", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "O Remédio", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=39ab7660-221c-4f5c-b480-976d94210bff", duracaoSegundos: 88 },
  { id: "fpt-130", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Os Pobres", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=23abc972-6abb-457a-ad40-bbcf81169c5b", duracaoSegundos: 43 },
  { id: "fpt-131", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Os Sinos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=d7fbfab6-f147-4a9d-b380-fd29c50e4c41", duracaoSegundos: 52 },
  { id: "fpt-132", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Passarinhos", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=9e6b0862-b5de-410b-a990-c63cec879b51", duracaoSegundos: 43 },
  { id: "fpt-133", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Plutão", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=2d483959-7de1-4c50-b2f0-a4998729dbf9", duracaoSegundos: 82 },
  { id: "fpt-134", formacao: "fpt", modulo: "Bônus: Poemas da Olivia", titulo: "Pouco a Pouco", embedUrl: "https://player-vz-a7d00cb7-df8.tv.pandavideo.com.br/embed/?v=fc8674f5-1aad-4db4-8c82-90f6889ee500", duracaoSegundos: 70 },
];

export function modulosDaFormacao(formacao: 'fda' | 'fpt'): string[] {
  const vistos: string[] = [];
  for (const aula of aulasPanda) {
    if (aula.formacao === formacao && !vistos.includes(aula.modulo)) {
      vistos.push(aula.modulo);
    }
  }
  return vistos;
}

export function aulasDoModulo(formacao: 'fda' | 'fpt', modulo: string): AulaPanda[] {
  return aulasPanda.filter((a) => a.formacao === formacao && a.modulo === modulo);
}

export function aulaPorId(id: string): AulaPanda | undefined {
  return aulasPanda.find((a) => a.id === id);
}
