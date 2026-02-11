#!/bin/bash

# Easy MySQL Setup Script for LETW
# This script sets up MySQL database without needing root password

set -e

echo "========================================"
echo "  MySQL Easy Setup for LETW"
echo "========================================"
echo ""
echo "This script will:"
echo "  1. Create database 'letw_db'"
echo "  2. Create user 'letw_user'"
echo "  3. Set password 'letw_password_2024'"
echo "  4. Grant all privileges"
echo ""
read -p "Continue? (y/n): " confirm

if [ "$confirm" != "y" ]; then
    echo "Aborted."
    exit 0
fi

echo ""
echo "Setting up MySQL..."
echo ""

# Check if MySQL is installed
if ! command -v mysql &> /dev/null; then
    echo "❌ MySQL is not installed!"
    echo ""
    read -p "Would you like to install MySQL now? (y/n): " install_mysql
    
    if [ "$install_mysql" = "y" ]; then
        echo "Installing MySQL..."
        sudo apt-get update
        sudo apt-get install mysql-server -y
        echo "✅ MySQL installed"
    else
        echo "Please install MySQL first: sudo apt-get install mysql-server"
        exit 1
    fi
fi

# Check if MySQL is running
if ! sudo systemctl is-active --quiet mysql; then
    echo "Starting MySQL..."
    sudo systemctl start mysql
fi

echo "Creating database and user..."
echo ""

# Use sudo mysql to avoid password issues
sudo mysql <<EOF
-- Drop existing database and user if they exist (fresh start)
DROP DATABASE IF EXISTS letw_db;
DROP USER IF EXISTS 'letw_user'@'localhost';

-- Create database
CREATE DATABASE letw_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- Create user with password
CREATE USER 'letw_user'@'localhost' IDENTIFIED BY 'letw_password_2024';

-- Grant all privileges
GRANT ALL PRIVILEGES ON letw_db.* TO 'letw_user'@'localhost';

-- Flush privileges
FLUSH PRIVILEGES;

-- Show databases to confirm
SELECT 'Databases:' as '';
SHOW DATABASES;

-- Show users to confirm
SELECT 'Users:' as '';
SELECT user, host FROM mysql.user WHERE user = 'letw_user';
EOF

if [ $? -eq 0 ]; then
    echo ""
    echo "========================================"
    echo "  ✅ MySQL Setup Complete!"
    echo "========================================"
    echo ""
    echo "Database Details:"
    echo "  Database: letw_db"
    echo "  Username: letw_user"
    echo "  Password: letw_password_2024"
    echo "  Host:     localhost"
    echo "  Port:     3306"
    echo ""
    echo "Connection String:"
    echo "  DATABASE_URL=mysql+aiomysql://letw_user:letw_password_2024@localhost:3306/letw_db"
    echo ""
    echo "Next Steps:"
    echo "  1. Update your .env file with the connection string above"
    echo "  2. Install Python MySQL driver:"
    echo "     pip install aiomysql pymysql cryptography"
    echo "  3. Test connection:"
    echo "     mysql -u letw_user -p letw_db"
    echo "     (password: letw_password_2024)"
    echo ""
    
    # Ask if user wants to update .env automatically
    if [ -f .env ]; then
        echo "Found .env file"
        read -p "Update .env with MySQL connection? (y/n): " update_env
        
        if [ "$update_env" = "y" ]; then
            # Backup current .env
            cp .env .env.backup.$(date +%Y%m%d_%H%M%S)
            echo "✅ Backed up .env to .env.backup.$(date +%Y%m%d_%H%M%S)"
            
            # Update DATABASE_URL
            if grep -q "^DATABASE_URL=" .env; then
                # Comment out old DATABASE_URL
                sed -i 's/^DATABASE_URL=/#DATABASE_URL=/' .env
                # Add new DATABASE_URL
                echo "" >> .env
                echo "# MySQL connection (added by setup_mysql_easy.sh)" >> .env
                echo "DATABASE_URL=mysql+aiomysql://letw_user:letw_password_2024@localhost:3306/letw_db" >> .env
                echo "✅ Updated .env file"
            else
                echo "" >> .env
                echo "# MySQL connection" >> .env
                echo "DATABASE_URL=mysql+aiomysql://letw_user:letw_password_2024@localhost:3306/letw_db" >> .env
                echo "✅ Added DATABASE_URL to .env"
            fi
        fi
    fi
    
    echo ""
    echo "Test the connection:"
    echo "  mysql -u letw_user -p letw_db"
    echo ""
    
else
    echo ""
    echo "❌ Setup failed!"
    echo ""
    echo "Troubleshooting:"
    echo "  1. Check if MySQL is running:"
    echo "     sudo systemctl status mysql"
    echo "  2. Check MySQL error log:"
    echo "     sudo tail -f /var/log/mysql/error.log"
    echo "  3. Try manual setup - see RESET_MYSQL_PASSWORD.md"
    echo ""
    exit 1
fi

