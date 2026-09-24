from flask import Blueprint, request, jsonify
from app.services import document_service

documents_bp = Blueprint('documents', __name__, url_prefix='/api/documents')


def document_to_dict(document, include_content=False):
    data = {
        'id': document.id,
        'title': document.title,
        'type': document.type,
        'folder_id': document.folder_id,
        'created_at': document.created_at.isoformat(),
        'updated_at': document.updated_at.isoformat(),
    }
    if include_content:
        data['content'] = document_service.get_document_content(document)
    return data


@documents_bp.route('', methods=['GET'])
def list_documents():
    folder_id = request.args.get('folder_id', type=int)
    documents = document_service.list_documents(folder_id=folder_id)
    return jsonify([document_to_dict(d) for d in documents])


@documents_bp.route('', methods=['POST'])
def create_document():
    data = request.get_json() or {}
    title = data.get('title')
    folder_id = data.get('folder_id')
    if not title or not folder_id:
        return jsonify({'error': 'Os campos "title" e "folder_id" são obrigatórios.'}), 400

    document = document_service.create_document(
        title=title,
        folder_id=folder_id,
        content=data.get('content', ''),
        doc_type=data.get('type', 'documento'),
    )
    return jsonify(document_to_dict(document, include_content=True)), 201


@documents_bp.route('/<int:document_id>', methods=['GET'])
def get_document(document_id):
    document = document_service.get_document(document_id)
    if not document:
        return jsonify({'error': 'Documento não encontrado.'}), 404
    return jsonify(document_to_dict(document, include_content=True))


@documents_bp.route('/<int:document_id>', methods=['PATCH'])
def update_document(document_id):
    data = request.get_json() or {}
    document = document_service.update_document(
        document_id,
        title=data.get('title'),
        content=data.get('content'),
        folder_id=data.get('folder_id'),
        doc_type=data.get('type'),
    )
    if not document:
        return jsonify({'error': 'Documento não encontrado.'}), 404
    return jsonify(document_to_dict(document, include_content=True))


@documents_bp.route('/<int:document_id>', methods=['DELETE'])
def delete_document(document_id):
    document = document_service.soft_delete_document(document_id)
    if not document:
        return jsonify({'error': 'Documento não encontrado.'}), 404
    return '', 204
