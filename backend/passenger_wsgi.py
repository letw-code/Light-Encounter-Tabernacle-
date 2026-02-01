import os
import sys

# Add the application directory to the python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the FastAPI app
# 'main' is the file name (main.py), 'app' is the FastAPI instance
from main import app as application

# Import a2wsgi to bridge ASGI (FastAPI) to WSGI (Passenger/cPanel)
from a2wsgi import ASGIMiddleware

# Wrap the ASGI app with WSGI middleware
# Passenger looks for a 'application' callable in this file by default
application = ASGIMiddleware(application)
