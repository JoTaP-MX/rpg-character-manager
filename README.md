# Visual Codex

> Aplicação local para criar, organizar e visualizar personagens, campanhas,
> locais, itens e qualquer outro conteúdo de RPG, onde cada documento é escrito
> livremente em Markdown.

> **Nota:** o nome do projeto é **Visual Codex**, mas o repositório, a pasta
> local e alguns arquivos ainda usam o nome antigo, **rpg-character-manager**.
> A renomeação completa está prevista como uma etapa separada.

---

## Sumário

- [Visão geral](#visão-geral)
- [Status atual](#status-atual)
- [Stack](#stack)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Como rodar](#como-rodar)
- [Endpoints da API](#endpoints-da-api)
- [Decisões de arquitetura](#decisões-de-arquitetura)
- [Identidade visual](#identidade-visual)
- [Roadmap](#roadmap)
- [Convenções](#convenções)
- [Documentação complementar](#documentação-complementar)

---

## Visão geral

O conteúdo de cada documento é **Markdown livre**. Não existem campos fixos como
"história" ou "habilidades": um personagem, uma campanha ou um item são apenas
documentos Markdown organizados em pastas.

Princípios do projeto:

- O conteúdo deve continuar legível fora da aplicação (arquivos `.md` de verdade
  no disco, não um formato proprietário).
- O banco guarda **metadados**; o texto e as imagens ficam em **arquivos**.
- Um documento genérico serve para qualquer tipo de conteúdo (personagem,
  local, item, criatura...). O tipo é um campo livre, não um formulário rígido.
- Uma **campanha é uma pasta raiz** (sem pasta-pai). Não existe tabela separada
  para campanhas.
- Roda **localmente**, para uma pessoa só. Não há login nem multiusuário.

## Status atual

| Parte | Descrição | Situação |
|---|---|---|
| Backend — pastas | CRUD completo (`/api/folders`) | ✅ Implementado e testado |
| Backend — documentos | CRUD completo com conteúdo em arquivo `.md` (`/api/documents`) | ✅ Implementado e testado |
| Backend — utilitário | Health check (`/api/ping`) | ✅ Implementado |
| Backend — favoritos, assets, lixeira, busca, tags, perfil, configurações, import/export | Especificados em `openapi.yml` | ⏳ Planejados, ainda não implementados |
| Frontend — estrutura | React + Vite + Tailwind, rotas, componentes, camada `api/` | ✅ Criado (gerado pelo Cursor a partir do plano) |
| Frontend — visual | Paleta, layout responsivo, ícones desenhados à mão | ⚠️ Em ajuste (ver [Problemas conhecidos](#problemas-conhecidos)) |
| Frontend — telas com endpoints mockados | Favoritos, lixeira, busca, tags, perfil, configurações | ⏳ Usam dados fictícios até o backend implementar |

### Problemas conhecidos

- **Layout da galeria:** a galeria de documentos usa CSS multi-coluna, que corta
  cards ao meio em alguns tamanhos de tela. Correção planejada: trocar por grid.
- **Menu em tela estreita:** a barra lateral some abaixo de um certo tamanho de
  tela e não há substituto. Correção planejada: menu hambúrguer.
- **Paleta:** o tema atual é creme/âmbar. A intenção é um tema padrão sombrio
  (preto e vermelho).
- **Lixeira:** excluir um documento faz o DELETE real no backend, mas a Lixeira
  lê dados mockados, então o item excluído não aparece lá até o endpoint
  `/api/trash` existir.
- **Nomes:** arquivos, funções e comentários estão em inglês/misturados. A
  tradução para português é uma etapa planejada.

---

## Stack

**Backend**
- Python 3
- Flask (framework web)
- Flask-SQLAlchemy / SQLAlchemy (ORM)
- SQLite (banco local, arquivo `backend/instance/app.db`)
- python-dotenv

**Frontend**
- React 18
- Vite (servidor de desenvolvimento e build)
- React Router (navegação)
- Tailwind CSS (estilos, com bordas arredondadas desativadas de propósito)
- lucide-react (ícones)
- react-markdown + remark-gfm (renderização do Markdown)
- rough.js (desenhos com traço imperfeito)

**Versionamento:** Git + GitHub

---

## Estrutura de pastas

```
rpg-character-manager/          (será renomeado para visual-codex)
├── backend/
│   ├── app/
│   │   ├── __init__.py         # app factory: cria o Flask e registra as rotas
│   │   ├── config.py           # configurações (caminho do banco SQLite)
│   │   ├── extensions.py       # instância do SQLAlchemy
│   │   ├── models/             # tabelas: Folder (pasta) e Document (documento)
│   │   ├── routes/             # endpoints HTTP (recebem a requisição)
│   │   ├── services/           # regras de negócio (não sabem de HTTP)
│   │   └── storage/            # leitura e escrita dos arquivos .md no disco
│   ├── tests/                  # testes automatizados (ainda vazio)
│   ├── create_db.py            # cria as tabelas no banco
│   ├── run.py                  # ponto de entrada: sobe o servidor
│   └── requirements.txt        # dependências Python
│
├── frontend/
│   ├── src/
│   │   ├── api/                # chamadas à API (reais ou mockadas)
│   │   ├── components/         # peças reutilizáveis da interface
│   │   ├── hooks/              # lógica reutilizável (useAsync, useTheme)
│   │   ├── lib/                # utilitários (cn)
│   │   ├── pages/              # telas completas (Home, CampaignView...)
│   │   ├── styles/             # tokens de cor e estilos globais
│   │   ├── App.jsx             # rotas e layout principal
│   │   └── main.jsx            # ponto de entrada do React
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.js          # proxy: /api → backend em 127.0.0.1:5000
│
├── storage/
│   ├── documents/              # arquivos .md dos documentos (dados do usuário)
│   └── assets/                 # imagens (dados do usuário, ainda não usado)
│
├── docs/
│   ├── RPG_Character_Manager_Arquitetura_v2.md   # decisões de arquitetura
│   └── PROGRESSO.md                              # registro por etapa
│
├── openapi.yml                 # contrato completo da API (implementada e planejada)
├── .gitignore
└── README.md
```

**Por que `storage/` fica fora de `backend/`:** são dados do usuário, não código.
Assim fica fácil fazer backup só dessa pasta e evitar subir conteúdo pessoal
para o Git por engano (o `.gitignore` já cuida disso).

---

## Como rodar

São necessários **dois terminais**: um para o backend e outro para o frontend.

### Pré-requisitos

- Python 3.10 ou superior
- Node.js LTS (inclui o `npm`)
- Git

### 1. Backend

```bash
cd backend
python -m venv venv
source venv/Scripts/activate        # Windows (Git Bash)
# source venv/bin/activate          # Linux / macOS
pip install -r requirements.txt
python create_db.py                 # só na primeira vez: cria o banco
python run.py
```

O servidor sobe em `http://127.0.0.1:5000`. Teste com:
`http://127.0.0.1:5000/api/ping` → deve responder `{"status": "ok"}`.

### 2. Frontend

Em outro terminal:

```bash
cd frontend
npm install                         # só na primeira vez
npm run dev
```

Abra `http://localhost:5173`. Qualquer alteração salva no código atualiza a
página automaticamente, sem precisar rodar o comando de novo.

---

## Endpoints da API

Base: `http://127.0.0.1:5000`. Todas as respostas são JSON, exceto o conteúdo
bruto dos arquivos. Datas no formato ISO 8601. Sem autenticação.

A lista completa, com schemas, está em [`openapi.yml`](openapi.yml). Ele pode
ser aberto no [Swagger Editor](https://editor.swagger.io) para navegação visual.

### Implementados

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/ping` | Verifica se o servidor está no ar |
| GET | `/api/folders` | Lista pastas. `?parent_id=N` filtra pela pasta-pai (sem o parâmetro, lista as raízes) |
| POST | `/api/folders` | Cria pasta. Corpo: `{"name": "...", "parent_id": null}` |
| GET | `/api/folders/<id>` | Busca uma pasta |
| PATCH | `/api/folders/<id>` | Renomeia e/ou move. Corpo: `{"name": "...", "parent_id": N}` |
| DELETE | `/api/folders/<id>` | Envia para a lixeira (soft delete) |
| GET | `/api/documents` | Lista documentos. `?folder_id=N` filtra por pasta |
| POST | `/api/documents` | Cria documento e grava o `.md`. Corpo: `{"title", "folder_id", "type?", "content?"}` |
| GET | `/api/documents/<id>` | Busca documento, incluindo o conteúdo Markdown |
| PATCH | `/api/documents/<id>` | Atualiza título, tipo, pasta e/ou conteúdo |
| DELETE | `/api/documents/<id>` | Envia para a lixeira (soft delete) |

### Planejados (ainda não existem no backend)

- Favoritos: `GET /api/favorites`, `POST`/`DELETE /api/documents/<id>/favorite`
- Assets (imagens): `GET`/`POST /api/documents/<id>/assets`, `GET`/`DELETE /api/assets/<id>`
- Lixeira: `GET /api/trash`, restaurar e excluir definitivamente
- Busca: `GET /api/search?q=`
- Tags: `GET /api/tags`, `POST`/`DELETE` por documento
- Perfil: `GET`/`PATCH /api/me`, `POST /api/me/avatar`
- Configurações: `GET`/`PATCH /api/settings`
- Import/export: `GET /api/export`, `POST /api/import`
- Links `[[Nome]]` e backlinks (Fase 2)
- Atalhos de conveniência: `/api/campaigns`, `/api/folders/tree`

---

## Decisões de arquitetura

Resumo. O detalhamento está em `docs/RPG_Character_Manager_Arquitetura_v2.md`.

- **Stack escolhida:** Python/Flask no lugar de Java/Spring, por afinidade e
  curva de aprendizado. SQLite no lugar de MySQL, porque é uma aplicação local
  de uma pessoa só e não precisa de servidor de banco.
- **Camadas no backend:** rota → service → model. A rota só recebe e responde.
  O service tem a regra de negócio. Assim a lógica pode ser testada sem simular
  HTTP.
- **Conteúdo em arquivo:** o banco guarda `content_path` (nome do arquivo). O
  texto vive em `storage/documents/<id>.md`. Renomear um documento não exige
  renomear o arquivo, porque o nome é baseado no ID.
- **Soft delete:** nada é apagado de verdade ainda. Pastas e documentos ganham
  uma data em `deleted_at` e somem das listagens normais.
- **Pasta pertence a um único pai:** sem relação N:N. Tags e buscas cobrirão
  a necessidade de "agrupar de outro jeito".
- **Frontend com camada `api/`:** os componentes nunca chamam `fetch` direto.
  Quando um endpoint ainda não existe, a função em `api/` devolve dados
  fictícios. Quando o endpoint é implementado, só a função muda.
- **Tema por variáveis CSS:** cores ficam em `frontend/src/styles/tokens.css`.
  Trocar a paleta não exige mexer nos componentes.

## Identidade visual

Estilo que mistura quatro referências, em camadas:

1. **Neo-brutalismo** como estrutura: bordas grossas, sombras duras (sem
   desfoque), cores chapadas.
2. **Minimalismo** como contenção: poucos elementos por tela, espaço em branco.
3. **Hand-drawn** como acento: ícones e divisórias com traço imperfeito
   (rough.js) e fonte manuscrita só em títulos.
4. **Gamificação** como recompensa: contadores, badges por tipo, mensagens de
   incentivo em telas vazias.

**Regras obrigatórias:**
- Zero cantos arredondados em qualquer elemento.
- Zero degradês de cor.
- Nada que lembre o "visual genérico de app gerado por IA" (glassmorphism,
  roxo-azul de SaaS, sombras suaves flutuando, fonte padrão sem personalidade).

**Direção de cor atual:** trocar o creme/âmbar por um tema padrão sombrio
(preto e vermelho), mantendo a alternância para um tema claro.

---

## Roadmap

| Fase | Objetivo | Situação |
|---|---|---|
| 1 | Estrutura do repositório, Git e GitHub | ✅ Concluída |
| 2 | Esqueleto do backend (Flask, app factory) | ✅ Concluída |
| 3 | Modelagem do banco (Folder, Document) | ✅ Concluída |
| 4 | CRUD de pastas | ✅ Concluída |
| 5 | CRUD de documentos (arquivo `.md` + metadado) | ✅ Concluída |
| 6 | Frontend inicial (React, telas principais) | ✅ Criado, em ajuste visual |
| 7 | Correções visuais: layout, menu responsivo, paleta, ícones | ⏳ Próxima etapa |
| 8 | Renomear projeto para Visual Codex e traduzir código para português | ⏳ Planejada |
| 9 | Favoritos, lixeira (restaurar), busca no backend | ⏳ Planejada |
| 10 | Upload de imagens (assets) | ⏳ Planejada (decisões pendentes: tamanho, formatos, thumbnail) |
| 11 | Tags, perfil local, configurações no backend | ⏳ Planejada |
| 12 | Testes automatizados (pytest) | ⏳ Planejada |
| 13 | Links `[[Nome]]` e backlinks | 🔮 Futuro |
| 14 | Import/export, empacotamento final | 🔮 Futuro |

---

## Convenções

**Commits:** mensagens curtas no padrão `tipo: descrição`, em português.
- `feat:` nova funcionalidade
- `fix:` correção de erro
- `chore:` organização, configuração, documentação
- `style:` mudança visual sem mudança de lógica

Exemplo: `feat: adiciona CRUD de pastas`.

**Backend:**
- Nomes de arquivo de documento: sempre `<id>.md`, nunca baseado no título.
- Listagens sempre filtram `deleted_at IS NULL`.
- Services retornam `None` quando não encontram o registro; a rota decide o 404.
- Regras de negócio violadas levantam `ValueError`, que a rota converte em 400.

**Frontend:**
- Nenhum componente chama `fetch` diretamente; passa pela pasta `api/`.
- Estilos usam as classes `bx-*` definidas em `styles/index.css` e as cores de
  `tokens.css`.

---

## Problemas conhecidos

Listados na seção [Status atual](#status-atual). Ao corrigir algum, atualize
esta seção e o `docs/PROGRESSO.md`.

---

## Documentação complementar

- `docs/RPG_Character_Manager_Arquitetura_v2.md`: decisões de arquitetura
- `docs/PROGRESSO.md`: histórico de cada etapa
- `openapi.yml`: contrato completo da API

---

*Projeto de estudo e uso pessoal. Desenvolvido passo a passo, com foco em entender
cada parte do código.*
