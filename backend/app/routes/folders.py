from flask import Blueprint, request, jsonify
from app.services import folder_service

folders_bp = Blueprint('folders', __name__, url_prefix='/api/folders')


def folder_to_dict(folder):
    return {
        'id': folder.id,
        'name': folder.name,
        'parent_id': folder.parent_id,
        'created_at': folder.created_at.isoformat(),
        'updated_at': folder.updated_at.isoformat(),
    }


@folders_bp.route('', methods=['GET'])
def list_folders():
    parent_id = request.args.get('parent_id', type=int)
    folders = folder_service.list_folders(parent_id=parent_id)
    return jsonify([folder_to_dict(f) for f in folders])


@folders_bp.route('', methods=['POST'])
def create_folder():
    data = request.get_json() or {}
    name = data.get('name')
    if not name:
        return jsonify({'error': 'O campo "name" é obrigatório.'}), 400
    folder = folder_service.create_folder(name=name, parent_id=data.get('parent_id'))
    return jsonify(folder_to_dict(folder)), 201


@folders_bp.route('/<int:folder_id>', methods=['GET'])
def get_folder(folder_id):
    folder = folder_service.get_folder(folder_id)
    if not folder:
        return jsonify({'error': 'Pasta não encontrada.'}), 404
    return jsonify(folder_to_dict(folder))


@folders_bp.route('/<int:folder_id>', methods=['PATCH'])
def update_folder(folder_id):
    data = request.get_json() or {}
    folder = folder_service.get_folder(folder_id)
    if not folder:
        return jsonify({'error': 'Pasta não encontrada.'}), 404

    if 'name' in data:
        folder = folder_service.rename_folder(folder_id, data['name'])
    if 'parent_id' in data:
        try:
            folder = folder_service.move_folder(folder_id, data['parent_id'])
        except ValueError as e:
            return jsonify({'error': str(e)}), 400

    return jsonify(folder_to_dict(folder))


@folders_bp.route('/<int:folder_id>', methods=['DELETE'])
def delete_folder(folder_id):
    folder = folder_service.soft_delete_folder(folder_id)
    if not folder:
        return jsonify({'error': 'Pasta não encontrada.'}), 404
    return '', 204
