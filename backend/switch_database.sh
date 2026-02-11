#!/bin/bash

# Database Switcher Script
# Helps switch between MySQL and PostgreSQL for testing

set -e

echo "================================"
echo "Database Configuration Switcher"
echo "================================"
echo ""
echo "Current database configuration:"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    echo "Please create .env file first (copy from .env.example if available)"
    exit 1
fi

# Show current DATABASE_URL (masked password)
current_db=$(grep "^DATABASE_URL=" .env | head -1)
if [ -z "$current_db" ]; then
    echo "❌ DATABASE_URL not found in .env"
    exit 1
fi

# Mask password in display
masked_db=$(echo "$current_db" | sed 's/:[^:@]*@/:****@/')
echo "$masked_db"
echo ""

# Detect current database type
if echo "$current_db" | grep -q "mysql"; then
    current_type="MySQL"
elif echo "$current_db" | grep -q "postgresql"; then
    current_type="PostgreSQL"
else
    current_type="Unknown"
fi

echo "Detected type: $current_type"
echo ""
echo "What would you like to do?"
echo ""
echo "1) Switch to MySQL (local testing)"
echo "2) Switch to PostgreSQL (production-like)"
echo "3) Show current configuration"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
    1)
        echo ""
        echo "Switching to MySQL..."
        echo ""
        read -p "MySQL username [letw_user]: " mysql_user
        mysql_user=${mysql_user:-letw_user}
        
        read -sp "MySQL password: " mysql_pass
        echo ""
        
        read -p "MySQL host [localhost]: " mysql_host
        mysql_host=${mysql_host:-localhost}
        
        read -p "MySQL port [3306]: " mysql_port
        mysql_port=${mysql_port:-3306}
        
        read -p "MySQL database [letw_db]: " mysql_db
        mysql_db=${mysql_db:-letw_db}
        
        new_url="mysql+aiomysql://${mysql_user}:${mysql_pass}@${mysql_host}:${mysql_port}/${mysql_db}"
        
        # Backup current .env
        cp .env .env.backup
        
        # Update DATABASE_URL
        sed -i.tmp "s|^DATABASE_URL=.*|DATABASE_URL=${new_url}|" .env
        rm -f .env.tmp
        
        echo ""
        echo "✅ Switched to MySQL"
        echo "   Connection: mysql+aiomysql://${mysql_user}:****@${mysql_host}:${mysql_port}/${mysql_db}"
        echo ""
        echo "📝 Backup saved to .env.backup"
        echo ""
        echo "Next steps:"
        echo "1. Ensure MySQL is running: sudo systemctl status mysql"
        echo "2. Ensure database exists: mysql -u ${mysql_user} -p ${mysql_db}"
        echo "3. Restart your application"
        ;;
        
    2)
        echo ""
        echo "Switching to PostgreSQL..."
        echo ""
        read -p "PostgreSQL username [postgres]: " pg_user
        pg_user=${pg_user:-postgres}
        
        read -sp "PostgreSQL password: " pg_pass
        echo ""
        
        read -p "PostgreSQL host [localhost]: " pg_host
        pg_host=${pg_host:-localhost}
        
        read -p "PostgreSQL port [5432]: " pg_port
        pg_port=${pg_port:-5432}
        
        read -p "PostgreSQL database [letw]: " pg_db
        pg_db=${pg_db:-letw}
        
        new_url="postgresql+asyncpg://${pg_user}:${pg_pass}@${pg_host}:${pg_port}/${pg_db}"
        
        # Backup current .env
        cp .env .env.backup
        
        # Update DATABASE_URL
        sed -i.tmp "s|^DATABASE_URL=.*|DATABASE_URL=${new_url}|" .env
        rm -f .env.tmp
        
        echo ""
        echo "✅ Switched to PostgreSQL"
        echo "   Connection: postgresql+asyncpg://${pg_user}:****@${pg_host}:${pg_port}/${pg_db}"
        echo ""
        echo "📝 Backup saved to .env.backup"
        echo ""
        echo "Next steps:"
        echo "1. Ensure PostgreSQL is running: sudo systemctl status postgresql"
        echo "2. Ensure database exists: psql -U ${pg_user} -d ${pg_db}"
        echo "3. Restart your application"
        ;;
        
    3)
        echo ""
        echo "Current configuration:"
        echo "====================="
        echo ""
        echo "Database URL: $masked_db"
        echo "Type: $current_type"
        echo ""
        ;;
        
    4)
        echo ""
        echo "Exiting..."
        exit 0
        ;;
        
    *)
        echo ""
        echo "❌ Invalid choice"
        exit 1
        ;;
esac

echo ""
echo "Done!"

