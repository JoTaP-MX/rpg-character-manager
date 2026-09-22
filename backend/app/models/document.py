from datetime import datetime
from app.extensions import db


class Document(db.Model):
    __tablename__ = 'documents'

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(100), nullable=False, default='documento')
    content_path = db.Column(db.String(500), nullable=False)

    folder_id = db.Column(db.Integer, db.ForeignKey('folders.id'), nullable=False)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    updated_at = db.Column(db.DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    deleted_at = db.Column(db.DateTime, nullable=True)  # lixeira

    def __repr__(self):
        return f'<Document {self.title}>'
