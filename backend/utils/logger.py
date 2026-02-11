"""
Centralized logging configuration for the application.
Logs to both console and rotating file handlers.
Critical for production environments without shell access (like LyteHosting).
"""

import logging
import sys
from pathlib import Path
from logging.handlers import RotatingFileHandler, TimedRotatingFileHandler
from datetime import datetime
from typing import Optional

from config import settings


# Create logs directory if it doesn't exist
LOGS_DIR = Path(__file__).parent.parent / "logs"
LOGS_DIR.mkdir(exist_ok=True)


class ColoredFormatter(logging.Formatter):
    """Custom formatter with colors for console output."""
    
    # ANSI color codes
    COLORS = {
        'DEBUG': '\033[36m',      # Cyan
        'INFO': '\033[32m',       # Green
        'WARNING': '\033[33m',    # Yellow
        'ERROR': '\033[31m',      # Red
        'CRITICAL': '\033[35m',   # Magenta
        'RESET': '\033[0m'        # Reset
    }
    
    def format(self, record):
        # Add color to levelname
        levelname = record.levelname
        if levelname in self.COLORS:
            record.levelname = f"{self.COLORS[levelname]}{levelname}{self.COLORS['RESET']}"
        return super().format(record)


def setup_logger(
    name: str,
    log_file: Optional[str] = None,
    level: int = logging.INFO,
    max_bytes: int = 10 * 1024 * 1024,  # 10MB
    backup_count: int = 5,
    use_daily_rotation: bool = False
) -> logging.Logger:
    """
    Set up a logger with both console and file handlers.
    
    Args:
        name: Logger name (usually __name__)
        log_file: Log file name (without path). If None, uses 'app.log'
        level: Logging level (DEBUG, INFO, WARNING, ERROR, CRITICAL)
        max_bytes: Maximum size of log file before rotation (for RotatingFileHandler)
        backup_count: Number of backup files to keep
        use_daily_rotation: If True, rotate logs daily instead of by size
    
    Returns:
        Configured logger instance
    """
    logger = logging.getLogger(name)
    
    # Avoid adding handlers multiple times
    if logger.handlers:
        return logger
    
    logger.setLevel(level)
    logger.propagate = False
    
    # Console handler with colors
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setLevel(level)
    console_formatter = ColoredFormatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    console_handler.setFormatter(console_formatter)
    logger.addHandler(console_handler)
    
    # File handler
    if log_file is None:
        log_file = "app.log"
    
    log_path = LOGS_DIR / log_file
    
    if use_daily_rotation:
        # Rotate logs daily, keep backups for specified days
        file_handler = TimedRotatingFileHandler(
            log_path,
            when='midnight',
            interval=1,
            backupCount=backup_count,
            encoding='utf-8'
        )
        file_handler.suffix = "%Y-%m-%d"
    else:
        # Rotate logs by size
        file_handler = RotatingFileHandler(
            log_path,
            maxBytes=max_bytes,
            backupCount=backup_count,
            encoding='utf-8'
        )
    
    file_handler.setLevel(level)
    file_formatter = logging.Formatter(
        fmt='%(asctime)s - %(name)s - %(levelname)s - [%(filename)s:%(lineno)d] - %(message)s',
        datefmt='%Y-%m-%d %H:%M:%S'
    )
    file_handler.setFormatter(file_formatter)
    logger.addHandler(file_handler)
    
    return logger


# Create default application logger
app_logger = setup_logger(
    name="letw_app",
    log_file="app.log",
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    use_daily_rotation=True,
    backup_count=30  # Keep 30 days of logs
)

# Create separate loggers for different components
db_logger = setup_logger(
    name="letw_db",
    log_file="database.log",
    level=logging.DEBUG if settings.DEBUG else logging.INFO,
    use_daily_rotation=True,
    backup_count=7  # Keep 7 days of database logs
)

auth_logger = setup_logger(
    name="letw_auth",
    log_file="auth.log",
    level=logging.INFO,
    use_daily_rotation=True,
    backup_count=30  # Keep 30 days of auth logs
)

error_logger = setup_logger(
    name="letw_error",
    log_file="errors.log",
    level=logging.ERROR,
    use_daily_rotation=True,
    backup_count=90  # Keep 90 days of error logs
)

# API request logger
api_logger = setup_logger(
    name="letw_api",
    log_file="api.log",
    level=logging.INFO,
    use_daily_rotation=True,
    backup_count=7  # Keep 7 days of API logs
)


def log_exception(logger: logging.Logger, exc: Exception, context: str = ""):
    """
    Log an exception with full traceback.
    
    Args:
        logger: Logger instance to use
        exc: Exception to log
        context: Additional context information
    """
    import traceback
    
    error_msg = f"{context}\n" if context else ""
    error_msg += f"Exception: {type(exc).__name__}: {str(exc)}\n"
    error_msg += f"Traceback:\n{''.join(traceback.format_tb(exc.__traceback__))}"
    
    logger.error(error_msg)
    error_logger.error(error_msg)


# Export commonly used loggers
__all__ = [
    'setup_logger',
    'app_logger',
    'db_logger',
    'auth_logger',
    'error_logger',
    'api_logger',
    'log_exception'
]

