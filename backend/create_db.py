from app import create_app
from app.extensions import db
from app.models import Folder, Document  # noqa: F401 - garante que os modelos sejam registrados

app = create_app()

with app.app_context():
    db.create_all()
    print("Tabelas criadas com sucesso em instance/app.db")
