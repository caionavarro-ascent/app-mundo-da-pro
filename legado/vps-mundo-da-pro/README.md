# Mundo da Pro

Projeto isolado dos demais da VPS (sdr-agent, neural-library, seo-blog-agent). Nada aqui importa código de outras pastas.

## Arquitetura

Arquitetura limpa (Clean Architecture). A regra é uma só: **dependências apontam sempre para dentro**. Camadas externas conhecem as internas, nunca o contrário.

```
src/
├── domain/            # Núcleo. Zero dependência externa (nem de framework, nem de banco)
│   ├── entities/      # Entidades de negócio
│   ├── value-objects/ # Objetos de valor (CPF, e-mail, dinheiro...)
│   └── errors/        # Erros de domínio
│
├── application/       # Casos de uso. Orquestra o domínio
│   ├── use-cases/     # Um arquivo por caso de uso
│   └── ports/         # Interfaces (contratos) que a infra implementa
│
├── infrastructure/    # Detalhes. Implementa os ports
│   ├── database/      # Repositórios concretos, migrations, conexão
│   ├── http/          # Clientes de APIs externas
│   ├── providers/     # Integrações (e-mail, storage, IA...)
│   └── config/        # Leitura de env, setup
│
└── presentation/      # Entrada da aplicação
    ├── routes/        # Definição de rotas
    ├── controllers/   # Traduz HTTP ↔ casos de uso
    └── middlewares/   # Auth, validação, erros
```

```
tests/
├── unit/          # Domínio e casos de uso (sem banco, sem rede)
└── integration/   # Rotas e repositórios de ponta a ponta
```

## Regras de dependência

| Camada         | Pode importar de                  | Nunca importa de        |
|----------------|-----------------------------------|-------------------------|
| domain         | nada (só a própria camada)        | todas as outras         |
| application    | domain                            | infrastructure, presentation |
| infrastructure | application (ports), domain       | presentation            |
| presentation   | application, infrastructure (DI)  | domain diretamente*     |

*Presentation conversa com o domínio via casos de uso, não manipula entidades direto.

## Convenções

- Caso de uso novo = interface no `ports/` primeiro, implementação na infra depois.
- Nenhum `process.env` fora de `infrastructure/config`.
- Decisões de arquitetura registradas em `docs/DECISIONS.md`.
