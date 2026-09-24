import os

_current_dir = os.path.dirname(os.path.abspath(__file__))       # backend/app/storage
_backend_dir = os.path.dirname(os.path.dirname(_current_dir))   # backend
_project_root = os.path.dirname(_backend_dir)                   # raiz do projeto

DOCUMENTS_DIR = os.path.join(_project_root, 'storage', 'documents')


def save_content(filename, content):
    os.makedirs(DOCUMENTS_DIR, exist_ok=True)
    path = os.path.join(DOCUMENTS_DIR, filename)
    with open(path, 'w', encoding='utf-8') as f:
        f.write(content)
    return path


def read_content(filename):
    path = os.path.join(DOCUMENTS_DIR, filename)
    with open(path, 'r', encoding='utf-8') as f:
        return f.read()


def delete_content(filename):
    path = os.path.join(DOCUMENTS_DIR, filename)
    if os.path.exists(path):
        os.remove(path)
