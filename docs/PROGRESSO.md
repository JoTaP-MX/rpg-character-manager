# Progresso do Projeto

## Parte 1 — Estrutura inicial + GitHub
- Pastas do projeto criadas (backend, frontend, storage, docs).
- Repositório Git inicializado e conectado ao GitHub.

## Parte 2 — Esqueleto do backend
- Ambiente virtual Python criado (backend/venv).
- Flask + Flask-SQLAlchemy instalados.
- App factory (`create_app`) criada em `app/__init__.py`.
- Rota de teste `/api/ping` funcionando.

## Parte 3 — Modelagem do banco
- Modelo `Folder` criado (hierarquia via parent_id, lixeira via deleted_at).
- Modelo `Document` criado (conteúdo referenciado por content_path, tipo híbrido).
- Script `create_db.py` gera as tabelas em instance/app.db.
