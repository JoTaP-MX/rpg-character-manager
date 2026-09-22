from datetime import datetime
from app.extensions import db


class Folder(db.Model):
    __tablename__ = 'folders'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(255), nullable=False)
    parent_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)  # lixeira

    children = db.relationship('Folder', backref=db.backref('parent', remote_side=[id]))
    documents = db.relationship('Document', backref='folder', lazy=True)

    def __repr__(self):
        return f'<Folder {self.name}>'
