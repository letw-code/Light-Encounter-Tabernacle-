"""
Database configuration and session management.
Uses SQLAlchemy 2.0 async engine with asyncpg for PostgreSQL or aiomysql for MySQL.
"""

from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase
from sqlalchemy.pool import NullPool
from config import settings

# Import logger - use print as fallback to avoid circular imports during initial setup
try:
    from utils.logger import db_logger
    logger = db_logger
except ImportError:
    import logging
    logger = logging.getLogger(__name__)
    logger.addHandler(logging.StreamHandler())
    logger.setLevel(logging.INFO)


db_scheme = settings.DATABASE_URL.split('://')[0]
logger.info(f"Using database URL scheme: {db_scheme}")

# Determine if using Supabase (needs special PgBouncer settings)
is_supabase = "supabase.com" in settings.DATABASE_URL or "pooler.supabase.com" in settings.DATABASE_URL

# For Supabase with asyncpg: disable prepared statement caching for PgBouncer compatibility
# For other PostgreSQL: use default settings
if is_supabase:
    # asyncpg connect_args for PgBouncer transaction pooling mode
    # CRITICAL: Both parameters are needed for full compatibility
    async_connect_args = {
        "prepared_statement_cache_size": 0,  # SQLAlchemy dialect parameter
        "statement_cache_size": 0,            # asyncpg native parameter
        "server_settings": {
            "jit": "off"  # Disable JIT for better pgbouncer compatibility
        },
    }
    logger.info("Supabase detected - disabling prepared statement cache for PgBouncer compatibility")
else:
    async_connect_args = {}
    logger.info("Using standard database connection settings")

# Async engine for FastAPI
# NullPool ensures we don't do any pooling on SQLAlchemy side (let PgBouncer handle it)
# This is CRITICAL for pgbouncer compatibility
engine = create_async_engine(
    settings.DATABASE_URL,
    echo=settings.DEBUG,  # Log SQL queries in debug mode
    future=True,
    poolclass=NullPool,  # CRITICAL: Let pgbouncer handle pooling
    connect_args=async_connect_args,
)

logger.info("Async database engine created with NullPool")
if settings.DEBUG:
    logger.debug("SQL query echo enabled (DEBUG mode)")

# Async session factory
AsyncSessionLocal = async_sessionmaker(
    engine,
    class_=AsyncSession,
    expire_on_commit=False
)


class Base(DeclarativeBase):
    """Base class for all database models."""
    pass


# Dependency to get async database session
async def get_db():
    """
    Dependency that provides a database session.
    Automatically closes the session after the request.
    """
    logger.debug("Creating async database session...")
    try:
        async with AsyncSessionLocal() as session:
            logger.debug("Database session created successfully")
            try:
                yield session
            finally:
                await session.close()
                logger.debug("Database session closed")
    except Exception as e:
        logger.error(f"ERROR creating database session: {type(e).__name__}: {e}", exc_info=True)
        raise


async def init_db():
    """Create all database tables."""
    logger.info("Initializing database tables...")
    try:
        async with engine.begin() as conn:
            await conn.run_sync(Base.metadata.create_all)
        logger.info("Database tables created/verified successfully")
    except Exception as e:
        logger.error(f"ERROR initializing database: {type(e).__name__}: {e}", exc_info=True)
        raise
