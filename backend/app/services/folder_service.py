from datetime import datetime
from app.extensions import db
from app.models import Folder


def list_folders(parent_id=None):
    query = Folder.query.filter(Folder.deleted_at.is_(None))
    if parent_id is not None:
        query = query.filter(Folder.parent_id == parent_id)
    else:
        query = query.filter(Folder.parent_id.is_(None))
    return query.all()


def get_folder(folder_id):
    return Folder.query.filter_by(id=folder_id, deleted_at=None).first()


def create_folder(name, parent_id=None):
    folder = Folder(name=name, parent_id=parent_id)
    db.session.add(folder)
    db.session.commit()
    return folder


def rename_folder(folder_id, new_name):
    folder = get_folder(folder_id)
    if not folder:
        return None
    folder.name = new_name
    folder.updated_at = datetime.utcnow()
    db.session.commit()
    return folder


def move_folder(folder_id, new_parent_id):
    folder = get_folder(folder_id)
    if not folder:
        return None
    if new_parent_id == folder.id:
        raise ValueError('Uma pasta não pode ser movida para dentro dela mesma.')
    folder.parent_id = new_parent_id
    folder.updated_at = datetime.utcnow()
    db.session.commit()
    return folder


def soft_delete_folder(folder_id):
    folder = get_folder(folder_id)
    if not folder:
        return None
    folder.deleted_at = datetime.utcnow()
    db.session.commit()
    return folder
