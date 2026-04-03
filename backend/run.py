#!/usr/bin/env python
"""Punto de entrada de la aplicación Flask."""

import os
from app import create_app

# Crear la app a nivel de módulo para que gunicorn pueda importarla en producción
app = create_app()

if __name__ == '__main__':
    debug = os.getenv('FLASK_DEBUG', 'false').lower() == 'true'
    port  = int(os.getenv('PORT', 5000))
    host  = os.getenv('FLASK_HOST', '127.0.0.1')

    app.run(debug=debug, host=host, port=port)
