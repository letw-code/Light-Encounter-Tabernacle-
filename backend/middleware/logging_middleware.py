"""
Logging middleware for FastAPI.
Logs all incoming requests and responses for debugging and monitoring.
"""

import time
import json
from typing import Callable
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp

from utils.logger import api_logger, error_logger


class LoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log all HTTP requests and responses.
    Useful for debugging and monitoring in production without shell access.
    """
    
    def __init__(self, app: ASGIApp):
        super().__init__(app)
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Process each request and log details.
        """
        # Generate unique request ID
        request_id = f"{int(time.time() * 1000)}"
        
        # Start timer
        start_time = time.time()
        
        # Extract request details
        method = request.method
        url = str(request.url)
        client_host = request.client.host if request.client else "unknown"
        
        # Log request
        api_logger.info(
            f"[{request_id}] {method} {url} - Client: {client_host}"
        )
        
        # Log request headers (excluding sensitive data)
        headers = dict(request.headers)
        safe_headers = {
            k: v for k, v in headers.items() 
            if k.lower() not in ['authorization', 'cookie', 'x-api-key']
        }
        api_logger.debug(f"[{request_id}] Headers: {safe_headers}")
        
        # Log query parameters
        if request.query_params:
            api_logger.debug(f"[{request_id}] Query params: {dict(request.query_params)}")
        
        # Process request and catch any errors
        try:
            response = await call_next(request)
            
            # Calculate processing time
            process_time = time.time() - start_time
            
            # Log response
            status_code = response.status_code
            log_level = "info" if status_code < 400 else "warning" if status_code < 500 else "error"
            
            log_message = (
                f"[{request_id}] {method} {url} - "
                f"Status: {status_code} - "
                f"Duration: {process_time:.3f}s"
            )
            
            if log_level == "info":
                api_logger.info(log_message)
            elif log_level == "warning":
                api_logger.warning(log_message)
            else:
                api_logger.error(log_message)
                error_logger.error(log_message)
            
            # Add custom headers
            response.headers["X-Request-ID"] = request_id
            response.headers["X-Process-Time"] = f"{process_time:.3f}"
            
            return response
            
        except Exception as exc:
            # Log exception
            process_time = time.time() - start_time
            error_message = (
                f"[{request_id}] {method} {url} - "
                f"EXCEPTION: {type(exc).__name__}: {str(exc)} - "
                f"Duration: {process_time:.3f}s"
            )
            
            api_logger.error(error_message)
            error_logger.error(error_message, exc_info=True)
            
            # Re-raise the exception to be handled by FastAPI
            raise


class RequestBodyLoggingMiddleware(BaseHTTPMiddleware):
    """
    Middleware to log request bodies (use with caution - may log sensitive data).
    Only enable in development or for specific debugging scenarios.
    """
    
    def __init__(self, app: ASGIApp, log_body: bool = False):
        super().__init__(app)
        self.log_body = log_body
    
    async def dispatch(self, request: Request, call_next: Callable) -> Response:
        """
        Log request body if enabled.
        """
        if self.log_body and request.method in ["POST", "PUT", "PATCH"]:
            try:
                # Read body
                body = await request.body()
                
                # Try to parse as JSON
                try:
                    body_json = json.loads(body.decode())
                    # Remove sensitive fields
                    safe_body = {
                        k: v for k, v in body_json.items()
                        if k.lower() not in ['password', 'token', 'secret', 'api_key']
                    }
                    api_logger.debug(f"Request body: {safe_body}")
                except (json.JSONDecodeError, UnicodeDecodeError):
                    api_logger.debug(f"Request body (non-JSON): {len(body)} bytes")
                
            except Exception as e:
                api_logger.warning(f"Could not log request body: {e}")
        
        response = await call_next(request)
        return response


def setup_logging_middleware(app):
    """
    Add logging middleware to FastAPI app.
    
    Args:
        app: FastAPI application instance
    """
    # Add request/response logging
    app.add_middleware(LoggingMiddleware)
    
    # Optionally add request body logging (disabled by default for security)
    # app.add_middleware(RequestBodyLoggingMiddleware, log_body=False)
    
    api_logger.info("Logging middleware initialized")

