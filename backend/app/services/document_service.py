from datetime import datetime
from app.extensions import db
from app.models import Document
from app.storage import file_storage


def list_documents(folder_id=None):
    query = Document.query.filter(Document.deleted_at.is_(None))
    if folder_id is not None:
        query = query.filter(Document.folder_id == folder_id)
    return query.all()


def get_document(document_id):
    return Document.query.filter_by(id=document_id, deleted_at=None).first()


def get_document_content(document):
    return file_storage.read_content(document.content_path)


def create_document(title, folder_id, content='', doc_type='documento'):
    # 1. cria a linha no banco primeiro, só pra conseguir o ID gerado
    document = Document(title=title, folder_id=folder_id, type=doc_type, content_path='')
    db.session.add(document)
    db.session.commit()

    # 2. agora que já temos o ID, salvamos o conteúdo no arquivo e gravamos o nome no banco
    filename = f'{document.id}.md'
    file_storage.save_content(filename, content)
    document.content_path = filename
    db.session.commit()

    return document


def update_document(document_id, title=None, content=None, folder_id=None, doc_type=None):
    document = get_document(document_id)
    if not document:
        return None

    if title is not None:
        document.title = title
    if folder_id is not None:
        document.folder_id = folder_id
    if doc_type is not None:
        document.type = doc_type
    if content is not None:
        file_storage.save_content(document.content_path, content)

    document.updated_at = datetime.utcnow()
    db.session.commit()
    return document


def soft_delete_document(document_id):
    document = get_document(document_id)
    if not document:
        return None
    document.deleted_at = datetime.utcnow()
    db.session.commit()
    return document
