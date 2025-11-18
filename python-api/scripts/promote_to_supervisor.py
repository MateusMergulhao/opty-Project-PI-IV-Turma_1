"""
Script to promote a user to supervisor role.

Usage:
  python scripts/promote_to_supervisor.py promote <email>   # Promote user to supervisor
  python scripts/promote_to_supervisor.py demote <email>    # Demote supervisor to user
  python scripts/promote_to_supervisor.py list              # List all supervisors
"""

# --- IMPORTS ---
from dotenv import load_dotenv
from opty_api.mongo.setup.connection import MongoDBSetup
from opty_api.mongo.repositories.users import UserRepository

import asyncio
import sys
import os


# --- GLOBALS ---
load_dotenv()

mongodb = MongoDBSetup(db_name=os.getenv('MONGODB_DB_NAME'), mongodb_url=os.getenv('MONGODB_URL'))
user_repository = UserRepository(mongodb)

# Add parent directory to path to import opty_api
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))


# --- CODE ---
async def promote_user(email: str) -> bool:
    """
    Promote a user to supervisor role by email.

    :param email: User's email address
    """
    try:
        # Find user by email
        user = await user_repository.get_by_email(email)

        # User not found: print and return False
        if not user:
            print(f'❌ User with email "{email}" not found.')
            return False

        # User already supervisor: print and return True
        if user['role'] == 'supervisor':
            print(f'ℹ️  User "{email}" is already a supervisor.')
            return True

        # Update user role to supervisor
        success = await user_repository.update_role(email, 'supervisor')

        # Print success message
        print(f'✅ Successfully promoted "{email}" to supervisor!')
        print(f'   Name: {user.name}')
        print(f'   Supabase ID: {user.supabase_id}')

        # Return success status
        return True

    # Error occurred: print and return False
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        return False

    # Close MongoDB connection
    finally:
        mongodb.close_db()


async def demote_user(email: str) -> bool:
    """
    Demote a supervisor back to regular user.

    :param email: User's email address
    """
    try:
        # Find user by email
        user = await user_repository.get_by_email(email)

        # User not found: print and return False
        if not user:
            print(f'❌ User with email "{email}" not found.')
            return False

        # User already regular user: print and return True
        if user.role == 'user':
            print(f'ℹ️  User "{email}" is already a regular user.')
            return True

        # Update user role to user
        await user_repository.update_role(email, 'user')

        # Print success message
        print(f'✅ Successfully demoted "{email}" to regular user!')
        print(f'   Name: {user.name}')
        print(f'   Supabase ID: {user.supabase_id}')

        # Return success status
        return True

    # Error occurred: print and return False
    except Exception as e:
        print(f'❌ Error: {str(e)}')
        return False

    # Close MongoDB connection
    finally:
        mongodb.close_db()


async def list_supervisors() -> None:
    """
    List all supervisors in the system.
    """
    try:
        # Find all supervisors
        supervisors = await user_repository.get_by_role('supervisor')

        # No supervisors found: print message
        if not supervisors:
            print('ℹ️  No supervisors found in the system.')
            return

        # Print supervisors
        print(f'\n📋 Supervisors ({len(supervisors)}):')
        print('=' * 80)
        for supervisor in supervisors:
            status = '✅ Active' if supervisor.is_active else '❌ Inactive'
            print(f'  • {supervisor.name} ({supervisor.email})')
            print(f'    Status: {status}')
            print(f'    Created: {supervisor.created_at}')
            print()

    # Error occurred: print message
    except Exception as e:
        print(f'❌ Error: {str(e)}')

    # Close MongoDB connection
    finally:
        mongodb.close_db()


def print_usage() -> None:
    """
    Print script usage information.
    """
    print("""
🔐 Supervisor Management Script

Usage:
  python scripts/promote_to_supervisor.py promote <email>   # Promote user to supervisor
  python scripts/promote_to_supervisor.py demote <email>    # Demote supervisor to user
  python scripts/promote_to_supervisor.py list              # List all supervisors

Examples:
  python scripts/promote_to_supervisor.py promote admin@example.com
  python scripts/promote_to_supervisor.py demote admin@example.com
  python scripts/promote_to_supervisor.py list

Environment Variables:
  MONGODB_URL      - MongoDB connection string
  MONGODB_DB_NAME  - Database name
""")


if __name__ == '__main__':
    """
    Main entry point for the script.
    """

    # No arguments provided: print usage and exit
    if len(sys.argv) < 2:
        print_usage()
        sys.exit(1)

    # Get command from arguments
    command = sys.argv[1].lower()

    # Promote user to supervisor
    if command == 'promote':

        # Check if email argument is provided
        if len(sys.argv) < 3:
            print('❌ Error: Email address required.')
            print('Usage: python scripts/promote_to_supervisor.py promote <email>')
            sys.exit(1)

        # Get email argument
        email = sys.argv[2]

        # Promote user to supervisor
        success = asyncio.run(promote_user(email))

        # Exit
        sys.exit(0 if success else 1)

    # Demote supervisor to user
    elif command == 'demote':

        # Check if email argument is provided
        if len(sys.argv) < 3:
            print('❌ Error: Email address required.')
            print('Usage: python scripts/promote_to_supervisor.py demote <email>')
            sys.exit(1)

        # Get email argument
        email = sys.argv[2]

        # Demote supervisor to user
        success = asyncio.run(demote_user(email))

        # Exit
        sys.exit(0 if success else 1)

    # List all supervisors
    elif command == 'list':

        # List supervisors
        asyncio.run(list_supervisors())

        # Exit
        sys.exit(0)

    # Unknown command: print usage and exit
    else:
        print(f'❌ Unknown command: {command}')
        print_usage()
        sys.exit(1)
